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
    ScrollView,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/colors';
import { completeProfile } from '../../services/api';
import useAuthStore from '../../stores/authStore';

const ProfileSetupScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [loading, setLoading] = useState(false);
    const updateProfile = useAuthStore(state => state.updateProfile);

    const validateForm = () => {
        if (!name.trim()) {
            Alert.alert('Validation Error', 'Please enter your name');
            return false;
        }
        if (name.trim().length < 2) {
            Alert.alert('Validation Error', 'Name must be at least 2 characters');
            return false;
        }
        if (!dateOfBirth) {
            Alert.alert('Validation Error', 'Please enter your date of birth');
            return false;
        }
        if (!gender) {
            Alert.alert('Validation Error', 'Please select your gender');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const profileData = {
                name: name.trim(),
                dateOfBirth,
                gender,
            };

            const result = await completeProfile(profileData);

            if (result.success) {
                // Update local store
                updateProfile(result.user);

                // Navigate to main app
                navigation.replace('Main');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Complete Your Profile</Text>
                    <Text style={styles.subtitle}>
                        Tell us a bit about yourself to get started
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            value={name}
                            onChangeText={setName}
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date of Birth *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD (e.g., 1990-01-15)"
                            value={dateOfBirth}
                            onChangeText={setDateOfBirth}
                            editable={!loading}
                        />
                        <Text style={styles.hint}>Format: YYYY-MM-DD</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Gender *</Text>
                        <View style={styles.genderContainer}>
                            {['Male', 'Female', 'Other'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.genderButton,
                                        gender === option && styles.genderButtonActive,
                                    ]}
                                    onPress={() => setGender(option)}
                                    disabled={loading}>
                                    <Text
                                        style={[
                                            styles.genderButtonText,
                                            gender === option && styles.genderButtonTextActive,
                                        ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color={COLORS.WHITE} />
                        ) : (
                            <Text style={styles.buttonText}>Continue</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SIZES.PADDING_XL,
        paddingVertical: SIZES.PADDING_XXL,
    },
    header: {
        marginBottom: SIZES.PADDING_XXL,
    },
    title: {
        fontSize: SIZES.FONT_HEADING,
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
        marginBottom: SIZES.PADDING_SM,
    },
    subtitle: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.TEXT_SECONDARY,
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: SIZES.PADDING_XL,
    },
    label: {
        fontSize: SIZES.FONT_MD,
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: SIZES.PADDING_SM,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        borderRadius: SIZES.RADIUS_MD,
        paddingHorizontal: SIZES.PADDING_LG,
        paddingVertical: SIZES.PADDING_MD,
        fontSize: SIZES.FONT_MD,
        backgroundColor: COLORS.WHITE,
        color: COLORS.TEXT_PRIMARY,
    },
    hint: {
        fontSize: SIZES.FONT_SM,
        color: COLORS.TEXT_SECONDARY,
        marginTop: SIZES.PADDING_XS,
    },
    genderContainer: {
        flexDirection: 'row',
        gap: SIZES.PADDING_MD,
    },
    genderButton: {
        flex: 1,
        paddingVertical: SIZES.PADDING_MD,
        borderRadius: SIZES.RADIUS_MD,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
    },
    genderButtonActive: {
        backgroundColor: COLORS.PRIMARY,
        borderColor: COLORS.PRIMARY,
    },
    genderButtonText: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.TEXT_PRIMARY,
        fontWeight: '500',
    },
    genderButtonTextActive: {
        color: COLORS.WHITE,
        fontWeight: '600',
    },
    button: {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: SIZES.PADDING_LG,
        borderRadius: SIZES.RADIUS_MD,
        alignItems: 'center',
        marginTop: SIZES.PADDING_XL,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: COLORS.WHITE,
        fontSize: SIZES.FONT_LG,
        fontWeight: '600',
    },
});

export default ProfileSetupScreen;
