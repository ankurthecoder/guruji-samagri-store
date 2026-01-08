import React, { useState, useLayoutEffect, useRef } from 'react';
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
    Animated,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LinearGradient from 'react-native-linear-gradient';

import { COLORS, SIZES } from '../constants/colors';
import AccordionSection from '../components/AccordionSection';
import ImageLightbox from '../components/ImageLightbox';
import useCartStore from '../stores/cartStore';
import CartBubble from '../components/ViewCart';

const { width } = Dimensions.get('window');
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const IMAGE_HEIGHT = verticalScale(320);

const ProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params || {};
    const insets = useSafeAreaInsets();

    if (!product) {
        return (
            <View style={styles.center}>
                <Text>No product data</Text>
            </View>
        );
    }

    const HEADER_TOP =
        Platform.OS === 'android'
            ? StatusBar.currentHeight || 0
            : insets.top;

    const scrollY = useRef(new Animated.Value(0)).current;

    /* ---------------- ANIMATIONS ---------------- */

    const headerBgOpacity = scrollY.interpolate({
        inputRange: [50, 150],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const headerTitleOpacity = scrollY.interpolate({
        inputRange: [80, 180],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const topOverlayOpacity = scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const backIconColor = scrollY.interpolate({
        inputRange: [50, 150],
        outputRange: ['#FFFFFF', COLORS.TEXT_PRIMARY],
        extrapolate: 'clamp',
    });

    const backButtonBgOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const isHeaderWhite = useRef(false);
    const [statusBarStyle, setStatusBarStyle] = useState('light-content');

    scrollY.addListener(({ value }) => {
        const isWhite = value > 100;
        if (isWhite !== isHeaderWhite.current) {
            isHeaderWhite.current = isWhite;
            setStatusBarStyle(isWhite ? 'dark-content' : 'light-content');
        }
    });

    /* ---------------- STATE ---------------- */

    const [lightboxVisible, setLightboxVisible] = useState(false);
    const [detailsExpanded, setDetailsExpanded] = useState(false);

    /* ---------------- CART ---------------- */

    const cartItems = useCartStore(state => state.items);
    const addItem = useCartStore(state => state.addItem);
    const updateQuantity = useCartStore(state => state.updateQuantity);
    const totalItems = useCartStore(state => state.totalItems);

    const cartItem = cartItems.find(i => i?._id === product.id);
    const cartQuantity = cartItem ? cartItem.quantity : 0;

    /* ---------------- NAV ---------------- */

    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            tabBarStyle: { display: 'none' },
        });

        return () => {
            navigation.getParent()?.setOptions({
                tabBarStyle: { display: 'flex', height: 60 },
            });
        };
    }, [navigation]);

    /* ---------------- DATA ---------------- */

    const productImages = [
        product.image || 'https://picsum.photos/400/400',
        'https://picsum.photos/400/400?2',
        'https://picsum.photos/400/400?3',
    ];

    /* ---------------- RENDER ---------------- */

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={statusBarStyle}
            />

            {/* TOP OVERLAY (to make white icons visible on light images) */}
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.topOverlay,
                    {
                        height: HEADER_TOP + 80,
                        opacity: topOverlayOpacity,
                    },
                ]}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.1)', 'transparent']}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>


            {/* HEADER */}
            <Animated.View
                style={[
                    styles.animatedHeader,
                    {
                        paddingTop: HEADER_TOP,
                        height: HEADER_TOP + 56,
                        opacity: headerBgOpacity,
                    },
                ]}
            >
                <Animated.Text
                    style={[styles.headerTitleText, { opacity: headerTitleOpacity }]}
                    numberOfLines={1}
                >
                    {product.name}
                </Animated.Text>
            </Animated.View>

            {/* BACK BUTTON */}
            <View style={[styles.backButton, { top: HEADER_TOP + 8 }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButtonTouchable}
                >
                    <Animated.View
                        style={[
                            styles.backButtonBg,
                            { opacity: backButtonBgOpacity },
                        ]}
                    />
                    <AnimatedIcon
                        name="arrow-back"
                        size={24}
                        color={backIconColor}
                    />
                </TouchableOpacity>
            </View>

            {/* SCROLL CONTENT */}
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                contentContainerStyle={{ paddingBottom: verticalScale(140) }}
            >
                {/* IMAGE CAROUSEL */}
                <View style={{ height: IMAGE_HEIGHT }}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                    >
                        {productImages.map((img, i) => (
                            <TouchableOpacity
                                key={i}
                                activeOpacity={0.9}
                                onPress={() => setLightboxVisible(true)}
                            >
                                <Image
                                    source={{ uri: img }}
                                    style={styles.productImage}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* PRODUCT INFO */}
                <View style={styles.infoSection}>
                    <Text style={styles.productTitle}>{product.name}</Text>
                    <Text style={styles.price}>₹{product.price}</Text>

                    <TouchableOpacity
                        style={styles.detailsToggle}
                        onPress={() => setDetailsExpanded(!detailsExpanded)}
                    >
                        <Text style={styles.detailsToggleText}>
                            View product details
                        </Text>
                        <Text>{detailsExpanded ? '▲' : '▼'}</Text>
                    </TouchableOpacity>

                    {detailsExpanded && (
                        <AccordionSection title="Details">
                            <Text style={styles.dummyText}>
                                This is a high-quality product sourced from the finest materials.
                                Perfect for your daily needs and spiritual practices.
                                Our Samagri is hand-picked and checked for purity to ensure
                                you get the best experience possible.
                            </Text>
                        </AccordionSection>
                    )}

                    <View style={styles.divider} />

                    <AccordionSection title="Manufacturer Details">
                        <Text style={styles.dummyText}>
                            Guruji Samagri Store Pvt. Ltd.{"\n"}
                            123 Spiritual Lane, Divine City, India.{"\n"}
                            Customer Care: 1800-GURUJI
                        </Text>
                    </AccordionSection>

                    <AccordionSection title="Return Policy">
                        <Text style={styles.dummyText}>
                            Returns are accepted within 7 days of delivery for unopened items.
                            Please contact support for more details.
                        </Text>
                    </AccordionSection>

                    <AccordionSection title="Storage Instructions">
                        <Text style={styles.dummyText}>
                            Store in a cool, dry place away from direct sunlight.
                            Keep the container airtight after opening.
                        </Text>
                    </AccordionSection>

                    <AccordionSection title="Important Information">
                        <Text style={styles.dummyText}>
                            - Keep out of reach of children.{"\n"}
                            - Not for medicinal use.{"\n"}
                            - Purely for religious/traditional purposes.{"\n"}
                            - Always use under adult supervision during diya lighting.
                        </Text>
                    </AccordionSection>
                </View>
            </Animated.ScrollView>

            {/* STICKY BAR */}
            <View style={[styles.stickyBar, { paddingBottom: insets.bottom + 12 }]}>
                <Text style={styles.stickyPrice}>₹{product.price}</Text>

                {cartQuantity > 0 ? (
                    <View style={styles.quantityControls}>
                        <TouchableOpacity
                            onPress={() =>
                                updateQuantity(product.id, cartQuantity - 1)
                            }
                        >
                            <Text style={styles.quantityButtonText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{cartQuantity}</Text>
                        <TouchableOpacity onPress={() => addItem(product, 1)}>
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={() => addItem(product, 1)}
                    >
                        <Text style={styles.addToCartText}>ADD</Text>
                    </TouchableOpacity>
                )}
            </View>

            {totalItems > 0 && <CartBubble />}

            <ImageLightbox
                visible={lightboxVisible}
                images={productImages}
                onClose={() => setLightboxVisible(false)}
            />
        </View>
    );
};

export default ProductDetailScreen;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.WHITE },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },


    topOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5,
    },

    animatedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    headerTitleText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY,
        paddingHorizontal: scale(50), // Prevent overlapping with back button
    },

    backButton: {
        position: 'absolute',
        left: 16,
        zIndex: 20,
    },
    backButtonTouchable: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    },

    productImage: {
        width,
        height: IMAGE_HEIGHT,
    },

    infoSection: {
        padding: 16,
        backgroundColor: COLORS.WHITE,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },

    detailsToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    detailsToggleText: {
        fontSize: 14,
        color: COLORS.PRIMARY,
        fontWeight: '600',
    },

    stickyBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.WHITE,
        borderTopWidth: 1,
        borderTopColor: COLORS.BORDER,
    },
    stickyPrice: {
        fontSize: 16,
        fontWeight: '700',
    },
    addToCartButton: {
        borderWidth: 1,
        borderColor: COLORS.PRIMARY,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
    },
    addToCartText: {
        color: COLORS.PRIMARY,
        fontWeight: '700',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.PRIMARY,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    quantityButtonText: {
        color: COLORS.WHITE,
        fontSize: 18,
        paddingHorizontal: 10,
    },
    quantityText: {
        color: COLORS.WHITE,
        fontWeight: '700',
    },
    dummyText: {
        fontSize: 14,
        color: COLORS.TEXT_SECONDARY,
        lineHeight: 20,
        paddingBottom: 8,
    },
    divider: {
        height: 8,
        backgroundColor: COLORS.LIGHT_GRAY,
        marginHorizontal: -16,
        marginVertical: 12,
    },
});
