const express = require('express');
const router = express.Router();
const {
    addOrUpdateUser,
    getUserByEmail,
    getUsers,
    deleteUser,
    updateUserRole
} = require('../controllers/user.controller');

router.put('/:email', addOrUpdateUser);
router.get('/:email', getUserByEmail);
router.get('/', getUsers);
router.delete('/:id', deleteUser);
router.patch('/:id/role', updateUserRole);

module.exports = router;
