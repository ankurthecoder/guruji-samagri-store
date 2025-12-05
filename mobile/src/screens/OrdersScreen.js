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
import mockOrders from '../data/mockOrders';

const OrdersScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const OrderCard = ({ order }) => (
        <TouchableOpacity
            style={styles.orderCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('OrderDetail', { order })}
        >
            {/* Order Header */}
            <View style={styles.orderHeader}>
                <View style={styles.orderHeaderLeft}>
                    <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                    <View style={styles.orderMeta}>
                        <Text style={styles.orderDate}>{order.date}</Text>
                        <Text style={styles.orderDot}>•</Text>
                        <Text style={styles.orderTime}>{order.time}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${order.statusColor}15` }]}>
                    <Text style={[styles.statusText, { color: order.statusColor }]}>
                        {order.status}
                    </Text>
                </View>
            </View>

            {/* Order Items Preview */}
            <View style={styles.itemsPreview}>
                {order.items.slice(0, 3).map((item, index) => (
                    <Image
                        key={index}
                        source={{ uri: item.image }}
                        style={[
                            styles.itemImage,
                            { zIndex: 3 - index, left: index * 20 }
                        ]}
                    />
                ))}
                {order.itemCount > 3 && (
                    <View style={[styles.moreItemsBadge, { left: 60 }]}>
                        <Text style={styles.moreItemsText}>+{order.itemCount - 3}</Text>
                    </View>
                )}
            </View>

            {/* Order Footer */}
            <View style={styles.orderFooter}>
                <View style={styles.orderFooterLeft}>
                    <Text style={styles.itemCount}>{order.itemCount} items</Text>
                    <Text style={styles.orderDot}>•</Text>
                    <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_SECONDARY} />
            </View>

            {/* Delivery Status for Delivered Orders */}
            {order.status === 'Delivered' && (
                <View style={styles.deliveryInfo}>
                    <Ionicons name="checkmark-circle" size={14} color="#00C853" />
                    <Text style={styles.deliveryText}>
                        Delivered on {order.deliveredDate} at {order.deliveredTime}
                    </Text>
                </View>
            )}

            {/* Cancellation Info for Cancelled Orders */}
            {order.status === 'Cancelled' && order.refundStatus && (
                <View style={styles.refundInfo}>
                    <Ionicons name="information-circle" size={14} color="#2196F3" />
                    <Text style={styles.refundText}>
                        {order.refundStatus} • ₹{order.refundAmount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
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
                <Text style={styles.headerTitle}>Your Orders</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {mockOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}

                {/* Empty State (if no orders) */}
                {mockOrders.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="bag-outline" size={64} color={COLORS.TEXT_SECONDARY} />
                        <Text style={styles.emptyTitle}>No Orders Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Your order history will appear here
                        </Text>
                    </View>
                )}

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
        paddingTop: verticalScale(8),
    },
    orderCard: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(12),
        marginBottom: verticalScale(12),
        borderRadius: scale(12),
        padding: scale(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: verticalScale(12),
    },
    orderHeaderLeft: {
        flex: 1,
    },
    orderNumber: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: COLORS.BLACK,
        marginBottom: verticalScale(4),
    },
    orderMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderDate: {
        fontSize: moderateScale(10),
        color: COLORS.TEXT_SECONDARY,
    },
    orderDot: {
        fontSize: moderateScale(10),
        color: COLORS.TEXT_SECONDARY,
        marginHorizontal: scale(4),
    },
    orderTime: {
        fontSize: moderateScale(10),
        color: COLORS.TEXT_SECONDARY,
    },
    statusBadge: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: scale(6),
    },
    statusText: {
        fontSize: moderateScale(10),
        fontWeight: '600',
    },
    itemsPreview: {
        flexDirection: 'row',
        height: verticalScale(50),
        marginBottom: verticalScale(12),
        position: 'relative',
    },
    itemImage: {
        width: scale(50),
        height: scale(50),
        borderRadius: scale(8),
        backgroundColor: COLORS.LIGHT_GRAY,
        position: 'absolute',
        borderWidth: 2,
        borderColor: COLORS.WHITE,
    },
    moreItemsBadge: {
        width: scale(50),
        height: scale(50),
        borderRadius: scale(8),
        backgroundColor: '#F5F5F5',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.WHITE,
    },
    moreItemsText: {
        fontSize: moderateScale(11),
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: verticalScale(12),
        borderTopWidth: 1,
        borderTopColor: COLORS.BORDER,
    },
    orderFooterLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemCount: {
        fontSize: moderateScale(11),
        color: COLORS.TEXT_SECONDARY,
    },
    totalAmount: {
        fontSize: moderateScale(12),
        fontWeight: '700',
        color: COLORS.BLACK,
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(8),
        paddingTop: verticalScale(8),
        borderTopWidth: 1,
        borderTopColor: COLORS.BORDER,
    },
    deliveryText: {
        fontSize: moderateScale(10),
        color: '#00C853',
        marginLeft: scale(6),
    },
    refundInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(8),
        paddingTop: verticalScale(8),
        borderTopWidth: 1,
        borderTopColor: COLORS.BORDER,
    },
    refundText: {
        fontSize: moderateScale(10),
        color: '#2196F3',
        marginLeft: scale(6),
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(80),
    },
    emptyTitle: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY,
        marginTop: verticalScale(16),
    },
    emptySubtitle: {
        fontSize: moderateScale(12),
        color: COLORS.TEXT_SECONDARY,
        marginTop: verticalScale(8),
    },
    bottomSpacer: {
        height: verticalScale(100),
    },
});

export default OrdersScreen;
