const userRoutes = require('./user.routes');
const packageRoutes = require('./package.routes');
const bookingRoutes = require('./booking.routes');
const storyRoutes = require('./story.routes');
const tourGuideRoutes = require('./tourGuide.routes');
const applicationRoutes = require('./application.routes');
const paymentRoutes = require('./payment.routes');

const setupRoutes = (app) => {
    app.use('/users', userRoutes);
    app.use('/packages', packageRoutes);
    app.use('/bookings', bookingRoutes);
    app.use('/stories', storyRoutes);
    app.use('/tour-guides', tourGuideRoutes);
    app.use('/applications', applicationRoutes);
    app.use('/payments', paymentRoutes);

    // Health check route
    app.get('/', (req, res) => {
        res.send('server is running');
    });
};

module.exports = setupRoutes;
