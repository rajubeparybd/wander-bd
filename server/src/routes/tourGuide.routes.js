const express = require('express');
const router = express.Router();
const {
    getAllTourGuides,
    getTourGuideById
} = require('../controllers/tourGuide.controller');

router.get('/', getAllTourGuides);
router.get('/:id', getTourGuideById);

module.exports = router;
