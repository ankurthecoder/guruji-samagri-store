import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
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
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
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
                            onPress={() => Alert.alert('Addresses', 'Saved Addresses screen coming soon')}
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
                            icon="notifications-outline"
                            title="Notifications"
                            onPress={() => Alert.alert('Notifications', 'Notifications screen coming soon')}
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
