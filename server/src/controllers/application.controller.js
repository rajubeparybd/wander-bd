const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/database');

const submitApplication = async (req, res) => {
    try {
        const appData = req.body;
        const { guideApplicationsCollection } = getCollections();

        const result = await guideApplicationsCollection.insertOne(appData);
        res.send(result);
    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const getAllApplications = async (req, res) => {
    try {
        const { guideApplicationsCollection } = getCollections();
        const apps = await guideApplicationsCollection.find().toArray();
        res.send(apps);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).send({ message: "Server error" });
    }
};

const acceptApplication = async (req, res) => {
    try {
        const id = req.params.id;
        const { usersCollection, guideApplicationsCollection, tourGuidesCollection } = getCollections();

        // 1. Find the application
        const appDoc = await guideApplicationsCollection.findOne({ _id: new ObjectId(id) });
        if (!appDoc) {
            return res.status(404).send("Application not found");
        }

        // 2. Update the user's role to "tourGuide"
        await usersCollection.updateOne(
            { email: appDoc.email },
            { $set: { role: "tourGuide" } }
        );

        // 3. Create a document in tourGuides collection
        const tourGuideDoc = {
            name: appDoc.name,
            email: appDoc.email,
            photoURL: appDoc.photoURL || "",
            title: appDoc.title,
            reason: appDoc.reason,
            experience: appDoc.experience,
            languages: appDoc.languages,
            specialty: appDoc.specialty,
            cvLink: appDoc.cvLink,
            joinedAt: new Date(),
        };

        const tourGuideResult = await tourGuidesCollection.insertOne(tourGuideDoc);

        // 4. Remove the application
        await guideApplicationsCollection.deleteOne({ _id: new ObjectId(id) });

        res.send({
            message: "Application accepted, user role updated, and tour guide created.",
            tourGuideId: tourGuideResult.insertedId,
        });
    } catch (error) {
        console.error("Accept application error:", error);
        res.status(500).send("Something went wrong.");
    }
};

const deleteApplication = async (req, res) => {
    try {
        const id = req.params.id;
        const { guideApplicationsCollection } = getCollections();

        const result = await guideApplicationsCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
    } catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).send({ message: "Server error" });
    }
};

module.exports = {
    submitApplication,
    getAllApplications,
    acceptApplication,
    deleteApplication
};
