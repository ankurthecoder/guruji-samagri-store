import React, { useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    StatusBar,
    Platform,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/colors';
import AccordionSection from '../components/AccordionSection';
import ImageLightbox from '../components/ImageLightbox';
import useCartStore from '../stores/cartStore';

const { width } = Dimensions.get('window');

/**
 * ProductDetailScreen
 * Full-screen product detail view matching Blinkit's UI
 */
const ProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const insets = useSafeAreaInsets();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [lightboxVisible, setLightboxVisible] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(product?.variant || '300 g');
    const [detailsExpanded, setDetailsExpanded] = useState(false);

    const addItem = useCartStore(state => state.addItem);
    const cartItems = useCartStore(state => state.items);

    // Hide bottom tabs when this screen is focused
    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: { display: 'none' }
        });

        return () => {
            // Show tabs again when leaving this screen
            navigation.getParent()?.setOptions({
                tabBarStyle: {
                    display: 'flex',
                    paddingBottom: Platform.OS === 'ios' ? 0 : 5,
                    paddingTop: 5,
                    height: 60,
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E0E0E0',
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                }
            });
        };
    }, [navigation]);

    if (!product) {
        navigation.goBack();
        return null;
    }

    // Mock product images (replace with actual product images)
    const productImages = [
        product.image || 'https://picsum.photos/400/400?random=1',
        'https://picsum.photos/400/400?random=2',
        'https://picsum.photos/400/400?random=3',
    ];

    // Mock data (should come from product object)
    const highlights = {
        'Consistency': 'Raw',
        'Diet Preference': 'Organic',
        'Sugar Profile': 'No Added Sugar',
        'Honey Type': 'Organic Honey',
        'Pack Type': 'Glass Jar',
        'Country of Origin': 'India',
    };

    const nutritionalInfo = [
        { label: 'Energy Per 100 g (kcal)', value: '320' },
        { label: 'Protein Per 100 g (g)', value: '0' },
        { label: 'Total Carbohydrates Per 100 g (g)', value: '80' },
        { label: 'Total Sugar Per 100 g (g)', value: '80' },
        { label: 'Added Sugars Per 100 g (g)', value: '0' },
        { label: 'Total Fat Per 100 g (g)', value: '0' },
        { label: 'Sodium Per 100 g (mg)', value: '17' },
        { label: 'Calcium Per 100 g (g)', value: '0.013' },
    ];

    const featureBoxes = [
        { icon: '🔄', title: '72 hours', subtitle: 'Replacement' },
        { icon: '💬', title: '24/7', subtitle: 'Support' },
        { icon: '🚚', title: 'Fast', subtitle: 'Delivery' },
    ];

    const handleImageScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentImageIndex(index);
    };

    const handleAddToCart = () => {
        addItem({
            _id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
        }, 1);
    };

    const cartItem = cartItems.find(item => item.product._id === product.id);
    const cartQuantity = cartItem ? cartItem.quantity : 0;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />

            {/* Close Button */}
            <TouchableOpacity
                style={[styles.closeButton, { top: insets.top + verticalScale(10) }]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
            >
                <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Image Carousel */}
                <View style={styles.imageCarouselContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleImageScroll}
                        scrollEventThrottle={16}
                    >
                        {productImages.map((imageUri, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setCurrentImageIndex(index);
                                    setLightboxVisible(true);
                                }}
                                activeOpacity={0.9}
                            >
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.productImage}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Image Dots */}
                    {productImages.length > 1 && (
                        <View style={styles.dotsContainer}>
                            {productImages.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        currentImageIndex === index && styles.activeDot,
                                    ]}
                                />
                            ))}
                        </View>
                    )}

                    {/* Delivery Time Badge */}
                    {product.deliveryTime && (
                        <View style={styles.deliveryBadge}>
                            <Text style={styles.deliveryIcon}>⏱</Text>
                            <Text style={styles.deliveryText}>
                                {product.deliveryTime} MINS
                            </Text>
                        </View>
                    )}
                </View>

                {/* Product Info Section */}
                <View style={styles.infoSection}>
                    {/* Title */}
                    <Text style={styles.productTitle}>{product.name}</Text>

                    {/* Rating & Reviews */}
                    {product.rating && (
                        <View style={styles.ratingContainer}>
                            <View style={styles.starsContainer}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Text key={star} style={styles.star}>
                                        {star <= Math.floor(product.rating) ? '⭐' : '☆'}
                                    </Text>
                                ))}
                            </View>
                            <Text style={styles.reviewCount}>
                                ({product.reviewCount?.toLocaleString()})
                            </Text>
                        </View>
                    )}

                    {/* Price Section */}
                    <View style={styles.priceSection}>
                        <View style={styles.priceRow}>
                            <Text style={styles.price}>₹{product.price}</Text>
                            {product.mrp > product.price && (
                                <>
                                    <Text style={styles.mrp}>MRP ₹{product.mrp}</Text>
                                    <View style={styles.discountBadge}>
                                        <Text style={styles.discountText}>
                                            {product.discount}% OFF
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>
                        {product.perUnitPrice && (
                            <Text style={styles.perUnitPrice}>{product.perUnitPrice}</Text>
                        )}
                    </View>

                    {/* Variant Selection */}
                    <View style={styles.variantSection}>
                        <Text style={styles.sectionLabel}>Select Size</Text>
                        <View style={styles.variantOptions}>
                            <TouchableOpacity
                                style={[styles.variantButton, styles.variantButtonActive]}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.variantTextActive}>
                                    {product.variant}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Feature Boxes */}
                    <View style={styles.featureBoxesContainer}>
                        {featureBoxes.map((feature, index) => (
                            <View key={index} style={styles.featureBox}>
                                <Text style={styles.featureIcon}>{feature.icon}</Text>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Product Details Toggle */}
                    <TouchableOpacity
                        style={styles.detailsToggle}
                        activeOpacity={0.7}
                        onPress={() => setDetailsExpanded(!detailsExpanded)}
                    >
                        <Text style={styles.detailsToggleText}>View product details</Text>
                        <Text style={[styles.detailsArrow, detailsExpanded && styles.detailsArrowExpanded]}>
                            ▲
                        </Text>
                    </TouchableOpacity>

                    {/* Accordion Sections - Only show when expanded */}
                    {detailsExpanded && (
                        <View style={styles.accordionsContainer}>
                            <AccordionSection title="Highlights" defaultExpanded={true}>
                                <View style={styles.highlightsTable}>
                                    {Object.entries(highlights).map(([key, value], index) => (
                                        <View key={index} style={styles.highlightsRow}>
                                            <Text style={styles.highlightsLabel}>{key}</Text>
                                            <Text style={styles.highlightsValue}>{value}</Text>
                                        </View>
                                    ))}
                                </View>
                            </AccordionSection>

                            <AccordionSection title="Nutritional Information">
                                <View style={styles.nutritionTable}>
                                    {nutritionalInfo.map((item, index) => (
                                        <View key={index} style={styles.nutritionRow}>
                                            <Text style={styles.nutritionLabel}>{item.label}</Text>
                                            <Text style={styles.nutritionValue}>{item.value}</Text>
                                        </View>
                                    ))}
                                </View>
                            </AccordionSection>
                        </View>
                    )}

                    {/* Bottom Spacer for sticky bar */}
                    <View style={styles.bottomSpacer} />
                </View>
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View style={[styles.stickyBar, { paddingBottom: verticalScale(12) + insets.bottom }]}>
                <View style={styles.stickyBarLeft}>
                    <Text style={styles.stickyVariant}>{selectedVariant}</Text>
                    <Text style={styles.stickyPrice}>₹{product.price}</Text>
                    <Text style={styles.stickyTaxText}>Inclusive of all taxes</Text>
                </View>
                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={handleAddToCart}
                    activeOpacity={0.8}
                >
                    <Text style={styles.addToCartText}>
                        {cartQuantity > 0 ? `Added (${cartQuantity})` : 'Add to cart'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Image Lightbox */}
            <ImageLightbox
                visible={lightboxVisible}
                images={productImages}
                initialIndex={currentImageIndex}
                onClose={() => setLightboxVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    closeButton: {
        position: 'absolute',
        left: scale(16),
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.1,
        shadowRadius: scale(4),
        elevation: 3,
    },
    closeIcon: {
        fontSize: moderateScale(20),
        color: COLORS.TEXT_PRIMARY,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    imageCarouselContainer: {
        position: 'relative',
    },
    productImage: {
        width,
        height: verticalScale(350),
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(12),
    },
    dot: {
        width: scale(6),
        height: scale(6),
        borderRadius: scale(3),
        backgroundColor: COLORS.BORDER,
        marginHorizontal: scale(3),
    },
    activeDot: {
        backgroundColor: COLORS.PRIMARY,
        width: scale(20),
    },
    deliveryBadge: {
        position: 'absolute',
        top: verticalScale(16),
        right: scale(16),
        backgroundColor: 'rgba(12, 131, 31, 0.95)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(4),
        borderRadius: scale(4),
    },
    deliveryIcon: {
        fontSize: moderateScale(12),
        marginRight: scale(4),
    },
    deliveryText: {
        color: COLORS.WHITE,
        fontSize: SIZES.FONT_XS,
        fontWeight: '700',
    },
    infoSection: {
        paddingHorizontal: scale(16),
    },
    productTitle: {
        fontSize: SIZES.FONT_XL,
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: verticalScale(8),
        lineHeight: moderateScale(24),
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: scale(4),
    },
    star: {
        fontSize: moderateScale(14),
        marginRight: scale(2),
    },
    reviewCount: {
        fontSize: SIZES.FONT_SM,
        color: COLORS.TEXT_SECONDARY,
        marginLeft: scale(4),
    },
    priceSection: {
        marginBottom: verticalScale(16),
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(4),
    },
    price: {
        fontSize: moderateScale(24),
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY,
        marginRight: scale(8),
    },
    mrp: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.TEXT_SECONDARY,
        textDecorationLine: 'line-through',
        marginRight: scale(8),
    },
    discountBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: scale(6),
        paddingVertical: verticalScale(2),
        borderRadius: scale(4),
    },
    discountText: {
        fontSize: SIZES.FONT_XS,
        color: COLORS.PRIMARY,
        fontWeight: '700',
    },
    perUnitPrice: {
        fontSize: SIZES.FONT_SM,
        color: COLORS.TEXT_SECONDARY,
    },
    variantSection: {
        marginBottom: verticalScale(16),
    },
    sectionLabel: {
        fontSize: SIZES.FONT_MD,
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: verticalScale(8),
    },
    variantOptions: {
        flexDirection: 'row',
    },
    variantButton: {
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(8),
        borderRadius: scale(8),
        marginRight: scale(8),
    },
    variantButtonActive: {
        borderColor: COLORS.PRIMARY,
        backgroundColor: '#E8F5E9',
    },
    variantTextActive: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.PRIMARY,
        fontWeight: '600',
    },
    featureBoxesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(16),
        backgroundColor: COLORS.LIGHT_GRAY,
        padding: scale(12),
        borderRadius: scale(12),
    },
    featureBox: {
        flex: 1,
        alignItems: 'center',
    },
    featureIcon: {
        fontSize: moderateScale(28),
        marginBottom: verticalScale(4),
    },
    featureTitle: {
        fontSize: SIZES.FONT_SM,
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY,
    },
    featureSubtitle: {
        fontSize: SIZES.FONT_XS,
        color: COLORS.TEXT_SECONDARY,
    },
    detailsToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(12),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
        marginBottom: verticalScale(8),
    },
    detailsToggleText: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.PRIMARY,
        fontWeight: '600',
    },
    detailsArrow: {
        fontSize: moderateScale(14),
        color: COLORS.PRIMARY,
        transform: [{ rotate: '180deg' }],
    },
    detailsArrowExpanded: {
        transform: [{ rotate: '0deg' }],
    },
    accordionsContainer: {
        marginBottom: verticalScale(16),
    },
    highlightsTable: {
        marginTop: verticalScale(8),
    },
    highlightsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(10),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.LIGHT_GRAY,
    },
    highlightsLabel: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.TEXT_SECONDARY,
        flex: 1,
    },
    highlightsValue: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.TEXT_PRIMARY,
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
    },
    nutritionTable: {
        marginTop: verticalScale(8),
    },
    nutritionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(10),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.LIGHT_GRAY,
    },
    nutritionLabel: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.TEXT_SECONDARY,
        flex: 2,
    },
    nutritionValue: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.TEXT_PRIMARY,
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
    },
    bottomSpacer: {
        height: verticalScale(100),
    },
    stickyBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        paddingBottom: verticalScale(12) + (Platform.OS === 'android' ? verticalScale(8) : 0),
        backgroundColor: COLORS.WHITE,
        borderTopWidth: 1,
        borderTopColor: COLORS.BORDER,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(-2) },
        shadowOpacity: 0.1,
        shadowRadius: scale(4),
        elevation: 10,
    },
    stickyBarLeft: {
        flex: 1,
    },
    stickyVariant: {
        fontSize: SIZES.FONT_MD,
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
    },
    stickyPrice: {
        fontSize: moderateScale(20),
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY,
    },
    stickyTaxText: {
        fontSize: SIZES.FONT_XS,
        color: COLORS.TEXT_SECONDARY,
    },
    addToCartButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingHorizontal: scale(24),
        paddingVertical: verticalScale(12),
        borderRadius: scale(8),
        minWidth: scale(120),
        alignItems: 'center',
    },
    addToCartText: {
        color: COLORS.WHITE,
        fontSize: SIZES.FONT_LG,
        fontWeight: '700',
    },
});

export default ProductDetailScreen;
