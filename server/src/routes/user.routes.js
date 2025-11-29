const express = require('express');
const router = express.Router();
const {
    addOrUpdateUser,
    getUserByEmail,
    getUsers,
    deleteUser,
    updateUserRole
} = require('../controllers/user.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');
const { validateRoleUpdate } = require('../middlewares/validation.middleware');

router.put('/:email', addOrUpdateUser);
router.get('/:email', getUserByEmail);
router.get('/', getUsers);
router.delete('/:id', deleteUser);
router.patch('/:id/role', authenticate, requireAdmin, validateRoleUpdate, updateUserRole);

module.exports = router;
