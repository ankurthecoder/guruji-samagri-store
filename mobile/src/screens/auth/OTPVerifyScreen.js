import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/colors';
import { OTP_LENGTH } from '../../constants/config';
import { verifyOTP } from '../../services/firebaseAuth';
import { verifyOTPWithBackend } from '../../services/api';
import useAuthStore from '../../stores/authStore';

const OTPVerifyScreen = ({ navigation, route }) => {
    const { phoneNumber, confirmation } = route.params;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore(state => state.setAuth);

    const handleVerifyOTP = async () => {
        if (otp.length !== OTP_LENGTH) {
            Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);

        // BYPASS: Firebase & Backend disabled for testing - uncomment below for production
        /*
        try {
            // Verify OTP with Firebase
            const firebaseResult = await verifyOTP(confirmation, otp);

            if (!firebaseResult.success) {
                Alert.alert('Invalid OTP', firebaseResult.error || 'Please try again');
                setLoading(false);
                return;
            }

            // Verify with backend and get user data
            const backendResult = await verifyOTPWithBackend(firebaseResult.idToken);

            if (backendResult.success) {
                // Save auth data to store
                setAuth({
                    user: backendResult.user,
                    token: backendResult.token,
                    needsProfileSetup: backendResult.needsProfileSetup,
                });

                // Navigate based on profile status
                if (backendResult.needsProfileSetup) {
                    navigation.replace('ProfileSetup');
                } else {
                    navigation.replace('Main');
                }
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
        */

        // TESTING MODE: Direct navigation without Firebase/Backend
        setTimeout(() => {
            setLoading(false);
            // Mock auth data for testing
            setAuth({
                user: { phoneNumber, name: 'Test User' },
                token: 'mock-token-for-testing',
                needsProfileSetup: false,
            });
            // Navigate to Main screen (Home)
            navigation.replace('Main');
        }, 500); // Small delay to show loading state
    };

    const handleResendOTP = () => {
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Verify OTP</Text>
                    <Text style={styles.subtitle}>
                        We've sent a 6-digit code to{'\n'}
                        <Text style={styles.phoneNumber}>+91 {phoneNumber}</Text>
                    </Text>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.otpInput}
                        placeholder="Enter 6-digit OTP"
                        keyboardType="number-pad"
                        maxLength={OTP_LENGTH}
                        value={otp}
                        onChangeText={setOtp}
                        editable={!loading}
                        autoFocus
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleVerifyOTP}
                        disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color={COLORS.WHITE} />
                        ) : (
                            <Text style={styles.buttonText}>Verify & Continue</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.resendButton}
                        onPress={handleResendOTP}
                        disabled={loading}>
                        <Text style={styles.resendText}>Didn't receive OTP? Resend</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    content: {
        flex: 1,
        paddingHorizontal: SIZES.PADDING_XL,
        justifyContent: 'center',
    },
    header: {
        marginBottom: SIZES.PADDING_XXL * 2,
    },
    title: {
        fontSize: SIZES.FONT_HEADING,
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
        marginBottom: SIZES.PADDING_MD,
    },
    subtitle: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.TEXT_SECONDARY,
        lineHeight: 22,
    },
    phoneNumber: {
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
    },
    inputContainer: {
        marginBottom: SIZES.PADDING_XXL,
    },
    otpInput: {
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        borderRadius: SIZES.RADIUS_MD,
        paddingHorizontal: SIZES.PADDING_LG,
        paddingVertical: SIZES.PADDING_LG,
        fontSize: SIZES.FONT_XXL,
        textAlign: 'center',
        letterSpacing: 10,
        marginBottom: SIZES.PADDING_LG,
        backgroundColor: COLORS.WHITE,
        color: COLORS.TEXT_PRIMARY,
    },
    button: {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: SIZES.PADDING_LG,
        borderRadius: SIZES.RADIUS_MD,
        alignItems: 'center',
        marginBottom: SIZES.PADDING_LG,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: COLORS.WHITE,
        fontSize: SIZES.FONT_LG,
        fontWeight: '600',
    },
    resendButton: {
        alignItems: 'center',
        paddingVertical: SIZES.PADDING_MD,
    },
    resendText: {
        color: COLORS.PRIMARY,
        fontSize: SIZES.FONT_MD,
        fontWeight: '500',
    },
});

export default OTPVerifyScreen;
