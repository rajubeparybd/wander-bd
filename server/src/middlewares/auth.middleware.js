const { getCollections } = require('../config/database');

/**
 * Authentication middleware that verifies user and attaches user info to req.user
 * Currently uses email-based lookup. In production, should verify JWT/Firebase tokens.
 */
const authenticate = async (req, res, next) => {
    try {
        let userEmail = null;

        const authHeader = req.headers.authorization;
        if (authHeader) {
            userEmail = authHeader.replace('Bearer ', '').trim();
        }

        if (!userEmail) {
            userEmail = req.query.userEmail || req.body.userEmail;
        }

        if (!userEmail) {
            return res.status(401).send({ message: "Authentication required" });
        }

        const { usersCollection } = getCollections();
        const user = await usersCollection.findOne({ email: userEmail });

        if (!user) {
            return res.status(401).send({ message: "User not found" });
        }

        req.user = {
            email: user.email,
            role: user.role,
            name: user.name,
            _id: user._id
        };

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).send({ message: "Authentication failed" });
    }
};

/**
 * Middleware to check if user has admin role
 */
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({ message: "Authentication required" });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).send({ message: "Access denied. Admin privileges required." });
    }

    next();
};

/**
 * Middleware to check if user has tour guide role
 */
const requireTourGuide = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({ message: "Authentication required" });
    }

    if (req.user.role !== 'tourGuide') {
        return res.status(403).send({ message: "Access denied. Tour guide privileges required." });
    }

    next();
};

module.exports = {
    authenticate,
    requireAdmin,
    requireTourGuide
};

