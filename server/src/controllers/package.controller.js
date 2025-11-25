const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');

const getAllPackages = async (req, res) => {
    try {
        const { packagesCollection } = getCollections();
        const packages = await packagesCollection.find().toArray();
        res.send(packages);
    } catch (error) {
        console.error("Error fetching packages:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const getPackageById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid package ID format" });
        }

        const { packagesCollection } = getCollections();
        const pkg = await packagesCollection.findOne({ _id: new ObjectId(id) });

        if (!pkg) {
            return res.status(404).send({ message: "Package not found" });
        }

        res.send(pkg);
    } catch (error) {
        console.error("Error fetching package:", error);
        res.status(500).send({ message: "Server error fetching package" });
    }
};

const addPackage = async (req, res) => {
    try {
        const packageData = req.body;
        const { packagesCollection } = getCollections();

        const result = await packagesCollection.insertOne(packageData);
        res.send(result);
    } catch (error) {
        console.error("Error adding package:", error);
        res.status(500).send({ message: "Server error" });
    }
};

module.exports = {
    getAllPackages,
    getPackageById,
    addPackage
};
