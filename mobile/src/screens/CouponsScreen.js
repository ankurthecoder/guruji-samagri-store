import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CouponsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [couponCode, setCouponCode] = useState('');
    const [expandedCoupon, setExpandedCoupon] = useState(null);

    const bestCoupon = {
        id: 'best1',
        icon: '💰',
        title: 'Assured ₹20 Cashback',
        code: 'MBKFEST',
        bgColor: '#E3F2FD',
        details: [
            'Add items worth ₹44 more to avail this offer',
            'Applicable only on transactions using Mobikwik Wallet',
        ],
    };

    const bankOffers = [
        {
            id: 'bank1',
            icon: '🏦',
            title: 'Get 10% OFF upto ₹250',
            code: 'AXISNEO',
            bgColor: '#F3E5F5',
        },
        {
            id: 'bank2',
            icon: '💳',
            title: 'Assured ₹15 Cashback',
            code: 'AMAZONPAY15',
            bgColor: '#FFF3E0',
        },
        {
            id: 'bank3',
            icon: '💸',
            title: 'Up to ₹200 Cashback',
            code: 'PAYTMUPI',
            bgColor: '#E8F5E9',
        },
        {
            id: 'bank4',
            icon: '🎁',
            title: 'Get 10% OFF upto ₹200',
            code: 'DIGISMART',
            bgColor: '#E0F7FA',
        },
        {
            id: 'bank5',
            icon: '⭐',
            title: 'Assured ₹50-₹150 cashback',
            code: 'JUPITERUPI',
            bgColor: '#FFF9C4',
        },
    ];

    const handleApplyCoupon = () => {
        if (couponCode.trim()) {
            console.log('Applying coupon:', couponCode);
            // Handle coupon application
        }
    };

    const CouponCard = ({ coupon, showApplyButton = false, canExpand = false }) => {
        const isExpanded = expandedCoupon === coupon.id;

        return (
            <View style={[styles.couponCard, { backgroundColor: coupon.bgColor }]}>
                <View style={styles.couponHeader}>
                    <View style={styles.couponLeft}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>{coupon.icon}</Text>
                        </View>
                        <View style={styles.couponInfo}>
                            <Text style={styles.couponTitle}>{coupon.title}</Text>
                            <Text style={styles.couponCode}>Use code {coupon.code}</Text>
                        </View>
                    </View>
                    {showApplyButton && (
                        <TouchableOpacity style={styles.applyButton}>
                            <Text style={styles.applyButtonText}>Apply</Text>
                        </TouchableOpacity>
                    )}
                    {canExpand && (
                        <TouchableOpacity
                            onPress={() => setExpandedCoupon(isExpanded ? null : coupon.id)}
                        >
                            <Ionicons
                                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color={COLORS.TEXT_SECONDARY}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {showApplyButton && coupon.details && (
                    <View style={styles.couponDetails}>
                        {coupon.details.map((detail, index) => (
                            <Text key={index} style={styles.detailText}>
                                • {detail}
                            </Text>
                        ))}
                        <TouchableOpacity>
                            <Text style={styles.readMore}>+ Read more</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {canExpand && isExpanded && (
                    <View style={styles.expandedContent}>
                        <Text style={styles.expandedText}>
                            Valid on all orders. Maximum discount ₹{Math.floor(Math.random() * 100 + 50)}.
                        </Text>
                    </View>
                )}
            </View>
        );
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
                <Text style={styles.headerTitle}>Coupons</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Coupon Input */}
                <View style={styles.inputSection}>
                    <TextInput
                        style={styles.input}
                        value={couponCode}
                        onChangeText={setCouponCode}
                        placeholder="Type coupon code here"
                        placeholderTextColor={COLORS.TEXT_SECONDARY}
                        autoCapitalize="characters"
                    />
                    <TouchableOpacity
                        style={[styles.inputApplyButton, !couponCode && styles.inputApplyButtonDisabled]}
                        onPress={handleApplyCoupon}
                        disabled={!couponCode}
                    >
                        <Text style={[styles.inputApplyText, !couponCode && styles.inputApplyTextDisabled]}>
                            Apply
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Best Coupon */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Best coupon for you</Text>
                    <CouponCard coupon={bestCoupon} showApplyButton={true} />
                </View>

                {/* Bank Offers */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bank offers</Text>
                    {bankOffers.map((offer) => (
                        <CouponCard key={offer.id} coupon={offer} canExpand={true} />
                    ))}
                </View>

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
        paddingBottom: verticalScale(20),
    },
    inputSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
        margin: scale(16),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        borderRadius: scale(8),
        borderWidth: 1,
        borderColor: COLORS.BORDER,
    },
    input: {
        flex: 1,
        fontSize: moderateScale(14),
        color: COLORS.TEXT_PRIMARY,
        padding: 0,
    },
    inputApplyButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(8),
        borderRadius: scale(6),
    },
    inputApplyButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    inputApplyText: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: COLORS.WHITE,
    },
    inputApplyTextDisabled: {
        color: '#999',
    },
    section: {
        marginBottom: verticalScale(24),
    },
    sectionTitle: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
        marginHorizontal: scale(16),
        marginBottom: verticalScale(12),
    },
    couponCard: {
        marginHorizontal: scale(16),
        marginBottom: verticalScale(12),
        padding: scale(16),
        borderRadius: scale(12),
    },
    couponHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    couponLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: scale(48),
        height: scale(48),
        borderRadius: scale(8),
        backgroundColor: COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    icon: {
        fontSize: moderateScale(24),
    },
    couponInfo: {
        flex: 1,
    },
    couponTitle: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: COLORS.BLACK,
        marginBottom: verticalScale(4),
    },
    couponCode: {
        fontSize: moderateScale(11),
        color: COLORS.TEXT_SECONDARY,
    },
    applyButton: {
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(8),
        borderRadius: scale(6),
        marginLeft: scale(8),
    },
    applyButtonText: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
    },
    couponDetails: {
        marginTop: verticalScale(12),
        paddingTop: verticalScale(12),
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    detailText: {
        fontSize: moderateScale(11),
        color: COLORS.TEXT_SECONDARY,
        marginBottom: verticalScale(4),
    },
    readMore: {
        fontSize: moderateScale(11),
        color: COLORS.PRIMARY,
        fontWeight: '600',
        marginTop: verticalScale(4),
    },
    expandedContent: {
        marginTop: verticalScale(8),
        paddingTop: verticalScale(8),
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    expandedText: {
        fontSize: moderateScale(11),
        color: COLORS.TEXT_SECONDARY,
    },
    bottomSpacer: {
        height: verticalScale(20),
    },
});

export default CouponsScreen;
