const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');

const getAllTourGuides = async (req, res) => {
    try {
        const { tourGuidesCollection, usersCollection } = getCollections();
        
        // Fetch all tour guides from tourGuides collection
        const guides = await tourGuidesCollection.find({}).toArray();
        
        // Cross-reference with users collection to ensure they still have tourGuide role
        const validGuides = [];
        for (const guide of guides) {
            const user = await usersCollection.findOne({ email: guide.email });
            // Only include guides whose corresponding user has tourGuide role
            if (user && user.role === "tourGuide") {
                validGuides.push(guide);
            }
        }
        
        res.send(validGuides);
    } catch (error) {
        console.error("Error fetching tour guides:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const getTourGuideById = async (req, res) => {
    try {
        const { id } = req.params;
        const { tourGuidesCollection } = getCollections();

        const guide = await tourGuidesCollection.findOne({ _id: new ObjectId(id) });
        res.send(guide);
    } catch (error) {
        console.error("Error fetching tour guide:", error);
        res.status(500).send({ message: "Server error" });
    }
};

module.exports = {
    getAllTourGuides,
    getTourGuideById
};
