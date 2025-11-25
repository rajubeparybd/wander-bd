const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s3bpn2t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;

const connectDB = async () => {
    try {
        await client.connect();
        db = client.db("wanderBD");

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("✓ Successfully connected to MongoDB!");

        return db;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const getDB = () => {
    if (!db) {
        throw new Error("Database not initialized. Call connectDB first.");
    }
    return db;
};

const getCollections = () => {
    const database = getDB();
    return {
        usersCollection: database.collection("users"),
        packagesCollection: database.collection("packages"),
        bookingsCollection: database.collection("bookings"),
        storiesCollection: database.collection("stories"),
        guideApplicationsCollection: database.collection("guideApplications"),
        tourGuidesCollection: database.collection("tourGuides"),
        paymentsCollection: database.collection("payments")
    };
};

module.exports = { connectDB, getDB, getCollections, client };
