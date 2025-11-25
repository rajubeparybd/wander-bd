const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');

const addOrUpdateUser = async (req, res) => {
    try {
        const email = req.params.email;
        const userData = req.body;
        const { usersCollection } = getCollections();

        const filter = { email };
        const options = { upsert: true };
        const updateDoc = { $set: userData };

        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    } catch (error) {
        console.error("Error adding/updating user:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email;
        const { usersCollection } = getCollections();

        const user = await usersCollection.findOne({ email });
        res.send(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const getUsers = async (req, res) => {
    try {
        const { role, search } = req.query;
        const { usersCollection } = getCollections();

        const filter = {};
        if (role) filter.role = role;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const users = await usersCollection.find(filter).toArray();
        res.send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { usersCollection } = getCollections();

        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send({ message: "Server error" });
    }
};

module.exports = {
    addOrUpdateUser,
    getUserByEmail,
    getUsers,
    deleteUser
};
