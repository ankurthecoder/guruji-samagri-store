import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS, SIZES } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MyAddressesScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const savedAddresses = [
        {
            id: '1',
            type: 'Home',
            icon: 'home',
            iconColor: '#FFA000', // Amber
            iconBg: '#FFF8E1',
            address: 'Floor 4, F 215 top floor managal bazar road, laxmi nagar, Bal bhavan public school ki band gali ( Gate No 3) , Ganpati jewellers wali gali, Block F, Laxmi Nagar, Delhi',
            phone: '9911881520',
        },
        {
            id: '2',
            type: 'Shikha bansal',
            icon: 'people',
            iconColor: '#FBC02D', // Yellow
            iconBg: '#FFFDE7',
            address: 'Ashirwad towers , block A , peer muchalla, sec 20, 601, Floor 6, Ashirwad Towers, Sector 20,Peer Muchalla,Panchkula',
            phone: '9818030165',
        },
    ];

    const OptionItem = ({ icon, iconColor, iconBg, text, onPress, rightIcon = 'chevron-forward' }) => (
        <TouchableOpacity style={styles.optionItem} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.optionLeft}>
                <View style={[styles.optionIconContainer, iconBg && { backgroundColor: iconBg }]}>
                    {typeof icon === 'string' ? (
                        <Ionicons name={icon} size={22} color={iconColor} />
                    ) : (
                        icon
                    )}
                </View>
                <Text style={[styles.optionText, { color: iconColor === '#2E7D32' ? '#2E7D32' : COLORS.BLACK }]}>
                    {text}
                </Text>
            </View>
            <Ionicons name={rightIcon} size={20} color={COLORS.TEXT_SECONDARY} />
        </TouchableOpacity>
    );

    const AddressCard = ({ item }) => (
        <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
                <View style={[styles.addressIconContainer, { backgroundColor: item.iconBg }]}>
                    <Ionicons name={item.icon} size={24} color={item.iconColor} />
                </View>
                <View style={styles.addressContent}>
                    <Text style={styles.addressType}>{item.type}</Text>
                    <Text style={styles.addressText}>{item.address}</Text>
                    <Text style={styles.addressPhone}>Phone number: {item.phone}</Text>
                </View>
            </View>
            <View style={styles.addressActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My addresses</Text>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Add New Address Options */}
                <View style={styles.optionsContainer}>
                    <OptionItem
                        icon="add"
                        iconColor="#2E7D32" // Green
                        text="Add new address"
                        onPress={() => navigation.navigate('LocationConfirmRoot', {
                            headerTitle: 'Add address',
                            buttonText: 'Add more address details',
                            onLocationConfirm: (location) => {
                                console.log('New address location:', location);
                                // Handle new address creation flow
                            }
                        })}
                    />
                </View>

                {/* Saved Addresses List */}
                <Text style={styles.sectionTitle}>Your saved addresses</Text>

                <View style={styles.addressesList}>
                    {savedAddresses.map((item) => (
                        <AddressCard key={item.id} item={item} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA', // Light gray background like screenshot
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    backButton: {
        marginRight: scale(16),
    },
    headerTitle: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: COLORS.BLACK,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: verticalScale(20),
    },
    optionsContainer: {
        backgroundColor: COLORS.WHITE,
        marginTop: verticalScale(12),
        paddingVertical: verticalScale(4),
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(14),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIconContainer: {
        width: scale(24),
        height: scale(24),
        borderRadius: scale(6),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    optionText: {
        fontSize: moderateScale(13),
        fontWeight: '500',
        color: COLORS.BLACK,
    },
    sectionTitle: {
        fontSize: moderateScale(12),
        color: COLORS.TEXT_SECONDARY,
        marginHorizontal: scale(16),
        marginTop: verticalScale(20),
        marginBottom: verticalScale(12),
    },
    addressesList: {
        gap: verticalScale(12),
    },
    addressCard: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(12),
        borderRadius: scale(12),
        padding: scale(16),
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    addressIconContainer: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    addressContent: {
        flex: 1,
    },
    addressType: {
        fontSize: moderateScale(15),
        fontWeight: '700',
        color: COLORS.BLACK,
        marginBottom: verticalScale(4),
    },
    addressText: {
        fontSize: moderateScale(12),
        color: COLORS.TEXT_SECONDARY,
        lineHeight: moderateScale(18),
        marginBottom: verticalScale(8),
    },
    addressPhone: {
        fontSize: moderateScale(12),
        color: COLORS.TEXT_PRIMARY,
        fontWeight: '500',
    },
    addressActions: {
        flexDirection: 'row',
        marginTop: verticalScale(12),
        gap: scale(16),
    },
    actionButton: {
        padding: scale(4),
    },
});

export default MyAddressesScreen;
