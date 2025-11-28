require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const { initFirebase } = require('./src/config/firebase');

const PORT = process.env.PORT || 5000;

// Initialize services
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Initialize Firebase Admin SDK
        initFirebase();

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
            console.log(`📡 Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
