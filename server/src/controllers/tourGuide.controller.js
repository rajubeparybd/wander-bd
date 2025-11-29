const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');

const getAllTourGuides = async (req, res) => {
    try {
        const { tourGuidesCollection } = getCollections();
        
        // Use aggregation with $lookup to join users and filter by role in a single query
        const validGuides = await tourGuidesCollection.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "email",
                    foreignField: "email",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $match: {
                    "user.role": "tourGuide"
                }
            },
            {
                $project: {
                    user: 0
                }
            }
        ]).toArray();
        
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
