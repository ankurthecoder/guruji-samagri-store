// API Configuration
export const API_BASE_URL = __DEV__
    ? 'http://localhost:5000/api'
    : 'https://your-production-api.com/api';

export const API_TIMEOUT = 30000; // 30 seconds

// Firebase Configuration (will be configured via google-services.json and GoogleService-Info.plist)
export const FIREBASE_CONFIG = {
    // This will be auto-configured by Firebase
};

// App Constants
export const APP_NAME = 'Guruji Samagri Store';
export const PHONE_NUMBER_LENGTH = 10;
export const OTP_LENGTH = 6;
export const COUNTRY_CODE = '+91';

// Categories
export const CATEGORIES = [
    'Puja Items',
    'Groceries',
    'Spices',
    'Organic',
    'Daily Essentials',
    'Other',
];

// Order Status
export const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
};
