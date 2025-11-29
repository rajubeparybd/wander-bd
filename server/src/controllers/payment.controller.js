const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
    try {
        const { bookingId, customerEmail } = req.body;
        
        if (!bookingId) {
            return res.status(400).send({ 
                error: "Booking ID is required",
                message: "Please provide a valid booking ID" 
            });
        }

        const { bookingsCollection } = getCollections();
        
        // Fetch booking details
        const booking = await bookingsCollection.findOne({ 
            _id: new ObjectId(bookingId) 
        });

        if (!booking) {
            return res.status(404).send({ 
                error: "Booking not found",
                message: "The specified booking does not exist" 
            });
        }

        if (booking.status !== "Pending") {
            return res.status(400).send({ 
                error: "Invalid booking status",
                message: "This booking has already been processed" 
            });
        }

        const amount = parseInt(booking.price) * 100; // Convert to cents

        // Get client URL with fallback
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        // Use provided email or fallback to booking email
        const email = customerEmail || booking.touristEmail;

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: email, // Pre-fill customer email
            line_items: [
                {
                    price_data: {
                        currency: 'bdt',
                        product_data: {
                            name: booking.packageName || 'Tour Package',
                            description: `Tour Date: ${booking.tourDate || 'TBD'}`,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${clientUrl}/payment-cancel?booking_id=${bookingId}`,
            client_reference_id: bookingId,
            metadata: {
                bookingId: bookingId,
                touristEmail: email,
                packageName: booking.packageName,
            },
        });

        res.send({ 
            sessionId: session.id,
            url: session.url 
        });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).send({ 
            error: error.message || "Server error",
            message: "Failed to create checkout session" 
        });
    }
};

const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    console.log('=== Received Stripe Webhook ===');
    console.log('Signature present:', !!sig);
    console.log('Endpoint secret configured:', !!endpointSecret);

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log('✓ Webhook signature verified');
        console.log('Event type:', event.type);
    } catch (err) {
        console.error('❌ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                console.log('Processing checkout.session.completed event...');
                await handleCheckoutSessionCompleted(event.data.object);
                console.log('✅ checkout.session.completed processed successfully');
                break;
            case 'payment_intent.succeeded':
                console.log('✓ PaymentIntent succeeded:', event.data.object.id);
                break;
            case 'payment_intent.payment_failed':
                console.log('❌ PaymentIntent failed:', event.data.object.id);
                break;
            default:
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('❌ Error handling webhook:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            eventType: event?.type
        });
        res.status(500).send({ error: 'Webhook handler failed' });
    }
};

const handleCheckoutSessionCompleted = async (session) => {
    const { paymentsCollection, bookingsCollection } = getCollections();
    
    const bookingId = session.client_reference_id || session.metadata.bookingId;
    
    console.log('=== Webhook: Checkout Session Completed ===');
    console.log('Session ID:', session.id);
    console.log('Booking ID:', bookingId);
    console.log('Payment Status:', session.payment_status);
    console.log('Amount Total:', session.amount_total);
    
    if (!bookingId) {
        console.error('❌ No booking ID found in session');
        return;
    }

    try {
        // Verify booking exists before processing
        const existingBooking = await bookingsCollection.findOne({ 
            _id: new ObjectId(bookingId) 
        });

        if (!existingBooking) {
            console.error('❌ Booking not found:', bookingId);
            throw new Error(`Booking ${bookingId} not found`);
        }

        console.log('✓ Booking found:', existingBooking.packageName);
        console.log('✓ Current booking status:', existingBooking.status);

        // Save payment record
        const paymentData = {
            bookingId: bookingId,
            sessionId: session.id,
            paymentIntentId: session.payment_intent,
            amount: session.amount_total / 100, // Convert from cents
            currency: session.currency,
            customerEmail: session.customer_details?.email || session.metadata.touristEmail,
            paymentStatus: session.payment_status,
            status: "In Review",
            createdAt: new Date(),
            metadata: session.metadata,
        };

        const paymentResult = await paymentsCollection.insertOne(paymentData);
        console.log('✓ Payment saved with ID:', paymentResult.insertedId);

        // Update booking status
        const updateResult = await bookingsCollection.updateOne(
            { _id: new ObjectId(bookingId) },
            {
                $set: {
                    status: "In Review",
                    paymentStatus: "paid",
                    sessionId: session.id,
                    paymentIntentId: session.payment_intent,
                    paidAt: new Date(),
                },
            }
        );

        console.log('✓ Booking update result:', {
            matched: updateResult.matchedCount,
            modified: updateResult.modifiedCount,
            acknowledged: updateResult.acknowledged
        });

        if (updateResult.modifiedCount === 0) {
            console.warn('⚠️ Booking was not modified. It may already be updated.');
        } else {
            console.log('✅ Booking status successfully updated to "In Review"');
        }

        // Verify the update
        const updatedBooking = await bookingsCollection.findOne({ 
            _id: new ObjectId(bookingId) 
        });
        console.log('✓ Verified booking status:', updatedBooking.status);
        console.log('=== Webhook Processing Complete ===');

    } catch (error) {
        console.error('❌ Error in handleCheckoutSessionCompleted:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            bookingId: bookingId
        });
        throw error;
    }
};

const verifyPaymentSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        if (!sessionId) {
            return res.status(400).send({ 
                error: "Session ID is required" 
            });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        res.send({
            success: true,
            paymentStatus: session.payment_status,
            customerEmail: session.customer_details?.email,
            amountTotal: session.amount_total / 100,
        });
    } catch (error) {
        console.error("Error verifying session:", error);
        res.status(500).send({ 
            error: error.message || "Failed to verify session" 
        });
    }
};

module.exports = {
    createCheckoutSession,
    handleWebhook,
    verifyPaymentSession
};
