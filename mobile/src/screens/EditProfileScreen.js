import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS, SIZES } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuthStore from '../stores/authStore';
import useUIStore from '../stores/uiStore';
import CustomInput from '../components/account/CustomInput';

const EditProfileScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const user = useAuthStore(state => state.user);
    const updateProfile = useAuthStore(state => state.updateProfile);
    const setTabBarVisible = useUIStore(state => state.setTabBarVisible);

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');

    // Hide tab bar when screen mounts, show when unmounts
    useEffect(() => {
        setTabBarVisible(false);
        return () => {
            setTabBarVisible(true);
        };
    }, []);

    const handleSave = () => {
        // Validate inputs
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        if (!phone.trim() || phone.length < 10) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return;
        }

        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email');
            return;
        }

        // Update user info
        updateProfile({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
        });

        Alert.alert('Success', 'Profile updated successfully', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={styles.headerRight} />
            </View>

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 60 : 20}
            >
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarLarge}>
                            <Ionicons name="person" size={48} color={COLORS.PRIMARY} />
                        </View>
                        <TouchableOpacity style={styles.changePhotoButton}>
                            <Text style={styles.changePhotoText}>Change Photo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        <CustomInput
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            icon="person-outline"
                        />

                        <CustomInput
                            label="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            icon="call-outline"
                            keyboardType="phone-pad"
                            maxLength={10}
                        />

                        <CustomInput
                            label="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            icon="mail-outline"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Info Note */}
                    <View style={styles.infoNote}>
                        <Ionicons name="information-circle-outline" size={20} color={COLORS.TEXT_SECONDARY} />
                        <Text style={styles.infoText}>
                            Your personal information is secure and will only be used for order processing.
                        </Text>
                    </View>

                    {/* Bottom Spacer for Keyboard */}
                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Save Button */}
            <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 10 }]}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.8}
                >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.LIGHT_GRAY,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    backButton: {
        padding: scale(4),
    },
    headerTitle: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: COLORS.BLACK,
    },
    headerRight: {
        width: scale(32),
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: verticalScale(20),
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: verticalScale(32),
        backgroundColor: COLORS.WHITE,
        marginBottom: verticalScale(12),
    },
    avatarLarge: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(50),
        backgroundColor: `${COLORS.PRIMARY}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    changePhotoButton: {
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(6),
    },
    changePhotoText: {
        fontSize: moderateScale(12),
        color: COLORS.PRIMARY,
        fontWeight: '600',
    },
    formSection: {
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
    },
    infoNote: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        marginHorizontal: scale(16),
        marginTop: verticalScale(16),
        padding: scale(12),
        borderRadius: scale(8),
        gap: scale(10),
    },
    infoText: {
        flex: 1,
        fontSize: moderateScale(11),
        color: COLORS.TEXT_SECONDARY,
        lineHeight: moderateScale(16),
    },
    bottomSpacer: {
        height: verticalScale(100),
    },
    bottomContainer: {
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(12),
        borderTopWidth: 1,
        borderTopColor: COLORS.BORDER,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    saveButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: verticalScale(14),
        borderRadius: scale(10),
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: COLORS.WHITE,
    },
});

export default EditProfileScreen;
