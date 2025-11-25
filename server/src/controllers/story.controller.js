const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');

const createStory = async (req, res) => {
    try {
        const story = req.body;
        const { storiesCollection } = getCollections();

        const result = await storiesCollection.insertOne(story);
        res.send(result);
    } catch (error) {
        console.error("Error creating story:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const getAllStories = async (req, res) => {
    try {
        const email = req.query.email;
        const { storiesCollection } = getCollections();

        let stories;
        if (email) {
            stories = await storiesCollection.find({ authorEmail: email }).toArray();
        } else {
            stories = await storiesCollection.find().toArray();
        }

        res.send(stories);
    } catch (error) {
        console.error("Error fetching stories:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const getStoryById = async (req, res) => {
    try {
        const id = req.params.id;
        const { storiesCollection } = getCollections();

        const story = await storiesCollection.findOne({ _id: new ObjectId(id) });
        res.send(story);
    } catch (error) {
        console.error("Error fetching story:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const updateStory = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, text, newImages } = req.body;
        const { storiesCollection } = getCollections();

        const result = await storiesCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: { title, text },
                $push: { images: { $each: newImages } },
            }
        );

        res.send(result);
    } catch (error) {
        console.error("Error updating story:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const removeImage = async (req, res) => {
    try {
        const { image } = req.body;
        const id = req.params.id;
        const { storiesCollection } = getCollections();

        const result = await storiesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $pull: { images: image } }
        );

        res.send(result);
    } catch (error) {
        console.error("Error removing image:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const deleteStory = async (req, res) => {
    try {
        const id = req.params.id;
        const { storiesCollection } = getCollections();

        const result = await storiesCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
    } catch (error) {
        console.error("Error deleting story:", error);
        res.status(500).send({ message: "Server error" });
    }
};

module.exports = {
    createStory,
    getAllStories,
    getStoryById,
    updateStory,
    removeImage,
    deleteStory
};
