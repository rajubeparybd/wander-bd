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

        // Create unique indexes for data integrity
        await createIndexes();

        return db;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const createIndexes = async () => {
    try {
        const paymentsCollection = db.collection("payments");
        
        // Create unique index on paymentIntentId to prevent duplicate payments
        await paymentsCollection.createIndex(
            { paymentIntentId: 1 }, 
            { 
                unique: true, 
                sparse: true,
                name: "unique_paymentIntentId"
            }
        );
        
        // Create unique index on sessionId as additional safeguard
        await paymentsCollection.createIndex(
            { sessionId: 1 }, 
            { 
                unique: true, 
                sparse: true,
                name: "unique_sessionId"
            }
        );
        
        console.log("✓ Database indexes created successfully");
    } catch (error) {
        // Index might already exist, log but don't fail
        if (error.code === 11000 || error.code === 85) {
            console.log("ℹ️ Indexes already exist");
        } else {
            console.error("⚠️ Error creating indexes:", error.message);
        }
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
