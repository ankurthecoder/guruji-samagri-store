import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS, SIZES } from '../constants/colors';
import useCartStore from '../stores/cartStore';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CartScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const cartItems = useCartStore(state => state.items);
    const updateQuantity = useCartStore(state => state.updateQuantity);
    const totalAmount = useCartStore(state => state.totalAmount);
    const totalItems = useCartStore(state => state.totalItems);

    // Calculate bill details
    const itemTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity * 1.3), 0); // Original price (30% higher)
    const savings = itemTotal - totalAmount;
    const handlingFee = 9.80;
    const deliveryPartnerFee = 16.00;
    const gstCharges = 1.76;
    const finalAmount = totalAmount + handlingFee + gstCharges;

    const handleQuantityChange = (productId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity >= 0) {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleAddMoreItems = () => {
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <View style={styles.addressTypeRow}>
                        <Ionicons name="home" size={16} color={COLORS.BLACK} />
                        <Text style={styles.addressType}>HOME</Text>
                        <Ionicons name="chevron-down" size={16} color={COLORS.BLACK} />
                    </View>
                    <Text style={styles.addressText} numberOfLines={1}>
                        F-215 Mangal bazar road, Block F, Block F, Laxmi Na...
                    </Text>
                </View>
                <TouchableOpacity style={styles.printButton}>
                    <Ionicons name="print-outline" size={24} color={COLORS.BLACK} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: verticalScale(100) }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Savings Banner - Skip MaxSaver */}
                <View style={styles.savingsBanner}>
                    <Text style={styles.savingsText}>
                        ₹{Math.round(savings)} saved! on this order, including ₹16 with Swiggy One!
                    </Text>
                </View>

                {/* Zero Fees Section */}
                <View style={styles.zeroFeesSection}>
                    <View style={styles.zeroFeesLeft}>
                        <Text style={styles.zeroFeesTitle}>₹0 FEES</Text>
                        <Text style={styles.zeroFeesSubtitle}>on orders above ₹299</Text>
                    </View>
                    <View style={styles.zeroFeesRight}>
                        <View style={styles.feeRow}>
                            <Text style={styles.feeLabel}>DELIVERY FEE</Text>
                            <Text style={styles.feeStrikethrough}>₹30</Text>
                            <Text style={styles.feeFree}>FREE</Text>
                        </View>
                        <View style={styles.feeRow}>
                            <Text style={styles.feeLabel}>HANDLING FEE</Text>
                            <Text style={styles.feeStrikethrough}>₹11</Text>
                            <Text style={styles.feeFree}>FREE</Text>
                        </View>
                        <View style={styles.feeRow}>
                            <Text style={styles.feeLabel}>SURGE FEE</Text>
                            <Text style={styles.feeStrikethrough}>₹13</Text>
                            <Text style={styles.feeFree}>FREE</Text>
                        </View>
                    </View>
                </View>

                {/* Cart Items Section */}
                <View style={styles.cartItemsSection}>
                    <View style={styles.deliveryHeader}>
                        <Text style={styles.deliveryTime}>10 Mins</Text>
                        <View style={styles.superfastBadge}>
                            <Ionicons name="flash" size={14} color="#00C853" />
                            <Text style={styles.superfastText}>Superfast</Text>
                        </View>
                        <Text style={styles.itemCount}>{totalItems} items</Text>
                    </View>

                    {/* Cart Items List */}
                    {cartItems.map((item, index) => (
                        <View key={item.product._id} style={styles.cartItem}>
                            <Image
                                source={{ uri: item.product.image || 'https://via.placeholder.com/80' }}
                                style={styles.productImage}
                                resizeMode="contain"
                            />
                            <View style={styles.productDetails}>
                                <Text style={styles.productName} numberOfLines={2}>
                                    {item.product.name}
                                </Text>
                                <Text style={styles.productDescription}>
                                    {item.product.category || '1 pack'}
                                </Text>
                                <TouchableOpacity>
                                    <Text style={styles.moveToWishlist}>📋 Move to wishlist</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.productRight}>
                                <View style={styles.quantityControl}>
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                                    >
                                        <Text style={styles.quantityButtonText}>−</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.quantityText}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                                    >
                                        <Text style={styles.quantityButtonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.originalPrice}>₹{Math.round(item.product.price * 1.3)}</Text>
                                    <Text style={styles.discountedPrice}>₹{item.product.price}</Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    {/* Add More Items */}
                    <TouchableOpacity style={styles.addMoreButton} onPress={handleAddMoreItems}>
                        <Ionicons name="add-outline" size={20} color={COLORS.PRIMARY} />
                        <Text style={styles.addMoreText}>Add more items</Text>
                    </TouchableOpacity>
                </View>

                {/* Savings Corner */}
                <View style={styles.savingsCorner}>
                    <Text style={styles.savingsCornerTitle}>SAVINGS CORNER</Text>

                    <TouchableOpacity style={styles.couponRow}>
                        <Ionicons name="pricetag" size={20} color="#2196F3" />
                        <Text style={styles.couponText}>Apply Coupon</Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_SECONDARY} style={styles.chevronIcon} />
                    </TouchableOpacity>

                    <View style={styles.paymentRow}>
                        <View style={styles.paymentLeft}>
                            <View style={styles.cardIcon}>
                                <View style={[styles.cardCircle, { backgroundColor: '#EB001B' }]} />
                                <View style={[styles.cardCircle, { backgroundColor: '#F79E1B', marginLeft: -8 }]} />
                            </View>
                            <View>
                                <Text style={styles.paymentText}>Credit card •••• 1693</Text>
                                <Text style={styles.cashbackText}>Additional ₹23 cashback</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.changeText}>Change ›</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bill Details */}
                <View style={styles.billDetailsSection}>
                    <Text style={styles.billDetailsTitle}>BILL DETAILS</Text>

                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Item Total</Text>
                        <View style={styles.billPriceGroup}>
                            <Text style={styles.billStrikethrough}>₹{Math.round(itemTotal)}</Text>
                            <Text style={styles.billPrice}>₹{Math.round(totalAmount)}</Text>
                        </View>
                    </View>

                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Handling Fee</Text>
                        <Text style={styles.billPrice}>₹{handlingFee.toFixed(2)}</Text>
                    </View>

                    <View style={styles.billDivider} />

                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Delivery Tip</Text>
                        <Text style={styles.addTipText}>Add a tip</Text>
                    </View>

                    <View style={styles.billDivider} />

                    <View style={styles.billRow}>
                        <View style={styles.deliveryFeeLabel}>
                            <View style={styles.oneLogo}>
                                <Text style={styles.oneLogoText}>one</Text>
                            </View>
                            <Text style={styles.billLabel}>Delivery Partner Fee</Text>
                        </View>
                        <View style={styles.billPriceGroup}>
                            <Text style={styles.billStrikethrough}>₹{deliveryPartnerFee.toFixed(2)}</Text>
                            <Text style={styles.feeFreeGreen}>FREE</Text>
                        </View>
                    </View>

                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>GST and Charges</Text>
                        <Text style={styles.billPrice}>₹{gstCharges.toFixed(2)}</Text>
                    </View>

                    <View style={styles.billDivider} />

                    <View style={styles.billRow}>
                        <Text style={styles.billTotalLabel}>To Pay</Text>
                        <View style={styles.billPriceGroup}>
                            <Text style={styles.billStrikethrough}>₹{Math.round(itemTotal + handlingFee + gstCharges)}</Text>
                            <Text style={styles.billTotalPrice}>₹{Math.round(finalAmount)}</Text>
                        </View>
                    </View>
                </View>

                {/* Note Section */}
                <View style={styles.noteSection}>
                    <Text style={styles.noteText}>
                        <Text style={styles.noteLabel}>NOTE: </Text>
                        Orders cannot be cancelled and are non-refundable once packed for delivery.
                    </Text>
                    <TouchableOpacity>
                        <Text style={styles.policyLink}>Read cancellation policy</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Fixed Slide to Pay Button */}
            <View style={[styles.slideToPayContainer, { paddingBottom: insets.bottom }]}>
                <TouchableOpacity activeOpacity={0.8} style={styles.slideToPayWrapper}>
                    <LinearGradient
                        colors={['#0D9B26', '#0C831F', '#0A6B19']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.slideToPayButton}
                    >
                        <View style={styles.slideIconContainer}>
                            <View style={styles.slideIconCircle}>
                                <Ionicons name="arrow-forward" size={20} color={COLORS.WHITE} />
                            </View>
                        </View>
                        <View style={styles.paymentInfo}>
                            <Text style={styles.slideToPayLabel}>Slide to Pay</Text>
                            <Text style={styles.slideToPayAmount}>₹{Math.round(finalAmount)}</Text>
                        </View>
                        <View style={styles.slideHintContainer}>
                            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.5)" />
                            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.5)" style={{ marginLeft: -8 }} />
                            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.5)" style={{ marginLeft: -8 }} />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    backButton: {
        padding: scale(4),
    },
    headerCenter: {
        flex: 1,
        marginLeft: scale(12),
    },
    addressTypeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(2),
    },
    addressType: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: COLORS.BLACK,
        marginLeft: scale(4),
        marginRight: scale(2),
    },
    addressText: {
        fontSize: moderateScale(12),
        color: COLORS.TEXT_SECONDARY,
    },
    printButton: {
        padding: scale(4),
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: verticalScale(20),
    },
    savingsBanner: {
        backgroundColor: '#E8F5E9',
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(16),
    },
    savingsText: {
        fontSize: moderateScale(13),
        color: '#2E7D32',
        fontWeight: '500',
    },
    zeroFeesSection: {
        backgroundColor: COLORS.WHITE,
        marginTop: verticalScale(8),
        padding: scale(16),
        flexDirection: 'row',
        alignItems: 'center',
    },
    zeroFeesLeft: {
        flex: 1,
    },
    zeroFeesTitle: {
        fontSize: moderateScale(28),
        fontWeight: '800',
        color: '#2196F3',
        letterSpacing: 1,
    },
    zeroFeesSubtitle: {
        fontSize: moderateScale(12),
        color: COLORS.TEXT_SECONDARY,
        marginTop: verticalScale(2),
    },
    zeroFeesRight: {
        flex: 1,
    },
    feeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(4),
    },
    feeLabel: {
        fontSize: moderateScale(10),
        color: COLORS.TEXT_SECONDARY,
        flex: 1,
    },
    feeStrikethrough: {
        fontSize: moderateScale(10),
        color: COLORS.TEXT_SECONDARY,
        textDecorationLine: 'line-through',
        marginRight: scale(6),
    },
    feeFree: {
        fontSize: moderateScale(10),
        color: '#00C853',
        fontWeight: '700',
    },
    cartItemsSection: {
        backgroundColor: COLORS.WHITE,
        marginTop: verticalScale(8),
        padding: scale(16),
    },
    deliveryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    deliveryTime: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: COLORS.BLACK,
        marginRight: scale(8),
    },
    superfastBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: scale(6),
        paddingVertical: verticalScale(2),
        borderRadius: scale(4),
        marginRight: scale(8),
    },
    superfastText: {
        fontSize: moderateScale(11),
        color: '#00C853',
        fontWeight: '600',
        marginLeft: scale(2),
    },
    itemCount: {
        fontSize: moderateScale(14),
        color: COLORS.TEXT_SECONDARY,
        marginLeft: 'auto',
    },
    cartItem: {
        flexDirection: 'row',
        paddingVertical: verticalScale(12),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    productImage: {
        width: scale(60),
        height: scale(60),
        borderRadius: scale(8),
        backgroundColor: COLORS.LIGHT_GRAY,
    },
    productDetails: {
        flex: 1,
        marginLeft: scale(12),
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: COLORS.BLACK,
    },
    productDescription: {
        fontSize: moderateScale(12),
        color: COLORS.TEXT_SECONDARY,
        marginTop: verticalScale(2),
    },
    moveToWishlist: {
        fontSize: moderateScale(11),
        color: COLORS.TEXT_SECONDARY,
        marginTop: verticalScale(4),
    },
    productRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00C853',
        borderRadius: scale(8),
        paddingHorizontal: scale(4),
    },
    quantityButton: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
    },
    quantityButtonText: {
        fontSize: moderateScale(18),
        color: '#00C853',
        fontWeight: '700',
    },
    quantityText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: '#00C853',
        minWidth: scale(20),
        textAlign: 'center',
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    originalPrice: {
        fontSize: moderateScale(11),
        color: COLORS.TEXT_SECONDARY,
        textDecorationLine: 'line-through',
    },
    discountedPrice: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: COLORS.BLACK,
    },
    addMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(12),
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        borderRadius: scale(8),
        marginTop: verticalScale(12),
        borderStyle: 'dashed',
    },
    addMoreText: {
        fontSize: moderateScale(14),
        color: COLORS.PRIMARY,
        fontWeight: '600',
        marginLeft: scale(6),
    },
    savingsCorner: {
        backgroundColor: COLORS.WHITE,
        marginTop: verticalScale(8),
        padding: scale(16),
    },
    savingsCornerTitle: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        color: COLORS.TEXT_SECONDARY,
        letterSpacing: 0.5,
        marginBottom: verticalScale(12),
    },
    couponRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(12),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    couponText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: COLORS.BLACK,
        marginLeft: scale(12),
        flex: 1,
    },
    chevronIcon: {
        marginLeft: 'auto',
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: verticalScale(12),
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardIcon: {
        flexDirection: 'row',
        marginRight: scale(12),
    },
    cardCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    paymentText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: COLORS.BLACK,
    },
    cashbackText: {
        fontSize: moderateScale(12),
        color: '#00C853',
        marginTop: verticalScale(2),
    },
    changeText: {
        fontSize: moderateScale(14),
        color: '#2196F3',
        fontWeight: '600',
    },
    billDetailsSection: {
        backgroundColor: COLORS.WHITE,
        marginTop: verticalScale(8),
        padding: scale(16),
    },
    billDetailsTitle: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: COLORS.TEXT_SECONDARY,
        letterSpacing: 0.5,
        marginBottom: verticalScale(16),
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    billLabel: {
        fontSize: moderateScale(14),
        color: COLORS.TEXT_PRIMARY,
    },
    billPrice: {
        fontSize: moderateScale(14),
        color: COLORS.TEXT_PRIMARY,
        fontWeight: '500',
    },
    billPriceGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    billStrikethrough: {
        fontSize: moderateScale(13),
        color: COLORS.TEXT_SECONDARY,
        textDecorationLine: 'line-through',
    },
    billDivider: {
        height: 1,
        backgroundColor: COLORS.BORDER,
        marginVertical: verticalScale(8),
        borderStyle: 'dashed',
    },
    addTipText: {
        fontSize: moderateScale(14),
        color: '#2196F3',
        fontWeight: '600',
    },
    deliveryFeeLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    oneLogo: {
        backgroundColor: '#2E2E2E',
        paddingHorizontal: scale(6),
        paddingVertical: verticalScale(2),
        borderRadius: scale(4),
        marginRight: scale(8),
    },
    oneLogoText: {
        fontSize: moderateScale(10),
        color: COLORS.WHITE,
        fontWeight: '700',
    },
    feeFreeGreen: {
        fontSize: moderateScale(14),
        color: '#00C853',
        fontWeight: '700',
    },
    billTotalLabel: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: COLORS.BLACK,
    },
    billTotalPrice: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: COLORS.BLACK,
    },
    noteSection: {
        backgroundColor: '#FFF3E0',
        marginTop: verticalScale(8),
        padding: scale(16),
    },
    noteText: {
        fontSize: moderateScale(12),
        color: COLORS.TEXT_PRIMARY,
        lineHeight: moderateScale(18),
    },
    noteLabel: {
        color: '#D32F2F',
        fontWeight: '700',
    },
    policyLink: {
        fontSize: moderateScale(12),
        color: '#2196F3',
        fontWeight: '600',
        marginTop: verticalScale(8),
        textDecorationLine: 'underline',
    },
    slideToPayContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 12,
    },
    slideToPayWrapper: {
        marginBottom: verticalScale(8),
    },
    slideToPayButton: {
        borderRadius: scale(12),
        paddingVertical: verticalScale(18),
        paddingHorizontal: scale(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#0C831F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    slideIconContainer: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(22),
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slideIconCircle: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentInfo: {
        flex: 1,
        marginLeft: scale(16),
        alignItems: 'flex-start',
    },
    slideToPayLabel: {
        fontSize: moderateScale(13),
        fontWeight: '500',
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: 0.5,
    },
    slideToPayAmount: {
        fontSize: moderateScale(22),
        fontWeight: '800',
        color: COLORS.WHITE,
        marginTop: verticalScale(2),
    },
    slideHintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: scale(12),
    },
});

export default CartScreen;
