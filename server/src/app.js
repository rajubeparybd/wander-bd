const express = require('express');
const corsMiddleware = require('./middlewares/cors.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');
const setupRoutes = require('./routes');

const app = express();

// Middlewares
app.use(corsMiddleware);

// Stripe webhook needs raw body, so we handle it before JSON parsing
app.post('/payments/webhook', express.raw({ type: 'application/json' }), require('./controllers/payment.controller').handleWebhook);

// JSON parsing for all other routes
app.use(express.json());

// Routes
setupRoutes(app);

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;
