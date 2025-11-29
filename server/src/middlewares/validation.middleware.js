const ALLOWED_ROLES = ['tourist', 'tourGuide', 'admin'];

/**
 * Validates role update request body
 */
const validateRoleUpdate = (req, res, next) => {
    const { role } = req.body;

    if (!role) {
        return res.status(400).send({ message: "Role is required" });
    }

    if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).send({ 
            message: `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(', ')}` 
        });
    }

    next();
};

module.exports = {
    validateRoleUpdate,
    ALLOWED_ROLES
};

