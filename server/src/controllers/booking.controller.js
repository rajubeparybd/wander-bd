const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');

const createBooking = async (req, res) => {
    try {
        const booking = req.body;
        booking.status = "Pending";

        const { bookingsCollection } = getCollections();
        const result = await bookingsCollection.insertOne(booking);
        res.send(result);
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const getBookingsByEmail = async (req, res) => {
    try {
        const email = req.query.email;
        const { bookingsCollection } = getCollections();

        const bookings = await bookingsCollection.find({ touristEmail: email }).toArray();
        res.send(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const getBookingsByGuideEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const { bookingsCollection } = getCollections();

        const bookings = await bookingsCollection.find({ tourGuideEmail: email }).toArray();
        res.send(bookings);
    } catch (error) {
        console.error("Error fetching guide bookings:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const { bookingsCollection } = getCollections();

        const booking = await bookingsCollection.findOne({ _id: new ObjectId(id) });
        res.send(booking);
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { bookingsCollection } = getCollections();

        const result = await bookingsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );

        res.send(result);
    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const { bookingsCollection, paymentsCollection } = getCollections();

        // Fetch all bookings
        const bookings = await bookingsCollection.find().toArray();

        // Fetch all payments
        const payments = await paymentsCollection.find().toArray();

        // Create a map of bookingId to payment status
        const paymentMap = new Map();
        payments.forEach(payment => {
            paymentMap.set(payment.bookingId, payment.paymentStatus || 'paid');
        });

        // Merge booking data with payment status
        const bookingsWithPayment = bookings.map(booking => ({
            ...booking,
            paymentStatus: booking.paymentStatus || paymentMap.get(booking._id.toString()) || 'pending'
        }));

        res.send(bookingsWithPayment);
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid booking ID format" });
        }

        const { bookingsCollection } = getCollections();
        
        const result = await bookingsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "Booking not found" });
        }

        res.send(result);
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).send({ message: "Server error" });
    }
};

module.exports = {
    createBooking,
    getBookingsByEmail,
    getBookingsByGuideEmail,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
    deleteBooking
};
