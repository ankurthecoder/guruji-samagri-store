const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const initFirebase = () => {
    try {
        const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
            path.join(__dirname, 'firebase-service-account.json');

        const serviceAccount = require(serviceAccountPath);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        console.log('✅ Firebase Admin SDK Initialized');
    } catch (error) {
        console.error('❌ Firebase Admin SDK Error:', error.message);
        console.log('⚠️  Note: Download your Firebase service account JSON from Firebase Console');
        console.log('   Place it at: backend/src/config/firebase-service-account.json');
    }
};

module.exports = { admin, initFirebase };
