require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');

const port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start server
        app.listen(port, () => {
            console.log(`✓ Server is listening on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
