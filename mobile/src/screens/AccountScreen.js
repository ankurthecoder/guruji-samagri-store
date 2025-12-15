import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS, SIZES } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuthStore from '../stores/authStore';
import useCartStore from '../stores/cartStore';

const AccountScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);
    const clearCart = useCartStore(state => state.clearCart);

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: () => {
                        clearCart();
                        logout();
                        // Navigate to login or auth flow
                    }
                }
            ]
        );
    };

    const handleShareApp = async () => {
        try {
            const message = `🕉️ *Guruji Samagri Store* 🙏\n\nDiscover authentic spiritual products for your pooja needs!\n\n✨ Features:\n• Wide range of pooja items\n• Fast & reliable delivery\n• Quality assured products\n• Easy ordering process\n\nDownload the app now and get started!\n\n📱 Download: [App Link]\n\n🌺 Har Har Mahadev! 🌺`;

            const result = await Share.share({
                message: message,
                title: 'Share Guruji Samagri Store',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared via activity type
                    console.log('Shared via:', result.activityType);
                } else {
                    // Shared successfully
                    console.log('Shared successfully');
                }
            } else if (result.action === Share.dismissedAction) {
                // Dismissed
                console.log('Share dismissed');
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to share the app. Please try again.');
            console.error('Share error:', error);
        }
    };

    const MenuItem = ({ icon, title, subtitle, onPress, badge }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
                <Ionicons name={icon} size={22} color={COLORS.TEXT_PRIMARY} />
                <View style={styles.menuItemText}>
                    <Text style={styles.menuItemTitle}>{title}</Text>
                    {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <View style={styles.menuItemRight}>
                {badge && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                )}
                <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_SECONDARY} />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Account</Text>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* User Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Ionicons name="person" size={32} color={COLORS.PRIMARY} />
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            <Ionicons name="create-outline" size={20} color={COLORS.PRIMARY} />
                        </TouchableOpacity>
                    </View>

                    {/* Contact Information */}
                    <View style={styles.contactInfo}>
                        <View style={styles.infoRow}>
                            <Ionicons name="call-outline" size={18} color={COLORS.TEXT_SECONDARY} />
                            <Text style={styles.infoText}>{user?.phone || '9911881520'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="mail-outline" size={18} color={COLORS.TEXT_SECONDARY} />
                            <Text style={styles.infoText}>{user?.email || 'gupta.ankur792@gmail.com'}</Text>
                        </View>
                    </View>
                </View>

                {/* Update Banner */}
                <TouchableOpacity style={styles.updateBanner} activeOpacity={0.8}>
                    <View style={styles.updateLeft}>
                        <Ionicons name="settings-outline" size={24} color={COLORS.TEXT_PRIMARY} />
                        <View style={styles.updateTextContainer}>
                            <Text style={styles.updateTitle}>Update Available</Text>
                            <Text style={styles.updateSubtitle}>Enjoy a more seamless shopping experience</Text>
                        </View>
                    </View>
                    <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>New</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_SECONDARY} />
                </TouchableOpacity>

                {/* Your Information Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Information</Text>
                    <View style={styles.menuCard}>
                        <MenuItem
                            icon="bag-handle-outline"
                            title="Your Orders"
                            onPress={() => navigation.navigate('Orders')}
                        />
                        <MenuItem
                            icon="card-outline"
                            title="E-Gift Cards"
                            onPress={() => Alert.alert('E-Gift Cards', 'E-Gift Cards screen coming soon')}
                        />
                        <MenuItem
                            icon="help-circle-outline"
                            title="Help & Support"
                            onPress={() => Alert.alert('Help', 'Help & Support screen coming soon')}
                        />
                        <MenuItem
                            icon="cash-outline"
                            title="Refunds"
                            onPress={() => Alert.alert('Refunds', 'Refunds screen coming soon')}
                        />
                        <MenuItem
                            icon="location-outline"
                            title="Saved Addresses"
                            subtitle="2 Addresses"
                            onPress={() => navigation.navigate('MyAddresses')}
                        />
                        <MenuItem
                            icon="person-outline"
                            title="Profile"
                            onPress={() => Alert.alert('Profile', 'Profile screen coming soon')}
                        />
                        <MenuItem
                            icon="gift-outline"
                            title="Rewards"
                            onPress={() => Alert.alert('Rewards', 'Rewards screen coming soon')}
                        />
                        <MenuItem
                            icon="wallet-outline"
                            title="Payment Management"
                            onPress={() => Alert.alert('Payment', 'Payment Management screen coming soon')}
                        />
                    </View>
                </View>

                {/* Other Information Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Other Information</Text>
                    <View style={styles.menuCard}>
                        <MenuItem
                            icon="star-outline"
                            title="Suggest Products"
                            onPress={() => Alert.alert('Suggest', 'Suggest Products screen coming soon')}
                        />
                        <MenuItem
                            icon="share-social-outline"
                            title="Share the App"
                            onPress={handleShareApp}
                        />
                        <MenuItem
                            icon="notifications-outline"
                            title="Notifications"
                            onPress={() => navigation.navigate('NotificationPreferences')}
                        />
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>

                {/* App Version */}
                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>App version 1.0.0</Text>
                    <Text style={styles.versionText}>v1.0-beta</Text>
                </View>

                {/* Bottom Spacer */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.LIGHT_GRAY,
    },
    header: {
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    headerTitle: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: COLORS.BLACK,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: verticalScale(20),
    },
    updateBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
        marginTop: verticalScale(8),
        marginHorizontal: scale(12),
        borderRadius: scale(12),
    },
    profileCard: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(12),
        marginTop: verticalScale(12),
        borderRadius: scale(12),
        padding: scale(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: verticalScale(16),
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: scale(56),
        height: scale(56),
        borderRadius: scale(28),
        backgroundColor: `${COLORS.PRIMARY}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: COLORS.BLACK,
    },
    editButton: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: `${COLORS.PRIMARY}10`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactInfo: {
        gap: verticalScale(10),
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
    },
    infoText: {
        fontSize: moderateScale(12),
        color: COLORS.TEXT_SECONDARY,
        flex: 1,
    },
    updateLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    updateTextContainer: {
        marginLeft: scale(12),
        flex: 1,
    },
    updateTitle: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: COLORS.BLACK,
        marginBottom: verticalScale(2),
    },
    updateSubtitle: {
        fontSize: moderateScale(10),
        color: COLORS.TEXT_SECONDARY,
    },
    newBadge: {
        backgroundColor: '#00C853',
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(3),
        borderRadius: scale(4),
        marginRight: scale(8),
    },
    newBadgeText: {
        fontSize: moderateScale(9),
        fontWeight: '700',
        color: COLORS.WHITE,
    },
    section: {
        marginTop: verticalScale(16),
    },
    sectionTitle: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: COLORS.BLACK,
        paddingHorizontal: scale(16),
        marginBottom: verticalScale(8),
    },
    menuCard: {
        backgroundColor: COLORS.WHITE,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(14),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    menuItemLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        marginLeft: scale(12),
        flex: 1,
    },
    menuItemTitle: {
        fontSize: moderateScale(13),
        fontWeight: '500',
        color: COLORS.BLACK,
    },
    menuItemSubtitle: {
        fontSize: moderateScale(10),
        color: COLORS.TEXT_SECONDARY,
        marginTop: verticalScale(2),
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: '#FFF3E0',
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(2),
        borderRadius: scale(4),
        marginRight: scale(8),
    },
    badgeText: {
        fontSize: moderateScale(9),
        fontWeight: '600',
        color: '#FF6F00',
    },
    logoutButton: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(16),
        marginTop: verticalScale(24),
        paddingVertical: verticalScale(14),
        borderRadius: scale(12),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.BORDER,
    },
    logoutButtonText: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: COLORS.BLACK,
    },
    versionContainer: {
        alignItems: 'center',
        marginTop: verticalScale(16),
    },
    versionText: {
        fontSize: moderateScale(11),
        color: COLORS.TEXT_SECONDARY,
        marginVertical: verticalScale(2),
    },
    bottomSpacer: {
        height: verticalScale(20),
    },
});

export default AccountScreen;
