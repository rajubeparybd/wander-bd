const express = require('express');
const router = express.Router();
const {
    createBooking,
    getBookingsByEmail,
    getBookingsByGuideEmail,
    getBookingById,
    updateBookingStatus
} = require('../controllers/booking.controller');

router.post('/', createBooking);
router.get('/', getBookingsByEmail);
router.get('/guide/:email', getBookingsByGuideEmail);
router.get('/:id', getBookingById);
router.patch('/:id', updateBookingStatus);

module.exports = router;
