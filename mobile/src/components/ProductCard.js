import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { COLORS, SIZES } from '../constants/colors';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, onOpenVariantModal, onProductPress }) => {
    const {
        name,
        image,
        variant,
        rating,
        reviewCount,
        deliveryTime,
        discount,
        price,
        mrp,
        perUnitPrice,
        variantCount,
        stock,
        isWishlisted,
    } = product;

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push('⭐');
            } else if (i === fullStars && hasHalfStar) {
                stars.push('⭐'); // Half star represented as full for simplicity
            } else {
                stars.push('☆');
            }
        }
        return stars.join('');
    };

    const formatReviewCount = (count) => {
        if (count >= 1000) {
            return `(${(count / 1000).toFixed(1)}k)`;
        }
        return `(${count})`;
    };

    const isLowStock = stock && stock <= 5;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onProductPress?.(product)}
            activeOpacity={0.9}
        >
            {/* Image with Wishlist Heart */}
            <View style={styles.imageContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.imagePlaceholderText}>📦</Text>
                    </View>
                )}
                <TouchableOpacity
                    style={styles.wishlistButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        onToggleWishlist?.(product);
                    }}>
                    <Text style={styles.wishlistIcon}>
                        {isWishlisted ? '❤️' : '♡'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Variant Info */}
                {variant && (
                    <View style={styles.variantBadge}>
                        <Text style={styles.variantText}>{variant}</Text>
                    </View>
                )}

                {/* Product Name */}
                <Text style={styles.productName} numberOfLines={2}>
                    {name}
                </Text>

                {/* Rating & Reviews */}
                <View style={styles.ratingContainer}>
                    <Text style={styles.stars}>{renderStars(rating)}</Text>
                    <Text style={styles.reviewCount}>{formatReviewCount(reviewCount)}</Text>
                </View>

                {/* Delivery Time */}
                <View style={styles.deliveryBadge}>
                    <Text style={styles.deliveryIcon}>🕐</Text>
                    <Text style={styles.deliveryText}>{deliveryTime} MINS</Text>
                </View>

                {/* Pricing */}
                <View style={styles.pricingContainer}>
                    <View style={styles.priceRow}>
                        {discount > 0 && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>{discount}% OFF</Text>
                            </View>
                        )}
                        <Text style={styles.price}>₹{price}</Text>
                        {mrp > price && (
                            <Text style={styles.mrp}>₹{mrp}</Text>
                        )}
                    </View>
                    {perUnitPrice && (
                        <Text style={styles.perUnitPrice}>{perUnitPrice}</Text>
                    )}
                </View>

                {/* ADD Button or Quantity Controls */}
                {product.quantity && product.quantity > 0 ? (
                    <View style={styles.quantityControls}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                onAddToCart?.(product, -1);
                            }}>
                            <Text style={styles.quantityButtonText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{product.quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                onAddToCart?.(product, 1);
                            }}>
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            if (product.variants && product.variants.length > 1) {
                                onOpenVariantModal?.(product);
                            } else {
                                onAddToCart?.(product, 1);
                            }
                        }}>
                        <View style={styles.addButtonContent}>
                            <Text style={styles.addButtonText}>ADD</Text>
                            {product.variants && product.variants.length > 1 && (
                                <Text style={styles.variantOptionsText}>
                                    {product.variants.length} options
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                )}

                {/* Stock Warning */}
                {isLowStock && (
                    <Text style={styles.stockWarning}>Only {stock} left</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 160,
        backgroundColor: COLORS.WHITE,
        borderRadius: SIZES.RADIUS_MD,
        marginRight: SIZES.PADDING_MD,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.BORDER,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 160,
        backgroundColor: COLORS.LIGHT_GRAY,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.LIGHT_GRAY,
    },
    imagePlaceholderText: {
        fontSize: 50,
    },
    wishlistButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.WHITE,
        borderRadius: SIZES.RADIUS_ROUND,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    wishlistIcon: {
        fontSize: 18,
    },
    content: {
        padding: SIZES.PADDING_SM,
    },
    variantBadge: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.LIGHT_GRAY,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: SIZES.RADIUS_SM,
        marginBottom: 6,
    },
    variantText: {
        fontSize: 9,
        color: COLORS.TEXT_PRIMARY,
        fontWeight: '600',
    },
    productName: {
        fontSize: 11,
        fontWeight: '500',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 6,
        lineHeight: 14,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    stars: {
        fontSize: 10,
        marginRight: 4,
    },
    reviewCount: {
        fontSize: 9,
        color: COLORS.TEXT_SECONDARY,
    },
    deliveryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: SIZES.RADIUS_SM,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    deliveryIcon: {
        fontSize: 8,
        marginRight: 3,
    },
    deliveryText: {
        fontSize: 8,
        fontWeight: '600',
        color: '#2E7D32',
    },
    pricingContainer: {
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 2,
    },
    discountBadge: {
        backgroundColor: '#FFEBEE',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 3,
        marginRight: 6,
    },
    discountText: {
        fontSize: 8,
        fontWeight: '600',
        color: '#C62828',
    },
    price: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.TEXT_PRIMARY,
        marginRight: 6,
    },
    mrp: {
        fontSize: 10,
        color: COLORS.TEXT_SECONDARY,
        textDecorationLine: 'line-through',
    },
    perUnitPrice: {
        fontSize: 9,
        color: COLORS.TEXT_SECONDARY,
    },
    addButton: {
        borderWidth: 1.5,
        borderColor: '#2E7D32',
        backgroundColor: COLORS.WHITE,
        paddingVertical: 8,
        borderRadius: SIZES.RADIUS_SM,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    addButtonContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#2E7D32',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2E7D32',
        borderRadius: SIZES.RADIUS_SM,
        paddingVertical: 6,
        paddingHorizontal: 4,
        marginBottom: 6,
    },
    quantityButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.WHITE,
    },
    quantityText: {
        flex: 1,
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.WHITE,
        textAlign: 'center',
    },
    variantCount: {
        fontSize: 9,
        color: COLORS.TEXT_SECONDARY,
        textAlign: 'center',
        marginBottom: 4,
    },
    variantOptionsText: {
        fontSize: 8,
        fontWeight: '600',
        color: '#2E7D32',
        textAlign: 'center',
        marginTop: 1,
    },
    stockWarning: {
        fontSize: 9,
        fontWeight: '600',
        color: '#F57C00',
        textAlign: 'center',
    },
});

export default ProductCard;
