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
import { COUNTRY_CODE, PHONE_NUMBER_LENGTH } from '../../constants/config';
import { sendOTP } from '../../services/firebaseAuth';

const PhoneLoginScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePhoneNumber = () => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleSendOTP = async () => {
        if (!validatePhoneNumber()) {
            Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);

        // BYPASS: Firebase disabled for testing - uncomment below for production
        /*
        try {
            const result = await sendOTP(phoneNumber);

            if (result.success) {
                navigation.navigate('OTPVerify', {
                    phoneNumber,
                    confirmation: result.confirmation,
                });
            } else {
                Alert.alert('Error', result.error || 'Failed to send OTP');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
        */

        // TESTING MODE: Direct navigation without Firebase
        setTimeout(() => {
            setLoading(false);
            navigation.navigate('OTPVerify', {
                phoneNumber,
                confirmation: null, // Mock confirmation for testing
            });
        }, 500); // Small delay to show loading state
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome to</Text>
                    <Text style={styles.appName}>Guruji Samagri Store</Text>
                    <Text style={styles.subtitle}>Enter your phone number to continue</Text>
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.phoneInputWrapper}>
                        <View style={styles.countryCode}>
                            <Text style={styles.countryCodeText}>{COUNTRY_CODE}</Text>
                        </View>
                        <TextInput
                            style={styles.phoneInput}
                            placeholder="9876543210"
                            keyboardType="phone-pad"
                            maxLength={PHONE_NUMBER_LENGTH}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            editable={!loading}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSendOTP}
                        disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color={COLORS.WHITE} />
                        ) : (
                            <Text style={styles.buttonText}>Send OTP</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By continuing, you agree to our Terms & Conditions
                    </Text>
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
        fontSize: SIZES.FONT_XL,
        color: COLORS.TEXT_SECONDARY,
        marginBottom: SIZES.PADDING_SM,
    },
    appName: {
        fontSize: SIZES.FONT_HEADING,
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
        marginBottom: SIZES.PADDING_MD,
    },
    subtitle: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.TEXT_SECONDARY,
    },
    inputContainer: {
        marginBottom: SIZES.PADDING_XXL,
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        borderRadius: SIZES.RADIUS_MD,
        marginBottom: SIZES.PADDING_LG,
        backgroundColor: COLORS.WHITE,
    },
    countryCode: {
        paddingHorizontal: SIZES.PADDING_LG,
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: COLORS.BORDER,
        backgroundColor: COLORS.LIGHT_GRAY,
    },
    countryCodeText: {
        fontSize: SIZES.FONT_LG,
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: SIZES.PADDING_LG,
        paddingVertical: SIZES.PADDING_LG,
        fontSize: SIZES.FONT_LG,
        color: COLORS.TEXT_PRIMARY,
    },
    button: {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: SIZES.PADDING_LG,
        borderRadius: SIZES.RADIUS_MD,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: COLORS.WHITE,
        fontSize: SIZES.FONT_LG,
        fontWeight: '600',
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: SIZES.FONT_SM,
        color: COLORS.TEXT_SECONDARY,
        textAlign: 'center',
    },
});

export default PhoneLoginScreen;
