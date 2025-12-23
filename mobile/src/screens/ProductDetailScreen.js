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
import { Animated } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import AccordionSection from '../components/AccordionSection';
import ImageLightbox from '../components/ImageLightbox';
import useCartStore from '../stores/cartStore';
import CartBubble from '../components/ViewCart';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// Create animated version of Ionicons
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

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

    // Animation
    const scrollY = React.useRef(new Animated.Value(0)).current;

    // Background image opacity (fades out on scroll)
    const backgroundImageOpacity = scrollY.interpolate({
        inputRange: [0, verticalScale(200)],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    // Header white background opacity (fades in on scroll)
    const headerWhiteOpacity = scrollY.interpolate({
        inputRange: [verticalScale(100), verticalScale(200)],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    // Back button icon color (white to dark)
    const backIconColor = scrollY.interpolate({
        inputRange: [0, verticalScale(150)],
        outputRange: ['#FFFFFF', COLORS.TEXT_PRIMARY],
        extrapolate: 'clamp',
    });


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

    const handleAddToCart = (quantityChange = 1) => {
        const cartItem = cartItems.find(item => item.product._id === product.id);
        const currentQuantity = cartItem ? cartItem.quantity : 0;
        const newQuantity = currentQuantity + quantityChange;

        if (newQuantity <= 0) {
            // Remove from cart
            updateQuantity(product.id, 0);
        } else if (currentQuantity === 0) {
            // Add new item
            addItem({
                _id: product.id,
                name: product.name,
                price: product.price,
                category: product.category,
            }, quantityChange);
        } else {
            // Update existing item
            updateQuantity(product.id, newQuantity);
        }
    };

    const updateQuantity = useCartStore(state => state.updateQuantity);
    const totalItems = useCartStore(state => state.totalItems);
    const cartItem = cartItems.find(item => item.product._id === product.id);
    const cartQuantity = cartItem ? cartItem.quantity : 0;

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                translucent
                backgroundColor="transparent"
            />

            {/* Background Product Image - extends behind status bar */}
            <Animated.View
                style={[
                    styles.backgroundImageContainer,
                    {
                        opacity: backgroundImageOpacity,
                    }
                ]}
            >
                <Image
                    source={{ uri: productImages[0] }}
                    style={styles.fullBackgroundImage}
                />
            </Animated.View>

            {/* Subtle Overlay at top that fades in as user scrolls down */}
            <Animated.View
                style={[
                    styles.backgroundOverlay,
                    {
                        opacity: scrollY.interpolate({
                            inputRange: [0, verticalScale(100), verticalScale(160)],
                            outputRange: [0, 1, 0],
                            extrapolate: 'clamp',
                        })
                    }
                ]}
            />

            {/* Animated White Header (fades in on scroll) */}
            <Animated.View
                style={[
                    styles.animatedHeader,
                    {
                        height: insets.top + verticalScale(50),
                        opacity: headerWhiteOpacity,
                        backgroundColor: COLORS.WHITE,
                        paddingTop: insets.top,
                    }
                ]}
            >
                <Text style={styles.headerTitleText} numberOfLines={1}>{product.name}</Text>
            </Animated.View>

            {/* Back Button */}
            <Animated.View
                style={[styles.backButton, { top: insets.top + verticalScale(10) }]}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                    style={styles.backButtonTouchable}
                >
                    <AnimatedIcon
                        name="arrow-back"
                        size={24}
                        color={backIconColor}
                    />
                </TouchableOpacity>
            </Animated.View>

            {/* Scrollable Content */}
            < Animated.ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                bounces={true}
                onScroll={
                    Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )
                }
                scrollEventThrottle={16}
            >
                {/* Image Carousel */}
                < View style={styles.imageCarouselContainer} >
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleImageScroll}
                        scrollEventThrottle={16}
                        nestedScrollEnabled={true}
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
                    {
                        productImages.length > 1 && (
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
                        )
                    }

                    {/* Delivery Time Badge */}
                    {
                        product.deliveryTime && (
                            <View style={styles.deliveryBadge}>
                                <Text style={styles.deliveryIcon}>⏱</Text>
                                <Text style={styles.deliveryText}>
                                    {product.deliveryTime} MINS
                                </Text>
                            </View>
                        )
                    }
                </View >

                {/* Product Info Section */}
                < View style={styles.infoSection} >
                    {/* Title */}
                    < Text style={styles.productTitle} > {product.name}</Text >

                    {/* Rating & Reviews */}
                    {
                        product.rating && (
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
                        )
                    }

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
                    {
                        detailsExpanded && (
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
                        )
                    }

                    {/* Bottom Spacer for sticky bar */}
                    <View style={styles.bottomSpacer} />
                </View >
            </Animated.ScrollView >

            {/* Sticky Bottom Bar */}
            < View style={[styles.stickyBar, { paddingBottom: verticalScale(12) + insets.bottom }]} >
                <View style={styles.stickyBarLeft}>
                    <Text style={styles.stickyVariant}>{selectedVariant}</Text>
                    <Text style={styles.stickyPrice}>₹{product.price}</Text>
                    <Text style={styles.stickyTaxText}>Inclusive of all taxes</Text>
                </View>

                {/* ADD Button or Quantity Controls */}
                {
                    cartQuantity > 0 ? (
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleAddToCart(-1)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.quantityButtonText}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{cartQuantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleAddToCart(1)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={() => handleAddToCart(1)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.addToCartText}>ADD</Text>
                        </TouchableOpacity>
                    )
                }
            </View >

            {/* Cart Bubble - Shows when cart has items */}
            {totalItems > 0 && <CartBubble />}

            {/* Image Lightbox */}
            <ImageLightbox
                visible={lightboxVisible}
                images={productImages}
                initialIndex={currentImageIndex}
                onClose={() => setLightboxVisible(false)}
            />
        </View >
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
        paddingTop: verticalScale(16),
        paddingBottom: verticalScale(16),
    },
    productTitle: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: verticalScale(8),
        lineHeight: moderateScale(20),
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
        fontSize: moderateScale(11),
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
        fontSize: moderateScale(18),
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
        fontSize: moderateScale(20),
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
        fontSize: moderateScale(12),
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
        flex: 0,
        marginRight: scale(12),
    },
    stickyVariant: {
        fontSize: SIZES.FONT_MD,
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
    },
    stickyPrice: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY,
    },
    stickyTaxText: {
        fontSize: SIZES.FONT_XS,
        color: COLORS.TEXT_SECONDARY,
    },
    addToCartButton: {
        borderWidth: 1.5,
        borderColor: COLORS.PRIMARY,
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: scale(24),
        paddingVertical: verticalScale(10),
        borderRadius: scale(8),
        width: scale(120),
        alignItems: 'center',
        flexShrink: 0,
    },
    addToCartText: {
        color: COLORS.PRIMARY,
        fontSize: SIZES.FONT_LG,
        fontWeight: '700',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.PRIMARY,
        borderRadius: scale(8),
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(6),
        width: scale(120),
        flexShrink: 0,
    },
    quantityButton: {
        width: scale(32),
        height: scale(32),
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: moderateScale(18),
        fontWeight: '600',
        color: COLORS.WHITE,
    },
    quantityText: {
        flex: 1,
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: COLORS.WHITE,
        textAlign: 'center',
        minWidth: scale(30),
    },
    animatedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(60), // Space for back button and other side
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
        overflow: 'hidden',
    },
    blurContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    headerBackgroundImage: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.3,
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    headerTitleText: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY,
        flex: 1,
        textAlign: 'center',
    },
    // Background image that extends behind status bar
    backgroundImageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: verticalScale(300),
        zIndex: 1,
    },
    fullBackgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backgroundOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: verticalScale(100),
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        zIndex: 2,
    },
    // Back button
    backButton: {
        position: 'absolute',
        left: scale(16),
        zIndex: 10,
    },
    backButtonTouchable: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.1,
        shadowRadius: scale(4),
        elevation: 3,
    },
});

export default ProductDetailScreen;
