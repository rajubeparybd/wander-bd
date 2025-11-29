const express = require('express');
const router = express.Router();
const {
    getAllPackages,
    getPackageById,
    addPackage,
    getDestinations
} = require('../controllers/package.controller');

router.get('/', getAllPackages);
router.get('/destinations/list', getDestinations);
router.get('/:id', getPackageById);
router.post('/', addPackage);

module.exports = router;
