const express = require('express');
const router = express.Router();
const {
    addOrUpdateUser,
    getUserByEmail,
    getUsers,
    deleteUser
} = require('../controllers/user.controller');

router.put('/:email', addOrUpdateUser);
router.get('/:email', getUserByEmail);
router.get('/', getUsers);
router.delete('/:id', deleteUser);

module.exports = router;
