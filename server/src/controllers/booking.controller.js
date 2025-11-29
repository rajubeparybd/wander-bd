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

        // Parse and validate pagination parameters
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || parseInt(req.query.limit) || 10;
        const skip = parseInt(req.query.skip) || (page - 1) * pageSize;

        // Validate pagination params
        if (page < 1 || pageSize < 1 || skip < 0) {
            return res.status(400).send({ message: "Invalid pagination parameters" });
        }

        // Enforce max page size
        const validatedPageSize = Math.min(pageSize, 100);

        // Build query filters from req.query
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.touristEmail) {
            filter.touristEmail = req.query.touristEmail;
        }
        if (req.query.tourGuideEmail) {
            filter.tourGuideEmail = req.query.tourGuideEmail;
        }
        if (req.query.packageId) {
            filter.packageId = req.query.packageId;
        }

        // Get total count for pagination metadata
        const totalCount = await bookingsCollection.countDocuments(filter);

        // Fetch paginated bookings
        const bookings = await bookingsCollection
            .find(filter)
            .skip(skip)
            .limit(validatedPageSize)
            .toArray();

        // Extract booking IDs for payment lookup
        const bookingIds = bookings.map(booking => booking._id.toString());

        // Fetch payments only for the returned bookings
        const payments = await paymentsCollection
            .find({ bookingId: { $in: bookingIds } })
            .toArray();

        // Create a map of bookingId to payment status
        const paymentMap = new Map();
        payments.forEach(payment => {
            paymentMap.set(payment.bookingId, payment.paymentStatus);
        });

        // Merge booking data with payment status
        const bookingsWithPayment = bookings.map(booking => ({
            ...booking,
            paymentStatus: booking.paymentStatus || paymentMap.get(booking._id.toString()) || 'pending'
        }));

        // Send paginated response with metadata
        res.send({
            data: bookingsWithPayment,
            pagination: {
                page,
                pageSize: validatedPageSize,
                totalCount,
                totalPages: Math.ceil(totalCount / validatedPageSize),
                hasNextPage: skip + validatedPageSize < totalCount,
                hasPreviousPage: page > 1
            }
        });
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
