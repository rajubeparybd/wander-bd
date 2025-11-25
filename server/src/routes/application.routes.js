const express = require('express');
const router = express.Router();
const {
    submitApplication,
    getAllApplications,
    acceptApplication,
    deleteApplication
} = require('../controllers/application.controller');

router.post('/', submitApplication);
router.get('/', getAllApplications);
router.patch('/:id/accept', acceptApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
