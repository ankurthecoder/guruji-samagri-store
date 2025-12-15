import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Share,
    Platform,
    PermissionsAndroid,
    Alert,
    Clipboard,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import Modal from 'react-native-modal';

const ReferAndEarnScreen = ({ navigation }) => {
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'Hey! Use my referral code 89RQ17 to get ₹50 off on your first order on Guruji Samagri Store. Download now: https://example.com/download',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const handleFindFriends = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                    {
                        title: 'Contacts Permission',
                        message: 'Guruji Samagri Store needs access to your contacts to help you refer friends.',
                        buttonPositive: 'OK',
                        buttonNegative: 'Cancel',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert('Success', 'Contact permission granted! (Mock: Opening contact list...)');
                    // Here we would use react-native-contacts to fetch contacts
                } else {
                    Alert.alert('Permission Denied', 'Cannot access contacts');
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            // iOS Permission logic (usually handled by the OS on first attempt or library)
            Alert.alert('Info', 'Contact permission logic for iOS would go here.');
        }
    };

    const copyToClipboard = () => {
        // Since @react-native-clipboard/clipboard might not be installed, using text display for now or basic alerting
        // Assuming Clipboard API from 'react-native' is deprecated but might still work or we just simulate
        // React Native's core Clipboard is deprecated. If explicit package not present, we skip actual copy or use simple alert
        Alert.alert('Copied', 'Referral code 89RQ17 copied to clipboard (Simulated)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Refer & earn</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Main Card */}
                <View style={styles.mainCard}>
                    <View style={styles.imageContainer}>
                        {/* Placeholder for High Five Image */}
                        <View style={styles.placeholderImage}>
                            <Ionicons name="people" size={80} color={COLORS.PRIMARY} />
                        </View>
                    </View>

                    <Text style={styles.referTitle}>Refer a friend to Guruji Samagri</Text>

                    <View style={styles.rewardContainer}>
                        <Text style={styles.rewardLabel}>Get</Text>
                        <Text style={styles.rewardAmount}>₹100</Text>
                    </View>

                    <Text style={styles.referSubtitle}>
                        Your friend gets flat ₹50 off on their first order on Guruji Samagri.
                    </Text>

                    <TouchableOpacity style={styles.codeContainer} onPress={copyToClipboard}>
                        <Text style={styles.referralCode}>89RQ17</Text>
                        <Ionicons name="copy-outline" size={20} color={COLORS.BLACK} />
                    </TouchableOpacity>
                </View>

                {/* Steps Card */}
                <View style={styles.stepsCard}>
                    <Text style={styles.stepsTitle}>How it works</Text>

                    {/* Step 1 */}
                    <View style={styles.stepItem}>
                        <View style={styles.stepNumberContainer}>
                            <Text style={styles.stepNumber}>1</Text>
                        </View>
                        <Text style={styles.stepText}>Share the link with your friend</Text>
                    </View>

                    {/* Step 2 */}
                    <View style={styles.stepItem}>
                        <View style={styles.stepNumberContainer}>
                            <Text style={styles.stepNumber}>2</Text>
                        </View>
                        <Text style={styles.stepText}>Your friend downloads the app with your link</Text>
                    </View>

                    {/* Step 3 */}
                    <View style={styles.stepItem}>
                        <View style={styles.stepNumberContainer}>
                            <Text style={styles.stepNumber}>3</Text>
                        </View>
                        <Text style={styles.stepText}>
                            They get ₹50 and you get ₹100 when they place their first order on Guruji Samagri
                        </Text>
                    </View>
                </View>

                {/* T&C Link */}
                <TouchableOpacity onPress={toggleModal} style={styles.tncButton}>
                    <Text style={styles.tncText}>Read our T&Cs to know more.</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Bottom Actions - Fixed at bottom */}
            <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
                    <Text style={styles.primaryButtonText}>Share invite link</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={handleFindFriends}>
                    <Text style={styles.secondaryButtonText}>Find friends to refer</Text>
                </TouchableOpacity>
            </View>


            {/* T&C Modal */}
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} style={styles.modal}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Terms & Conditions</Text>
                    <ScrollView style={{ maxHeight: 300 }}>
                        <Text style={styles.modalText}>
                            1. The referral reward is valid only for new user registrations.
                            {'\n'}2. The referee must complete their first order for the referrer to get ₹100.
                            {'\n'}3. Guruji Samagri Store reserves the right to modify or terminate the offer at any time.
                            {'\n'}{'\n'}
                            (This is a dummy T&C text)
                        </Text>
                    </ScrollView>
                    <TouchableOpacity onPress={toggleModal} style={styles.modalCloseButton}>
                        <Text style={styles.modalCloseText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: scale(16),
        backgroundColor: COLORS.WHITE,
        elevation: 2,
    },
    backButton: {
        paddingRight: scale(16),
    },
    headerTitle: {
        fontSize: moderateScale(18),
        fontWeight: '600',
        color: COLORS.BLACK,
    },
    scrollContent: {
        padding: scale(16),
        paddingBottom: verticalScale(120), // Space for bottom actions
    },
    mainCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: scale(16),
        padding: scale(20),
        alignItems: 'center',
        marginBottom: verticalScale(16),
        elevation: 2,
    },
    imageContainer: {
        marginBottom: verticalScale(16),
    },
    placeholderImage: {
        width: scale(120),
        height: scale(120),
        backgroundColor: '#E8F5E9',
        borderRadius: scale(60),
        justifyContent: 'center',
        alignItems: 'center',
    },
    referTitle: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: COLORS.BLACK,
        marginBottom: verticalScale(8),
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: verticalScale(8),
    },
    rewardLabel: {
        fontSize: moderateScale(24),
        fontWeight: '700',
        color: COLORS.PRIMARY,
        marginRight: scale(4),
    },
    rewardAmount: {
        fontSize: moderateScale(36),
        fontWeight: '800',
        color: COLORS.PRIMARY,
    },
    referSubtitle: {
        fontSize: moderateScale(14),
        color: COLORS.TEXT_SECONDARY,
        textAlign: 'center',
        marginBottom: verticalScale(20),
        paddingHorizontal: scale(20),
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(24),
        borderRadius: scale(24),
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    referralCode: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: COLORS.BLACK,
        marginRight: scale(8),
    },
    stepsCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: scale(16),
        padding: scale(20),
        elevation: 2,
    },
    stepsTitle: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: COLORS.BLACK,
        marginBottom: verticalScale(16),
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: verticalScale(20),
    },
    stepNumberContainer: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        backgroundColor: '#F5F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    stepNumber: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: COLORS.TEXT_SECONDARY,
    },
    stepText: {
        flex: 1,
        fontSize: moderateScale(14),
        color: '#424242',
        lineHeight: verticalScale(20),
    },
    tncButton: {
        alignItems: 'center',
        marginTop: verticalScale(20),
    },
    tncText: {
        fontSize: moderateScale(12),
        color: COLORS.TEXT_SECONDARY,
        textDecorationLine: 'underline',
    },
    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.WHITE,
        padding: scale(16),
        elevation: 10,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    primaryButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: verticalScale(14),
        borderRadius: scale(8),
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    primaryButtonText: {
        color: COLORS.WHITE,
        fontSize: moderateScale(16),
        fontWeight: '700',
    },
    secondaryButton: {
        alignItems: 'center',
        paddingVertical: verticalScale(8),
    },
    secondaryButtonText: {
        color: COLORS.PRIMARY,
        fontSize: moderateScale(16),
        fontWeight: '700',
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: COLORS.WHITE,
        padding: scale(20),
        borderTopLeftRadius: scale(16),
        borderTopRightRadius: scale(16),
    },
    modalTitle: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        marginBottom: verticalScale(16),
    },
    modalText: {
        fontSize: moderateScale(14),
        color: '#424242',
        lineHeight: verticalScale(22),
    },
    modalCloseButton: {
        marginTop: verticalScale(20),
        alignItems: 'center',
        padding: scale(12),
        backgroundColor: '#F5F5F5',
        borderRadius: scale(8),
    },
    modalCloseText: {
        color: COLORS.BLACK,
        fontWeight: '600',
    },
});

export default ReferAndEarnScreen;
