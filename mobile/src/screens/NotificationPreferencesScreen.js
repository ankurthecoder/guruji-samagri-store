import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NotificationPreferencesScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [whatsappEnabled, setWhatsappEnabled] = useState(true);
    const [smsEnabled, setSmsEnabled] = useState(true);

    const NotificationItem = ({ icon, title, description, enabled, onToggle }) => (
        <View style={styles.notificationCard}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={32} color={icon === 'logo-whatsapp' ? '#25D366' : COLORS.TEXT_PRIMARY} />
            </View>
            <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{title}</Text>
                <Text style={styles.notificationDescription}>{description}</Text>
            </View>
            <Switch
                value={enabled}
                onValueChange={onToggle}
                trackColor={{ false: '#D0D0D0', true: '#81C784' }}
                thumbColor={enabled ? COLORS.PRIMARY : '#f4f3f4'}
                ios_backgroundColor="#D0D0D0"
            />
        </View>
    );

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
                <Text style={styles.headerTitle}>Notification preferences</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <NotificationItem
                    icon="logo-whatsapp"
                    title="Promotional WhatsApp messages"
                    description="Receive WhatsApp updates about coupons, promotions and offers"
                    enabled={whatsappEnabled}
                    onToggle={setWhatsappEnabled}
                />

                <NotificationItem
                    icon="chatbubble-ellipses-outline"
                    title="Promotional SMS"
                    description="Receive SMS updates about coupons, promotions and offers"
                    enabled={smsEnabled}
                    onToggle={setSmsEnabled}
                />
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
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: verticalScale(16),
        paddingBottom: verticalScale(20),
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(16),
        marginBottom: verticalScale(12),
        padding: scale(16),
        borderRadius: scale(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    iconContainer: {
        width: scale(56),
        height: scale(56),
        borderRadius: scale(28),
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    notificationContent: {
        flex: 1,
        marginRight: scale(12),
    },
    notificationTitle: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: COLORS.BLACK,
        marginBottom: verticalScale(4),
    },
    notificationDescription: {
        fontSize: moderateScale(11),
        color: COLORS.TEXT_SECONDARY,
        lineHeight: moderateScale(16),
    },
});

export default NotificationPreferencesScreen;
