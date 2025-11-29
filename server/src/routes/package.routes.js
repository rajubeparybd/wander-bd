const express = require('express');
const router = express.Router();
const {
    getAllPackages,
    getPackageById,
    addPackage,
    updatePackage,
    deletePackage,
    getDestinations
} = require('../controllers/package.controller');

router.get('/', getAllPackages);
router.get('/destinations/list', getDestinations);
router.get('/:id', getPackageById);
router.post('/', addPackage);
router.patch('/:id', updatePackage);
router.delete('/:id', deletePackage);

module.exports = router;
