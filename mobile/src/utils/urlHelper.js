import { Platform } from 'react-native';

/**
 * Sanitizes local URLs for development.
 * Replaces 'localhost' with '10.0.2.2' for Android emulators.
 * 
 * @param {string} url - The URL to sanitize
 * @returns {string} Sanitized URL
 */
export const sanitizeUrl = (url) => {
    if (!url || !__DEV__) return url;

    if (Platform.OS === 'android' && url.includes('localhost')) {
        return url.replace('localhost', '10.0.2.2');
    }

    return url;
};
