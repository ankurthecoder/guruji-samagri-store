import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS, SIZES } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OrderDetailScreen = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();
    const { order } = route.params;

    const OrderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                </Text>
                <Text style={styles.itemVariant}>{item.variant}</Text>
                <View style={styles.itemFooter}>
                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                    <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                </View>
            </View>
        </View>
    );

    const InfoRow = ({ label, value, valueStyle }) => (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
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
                <Text style={styles.headerTitle}>Order Details</Text>
                <TouchableOpacity style={styles.helpButton}>
                    <Ionicons name="help-circle-outline" size={24} color={COLORS.BLACK} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Order Status Card */}
                <View style={styles.statusCard}>
                    <View style={styles.statusHeader}>
                        <View style={[styles.statusIcon, { backgroundColor: `${order.statusColor}15` }]}>
                            <Ionicons
                                name={
                                    order.status === 'Delivered'
                                        ? 'checkmark-circle'
                                        : order.status === 'Cancelled'
                                            ? 'close-circle'
                                            : 'time'
                                }
                                size={32}
                                color={order.statusColor}
                            />
                        </View>
                        <View style={styles.statusTextContainer}>
                            <Text style={[styles.statusTitle, { color: order.statusColor }]}>
                                {order.status}
                            </Text>
                            {order.status === 'Delivered' && (
                                <Text style={styles.statusSubtitle}>
                                    on {order.deliveredDate} at {order.deliveredTime}
                                </Text>
                            )}
                            {order.status === 'Cancelled' && order.cancelReason && (
                                <Text style={styles.statusSubtitle}>{order.cancelReason}</Text>
                            )}
                        </View>
                    </View>

                    {/* Refund Info for Cancelled Orders */}
                    {order.status === 'Cancelled' && order.refundStatus && (
                        <View style={styles.refundCard}>
                            <Ionicons name="checkmark-circle" size={16} color="#00C853" />
                            <Text style={styles.refundText}>
                                {order.refundStatus} • ₹{order.refundAmount}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Order Items */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Order Items ({order.itemCount})</Text>
                        <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                    </View>
                    <View style={styles.itemsCard}>
                        {order.items.map((item, index) => (
                            <OrderItem key={index} item={item} />
                        ))}
                    </View>
                </View>

                {/* Bill Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bill Details</Text>
                    <View style={styles.billCard}>
                        <InfoRow
                            label={`Item Total (${order.itemCount} items)`}
                            value={`₹${Math.round(order.totalAmount * 1.3)}`}
                        />
                        <InfoRow
                            label="Delivery Charges"
                            value="FREE"
                            valueStyle={{ color: '#00C853', fontWeight: '600' }}
                        />
                        <InfoRow label="Handling Fee" value="₹9.80" />
                        <InfoRow label="GST and Charges" value="₹1.76" />

                        <View style={styles.billDivider} />

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Grand Total</Text>
                            <Text style={styles.totalValue}>₹{order.totalAmount}</Text>
                        </View>

                        <View style={styles.savingsRow}>
                            <Ionicons name="pricetag" size={14} color="#00C853" />
                            <Text style={styles.savingsText}>
                                You saved ₹{Math.round(order.totalAmount * 0.3)} on this order
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Payment Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Details</Text>
                    <View style={styles.paymentCard}>
                        <View style={styles.paymentRow}>
                            <Ionicons
                                name={
                                    order.paymentMethod === 'UPI'
                                        ? 'wallet-outline'
                                        : order.paymentMethod === 'Card'
                                            ? 'card-outline'
                                            : 'cash-outline'
                                }
                                size={20}
                                color={COLORS.TEXT_PRIMARY}
                            />
                            <Text style={styles.paymentMethod}>{order.paymentMethod}</Text>
                        </View>
                        {order.status !== 'Cancelled' && (
                            <Text style={styles.paymentStatus}>Payment Successful</Text>
                        )}
                    </View>
                </View>

                {/* Delivery Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <View style={styles.addressCard}>
                        <View style={styles.addressHeader}>
                            <Ionicons name="home" size={18} color={COLORS.TEXT_PRIMARY} />
                            <Text style={styles.addressType}>HOME</Text>
                        </View>
                        <Text style={styles.addressText}>{order.deliveryAddress}</Text>
                    </View>
                </View>

                {/* Order Timeline (for delivered orders) */}
                {order.status === 'Delivered' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Order Timeline</Text>
                        <View style={styles.timelineCard}>
                            <TimelineItem
                                icon="checkmark-circle"
                                title="Delivered"
                                time={`${order.deliveredDate} at ${order.deliveredTime}`}
                                isCompleted
                            />
                            <TimelineItem
                                icon="bicycle"
                                title="Out for Delivery"
                                time={`${order.deliveredDate} at 02:45 PM`}
                                isCompleted
                            />
                            <TimelineItem
                                icon="cube"
                                title="Order Packed"
                                time={`${order.date} at 02:35 PM`}
                                isCompleted
                            />
                            <TimelineItem
                                icon="receipt"
                                title="Order Placed"
                                time={`${order.date} at ${order.time}`}
                                isCompleted
                                isLast
                            />
                        </View>
                    </View>
                )}

                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* Bottom Actions */}
            {order.status === 'Delivered' && (
                <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 10 }]}>
                    <TouchableOpacity style={styles.reorderButton}>
                        <Ionicons name="repeat" size={18} color={COLORS.WHITE} />
                        <Text style={styles.reorderText}>Reorder</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.helpActionButton}>
                        <Ionicons name="help-circle-outline" size={18} color={COLORS.PRIMARY} />
                        <Text style={styles.helpActionText}>Need Help?</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const TimelineItem = ({ icon, title, time, isCompleted, isLast }) => (
    <View style={styles.timelineItem}>
        <View style={styles.timelineLeft}>
            <View style={[styles.timelineIcon, isCompleted && styles.timelineIconCompleted]} />
            {!isLast && <View style={styles.timelineLine} />}
        </View>
        <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>{title}</Text>
            <Text style={styles.timelineTime}>{time}</Text>
        </View>
    </View>
);

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
    helpButton: {
        padding: scale(4),
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: verticalScale(8),
    },
    statusCard: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(12),
        marginBottom: verticalScale(12),
        borderRadius: scale(12),
        padding: scale(16),
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIcon: {
        width: scale(56),
        height: scale(56),
        borderRadius: scale(28),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    statusTextContainer: {
        flex: 1,
    },
    statusTitle: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        marginBottom: verticalScale(4),
    },
    statusSubtitle: {
        fontSize: moderateScale(11),
        color: COLORS.TEXT_SECONDARY,
    },
    refundCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        padding: scale(12),
        borderRadius: scale(8),
        marginTop: verticalScale(12),
    },
    refundText: {
        fontSize: moderateScale(11),
        color: '#00C853',
        fontWeight: '600',
        marginLeft: scale(8),
    },
    section: {
        marginBottom: verticalScale(12),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(12),
        marginBottom: verticalScale(8),
    },
    sectionTitle: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: COLORS.BLACK,
        paddingHorizontal: scale(12),
        marginBottom: verticalScale(8),
    },
    orderNumber: {
        fontSize: moderateScale(11),
        color: COLORS.TEXT_SECONDARY,
    },
    itemsCard: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(12),
        borderRadius: scale(12),
        overflow: 'hidden',
    },
    orderItem: {
        flexDirection: 'row',
        padding: scale(12),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    itemImage: {
        width: scale(70),
        height: scale(70),
        borderRadius: scale(8),
        backgroundColor: COLORS.LIGHT_GRAY,
    },
    itemDetails: {
        flex: 1,
        marginLeft: scale(12),
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: COLORS.BLACK,
        marginBottom: verticalScale(4),
    },
    itemVariant: {
        fontSize: moderateScale(10),
        color: COLORS.TEXT_SECONDARY,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemQuantity: {
        fontSize: moderateScale(10),
        color: COLORS.TEXT_SECONDARY,
    },
    itemPrice: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        color: COLORS.BLACK,
    },
    billCard: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(12),
        borderRadius: scale(12),
        padding: scale(16),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    infoLabel: {
        fontSize: moderateScale(11),
        color: COLORS.TEXT_SECONDARY,
    },
    infoValue: {
        fontSize: moderateScale(11),
        color: COLORS.TEXT_PRIMARY,
        fontWeight: '500',
    },
    billDivider: {
        height: 1,
        backgroundColor: COLORS.BORDER,
        marginVertical: verticalScale(12),
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    totalLabel: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: COLORS.BLACK,
    },
    totalValue: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: COLORS.BLACK,
    },
    savingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        padding: scale(10),
        borderRadius: scale(6),
    },
    savingsText: {
        fontSize: moderateScale(10),
        color: '#00C853',
        fontWeight: '600',
        marginLeft: scale(6),
    },
    paymentCard: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(12),
        borderRadius: scale(12),
        padding: scale(16),
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    paymentMethod: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: COLORS.BLACK,
        marginLeft: scale(10),
    },
    paymentStatus: {
        fontSize: moderateScale(10),
        color: '#00C853',
        fontWeight: '500',
    },
    addressCard: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(12),
        borderRadius: scale(12),
        padding: scale(16),
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    addressType: {
        fontSize: moderateScale(11),
        fontWeight: '700',
        color: COLORS.BLACK,
        marginLeft: scale(6),
    },
    addressText: {
        fontSize: moderateScale(11),
        color: COLORS.TEXT_SECONDARY,
        lineHeight: moderateScale(16),
    },
    timelineCard: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(12),
        borderRadius: scale(12),
        padding: scale(16),
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: verticalScale(4),
    },
    timelineLeft: {
        alignItems: 'center',
        marginRight: scale(12),
        width: scale(32),
    },
    timelineIcon: {
        width: scale(12),
        height: scale(12),
        borderRadius: scale(6),
        backgroundColor: COLORS.BORDER,
        borderWidth: 3,
        borderColor: COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timelineIconCompleted: {
        backgroundColor: COLORS.PRIMARY,
        borderColor: COLORS.WHITE,
    },
    timelineLine: {
        width: 2,
        height: verticalScale(40),
        backgroundColor: COLORS.BORDER,
        marginTop: verticalScale(4),
    },
    timelineContent: {
        flex: 1,
        paddingTop: scale(4),
    },
    timelineTitle: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: COLORS.BLACK,
        marginBottom: verticalScale(4),
    },
    timelineTime: {
        fontSize: moderateScale(10),
        color: COLORS.TEXT_SECONDARY,
    },
    bottomActions: {
        flexDirection: 'row',
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(12),
        borderTopWidth: 1,
        borderTopColor: COLORS.BORDER,
        gap: scale(12),
    },
    reorderButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: verticalScale(12),
        borderRadius: scale(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    reorderText: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        color: COLORS.WHITE,
        marginLeft: scale(6),
    },
    helpActionButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: COLORS.WHITE,
        paddingVertical: verticalScale(12),
        borderRadius: scale(8),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: COLORS.PRIMARY,
    },
    helpActionText: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        color: COLORS.PRIMARY,
        marginLeft: scale(6),
    },
    bottomSpacer: {
        height: verticalScale(20),
    },
});

export default OrderDetailScreen;
