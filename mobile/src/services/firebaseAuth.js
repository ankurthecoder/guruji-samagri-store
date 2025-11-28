import auth from '@react-native-firebase/auth';
import { COUNTRY_CODE } from '../constants/config';

/**
 * Send OTP to phone number using Firebase
 * @param {string} phoneNumber - 10 digit phone number
 * @returns {Promise<object>} confirmation object
 */
export const sendOTP = async (phoneNumber) => {
    try {
        // Add country code
        const fullPhoneNumber = `${COUNTRY_CODE}${phoneNumber}`;

        // Send OTP
        const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);

        return {
            success: true,
            confirmation,
            verificationId: confirmation.verificationId,
        };
    } catch (error) {
        console.error('Send OTP Error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Verify OTP code
 * @param {object} confirmation - Confirmation object from sendOTP
 * @param {string} code - 6 digit OTP code
 * @returns {Promise<object>} Firebase user credential with ID token
 */
export const verifyOTP = async (confirmation, code) => {
    try {
        // Confirm the code
        const credential = await confirmation.confirm(code);

        // Get ID token
        const idToken = await credential.user.getIdToken();

        return {
            success: true,
            user: credential.user,
            idToken,
        };
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Get current user's ID token
 * @returns {Promise<string|null>} ID token or null
 */
export const getCurrentUserToken = async () => {
    try {
        const currentUser = auth().currentUser;
        if (currentUser) {
            const token = await currentUser.getIdToken();
            return token;
        }
        return null;
    } catch (error) {
        console.error('Get Current User Token Error:', error);
        return null;
    }
};

/**
 * Sign out from Firebase
 */
export const signOut = async () => {
    try {
        await auth().signOut();
        return { success: true };
    } catch (error) {
        console.error('Sign Out Error:', error);
        return { success: false, error: error.message };
    }
};
