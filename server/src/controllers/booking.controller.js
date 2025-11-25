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

module.exports = {
    createBooking,
    getBookingsByEmail,
    getBookingsByGuideEmail,
    getBookingById,
    updateBookingStatus
};
