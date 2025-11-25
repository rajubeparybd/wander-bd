const express = require('express');
const corsMiddleware = require('./middlewares/cors.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');
const setupRoutes = require('./routes');

const app = express();

// Middlewares
app.use(corsMiddleware);
app.use(express.json());

// Routes
setupRoutes(app);

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;
