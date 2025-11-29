const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidObjectId = (id) => {
    if (!id || typeof id !== 'string') return false;
    return ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
};

const createCheckoutSession = async (req, res) => {
    try {
        const { bookingId, customerEmail } = req.body;
        
        if (!bookingId) {
            return res.status(400).send({ 
                error: "Booking ID is required",
                message: "Please provide a valid booking ID" 
            });
        }

        if (!isValidObjectId(bookingId)) {
            return res.status(400).send({ 
                error: "Invalid Booking ID",
                message: "Booking ID must be a valid 24-character hexadecimal string" 
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

        const amount = parseInt(booking.price, 10) * 100; // Convert to cents
        
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).send({ 
                error: "Invalid booking price",
                message: "Booking has an invalid or missing price" 
            });
        }

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
    const isDev = process.env.NODE_ENV !== 'production';

    // Guard: Check if webhook secret is configured
    if (!endpointSecret) {
        console.error('Webhook secret not configured');
        return res.status(500).send({ 
            error: "Webhook configuration error",
            message: "Server is not properly configured to handle webhooks" 
        });
    }

    if (isDev) {
        console.log('Received Stripe webhook');
    }

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        if (isDev) {
            console.log('Webhook verified, type:', event.type);
        }
    } catch (err) {
        console.error('Webhook verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                if (isDev) {
                    console.log('Processing checkout.session.completed');
                }
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            case 'payment_intent.succeeded':
                if (isDev) {
                    console.log('PaymentIntent succeeded:', event.data.object.id);
                }
                break;
            case 'payment_intent.payment_failed':
                console.error('PaymentIntent failed:', event.data.object.id);
                break;
            default:
                if (isDev) {
                    console.log('Unhandled event type:', event.type);
                }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook:', error.message);
        if (isDev) {
            console.error('Stack:', error.stack);
        }
        res.status(500).send({ error: 'Webhook handler failed' });
    }
};

const handleCheckoutSessionCompleted = async (session) => {
    const { paymentsCollection, bookingsCollection } = getCollections();
    const isDev = process.env.NODE_ENV !== 'production';
    
    const bookingId = session.client_reference_id || session.metadata.bookingId;
    
    if (!bookingId) {
        console.error('No booking ID in session');
        return;
    }

    if (!isValidObjectId(bookingId)) {
        console.error('Invalid booking ID format:', bookingId);
        throw new Error(`Invalid booking ID format: ${bookingId}`);
    }

    try {
        // Verify booking exists before processing
        const existingBooking = await bookingsCollection.findOne({ 
            _id: new ObjectId(bookingId) 
        });

        if (!existingBooking) {
            console.error('Booking not found:', bookingId);
            throw new Error(`Booking ${bookingId} not found`);
        }

        if (isDev) {
            console.log('Processing payment for:', existingBooking.packageName);
        }

        // Idempotency check: Check if payment already exists
        const paymentIntentId = session.payment_intent;
        const sessionId = session.id;
        
        const existingPayment = await paymentsCollection.findOne({
            $or: [
                { paymentIntentId: paymentIntentId },
                { sessionId: sessionId }
            ]
        });

        if (existingPayment) {
            if (isDev) {
                console.log('Payment already exists, skipping duplicate');
            }
            return;
        }

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

        await paymentsCollection.insertOne(paymentData);

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

        if (updateResult.modifiedCount === 0) {
            console.warn('Booking not modified, may already be updated');
        }

        if (isDev) {
            console.log('Payment processed successfully for booking:', bookingId);
        }

    } catch (error) {
        console.error('Error processing payment:', error.message);
        if (isDev) {
            console.error('Stack:', error.stack);
        }
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
