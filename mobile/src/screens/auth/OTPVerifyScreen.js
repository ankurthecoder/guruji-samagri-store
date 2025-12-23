import React, { useState, useRef, useEffect } from 'react';
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
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore(state => state.setAuth);
    const inputRefs = useRef([]);

    useEffect(() => {
        // Clear OTP on mount
        setOtp(['', '', '', '']);
    }, []);

    const handleChangeText = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Move to next input if text is entered
        if (text && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        // Move to previous input on backspace if current input is empty
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerifyOTP = async () => {
        const fullOtp = otp.join('');
        if (fullOtp.length !== OTP_LENGTH) {
            Alert.alert('Invalid OTP', 'Please enter a 4-digit OTP');
            return;
        }

        setLoading(true);

        // BYPASS: Firebase & Backend disabled for testing
        setTimeout(() => {
            setLoading(false);
            setAuth({
                user: { phoneNumber, name: 'Test User' },
                token: 'mock-token-for-testing',
                needsProfileSetup: false,
            });
            navigation.replace('Main');
        }, 800);
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
                        We've sent a 4-digit code to{'\n'}
                        <Text style={styles.phoneNumber}>+91 {phoneNumber}</Text>
                    </Text>
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.otpBoxesContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={[
                                    styles.otpBox,
                                    digit ? styles.otpBoxActive : null
                                ]}
                                keyboardType="number-pad"
                                maxLength={1}
                                value={digit}
                                onChangeText={(text) => handleChangeText(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                editable={!loading}
                                autoFocus={index === 0}
                                selectionColor={COLORS.PRIMARY}
                            />
                        ))}
                    </View>

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
    otpBoxesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.PADDING_XXL,
    },
    otpBox: {
        width: 65,
        height: 65,
        borderWidth: 1.5,
        borderColor: COLORS.BORDER,
        borderRadius: SIZES.RADIUS_MD,
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        backgroundColor: COLORS.WHITE,
        color: COLORS.TEXT_PRIMARY,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    otpBoxActive: {
        borderColor: COLORS.PRIMARY,
        borderWidth: 2,
    },
    button: {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: SIZES.PADDING_LG,
        borderRadius: SIZES.RADIUS_MD,
        alignItems: 'center',
        marginTop: 10,
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
