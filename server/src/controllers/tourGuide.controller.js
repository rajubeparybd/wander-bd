const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');

const getAllTourGuides = async (req, res) => {
    try {
        const { tourGuidesCollection } = getCollections();
        const guides = await tourGuidesCollection.find().toArray();
        res.send(guides);
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
