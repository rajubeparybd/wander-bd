const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        const { price } = req.body;
        const amount = parseInt(price) * 100;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "bdt",
            payment_method_types: ["card"],
        });

        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const savePayment = async (req, res) => {
    try {
        const payment = req.body;
        const { paymentsCollection, bookingsCollection } = getCollections();

        // Save payment
        const result = await paymentsCollection.insertOne(payment);

        // Update booking status
        const bookingId = payment.bookingId;
        const updateResult = await bookingsCollection.updateOne(
            { _id: new ObjectId(bookingId) },
            {
                $set: {
                    status: "In Review",
                    transactionId: payment.transactionId,
                },
            }
        );

        res.send({
            insertedId: result.insertedId,
            updated: updateResult.modifiedCount
        });
    } catch (error) {
        console.error("Error saving payment:", error);
        res.status(500).send({ message: "Server error" });
    }
};

module.exports = {
    createPaymentIntent,
    savePayment
};
