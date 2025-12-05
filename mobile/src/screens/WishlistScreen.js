import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS, SIZES } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useWishlistStore from '../stores/wishlistStore';
import useCartStore from '../stores/cartStore';

const WishlistScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const wishlistItems = useWishlistStore(state => state.items);
    const removeFromWishlist = useWishlistStore(state => state.removeFromWishlist);
    const addItem = useCartStore(state => state.addItem);
    const cartItems = useCartStore(state => state.items);

    const handleAddToCart = (product) => {
        addItem({
            _id: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
        }, 1);
    };

    const handleRemoveFromWishlist = (productId) => {
        removeFromWishlist(productId);
    };

    const getCartQuantity = (productId) => {
        const cartItem = cartItems.find(item => item.product._id === productId);
        return cartItem ? cartItem.quantity : 0;
    };

    const WishlistItem = ({ item }) => {
        const cartQuantity = getCartQuantity(item._id);

        return (
            <TouchableOpacity
                style={styles.wishlistCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Home', {
                    screen: 'ProductDetail',
                    params: { product: item }
                })}
            >
                <Image
                    source={{ uri: item.image || 'https://via.placeholder.com/120' }}
                    style={styles.productImage}
                />

                {/* Remove Button */}
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveFromWishlist(item._id)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close-circle" size={24} color="#F44336" />
                </TouchableOpacity>

                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                        {item.name}
                    </Text>
                    {item.category && (
                        <Text style={styles.productCategory}>{item.category}</Text>
                    )}

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>₹{item.price}</Text>
                        {item.mrp && item.mrp > item.price && (
                            <>
                                <Text style={styles.mrp}>₹{item.mrp}</Text>
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>{item.discount}% OFF</Text>
                                </View>
                            </>
                        )}
                    </View>

                    {/* Add to Cart Button */}
                    {cartQuantity > 0 ? (
                        <View style={styles.quantityControls}>
                            <Text style={styles.inCartText}>In Cart ({cartQuantity})</Text>
                            <TouchableOpacity
                                style={styles.viewCartButton}
                                onPress={() => navigation.navigate('Home', { screen: 'Cart' })}
                            >
                                <Text style={styles.viewCartText}>View Cart</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={() => handleAddToCart(item)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.addToCartText}>ADD TO CART</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const EmptyWishlist = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={80} color={COLORS.TEXT_SECONDARY} />
            <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
            <Text style={styles.emptySubtitle}>
                Add items you love to your wishlist
            </Text>
            <TouchableOpacity
                style={styles.shopNowButton}
                onPress={() => navigation.navigate('Home')}
                activeOpacity={0.8}
            >
                <Text style={styles.shopNowText}>Shop Now</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Wishlist</Text>
                {wishlistItems.length > 0 && (
                    <Text style={styles.itemCount}>{wishlistItems.length} items</Text>
                )}
            </View>

            {/* Wishlist Items */}
            {wishlistItems.length === 0 ? (
                <EmptyWishlist />
            ) : (
                <FlatList
                    data={wishlistItems}
                    renderItem={({ item }) => <WishlistItem item={item} />}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    headerTitle: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: COLORS.BLACK,
    },
    itemCount: {
        fontSize: moderateScale(12),
        color: COLORS.TEXT_SECONDARY,
    },
    listContent: {
        padding: scale(12),
        paddingBottom: verticalScale(100),
    },
    wishlistCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.WHITE,
        borderRadius: scale(12),
        padding: scale(12),
        marginBottom: verticalScale(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
    },
    productImage: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(8),
        backgroundColor: COLORS.LIGHT_GRAY,
    },
    removeButton: {
        position: 'absolute',
        top: scale(8),
        right: scale(8),
        zIndex: 10,
    },
    productInfo: {
        flex: 1,
        marginLeft: scale(12),
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: COLORS.BLACK,
        marginBottom: verticalScale(4),
        paddingRight: scale(20),
    },
    productCategory: {
        fontSize: moderateScale(10),
        color: COLORS.TEXT_SECONDARY,
        marginBottom: verticalScale(8),
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    price: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: COLORS.BLACK,
        marginRight: scale(6),
    },
    mrp: {
        fontSize: moderateScale(11),
        color: COLORS.TEXT_SECONDARY,
        textDecorationLine: 'line-through',
        marginRight: scale(6),
    },
    discountBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: scale(6),
        paddingVertical: verticalScale(2),
        borderRadius: scale(4),
    },
    discountText: {
        fontSize: moderateScale(9),
        fontWeight: '600',
        color: '#00C853',
    },
    addToCartButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: verticalScale(8),
        borderRadius: scale(6),
        alignItems: 'center',
    },
    addToCartText: {
        fontSize: moderateScale(11),
        fontWeight: '700',
        color: COLORS.WHITE,
    },
    quantityControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inCartText: {
        fontSize: moderateScale(11),
        fontWeight: '600',
        color: COLORS.PRIMARY,
    },
    viewCartButton: {
        borderWidth: 1.5,
        borderColor: COLORS.PRIMARY,
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
        borderRadius: scale(6),
    },
    viewCartText: {
        fontSize: moderateScale(10),
        fontWeight: '700',
        color: COLORS.PRIMARY,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(40),
    },
    emptyTitle: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: COLORS.BLACK,
        marginTop: verticalScale(20),
        marginBottom: verticalScale(8),
    },
    emptySubtitle: {
        fontSize: moderateScale(12),
        color: COLORS.TEXT_SECONDARY,
        textAlign: 'center',
        marginBottom: verticalScale(24),
    },
    shopNowButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingHorizontal: scale(32),
        paddingVertical: verticalScale(12),
        borderRadius: scale(8),
    },
    shopNowText: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: COLORS.WHITE,
    },
});

export default WishlistScreen;
