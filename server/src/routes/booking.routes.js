const express = require('express');
const router = express.Router();
const {
    createBooking,
    getBookingsByEmail,
    getBookingsByGuideEmail,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
    deleteBooking
} = require('../controllers/booking.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');

router.post('/', createBooking);
router.get('/', getBookingsByEmail);
router.get('/all', authenticate, requireAdmin, getAllBookings);
router.get('/guide/:email', getBookingsByGuideEmail);
router.get('/:id', getBookingById);
router.patch('/:id', updateBookingStatus);
router.delete('/:id', deleteBooking);

module.exports = router;
