import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import CategorySection from '../components/CategorySection';
import mockProducts from '../data/mockProducts';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import CartBubble from '../components/ViewCart';
import AnimatedSearchBar from '../components/AnimatedSearchBar';

const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [wishlistedItems, setWishlistedItems] = useState({});

    const user = useAuthStore(state => state.user);
    const cartItems = useCartStore(state => state.items);
    const addItem = useCartStore(state => state.addItem);
    const updateQuantity = useCartStore(state => state.updateQuantity);
    const totalItems = useCartStore(state => state.totalItems);
    const totalAmount = useCartStore(state => state.totalAmount);

    const handleSearch = () => {
        // TODO: Implement search functionality
        if (searchQuery.trim()) {
            Alert.alert('Search', `Searching for: ${searchQuery}`);
        }
    };

    const handleAddToCart = (product, quantityChange = 1) => {
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

    const handleToggleWishlist = (product) => {
        setWishlistedItems(prev => ({
            ...prev,
            [product.id]: !prev[product.id],
        }));
    };

    const handleSeeAll = (categoryName) => {
        // TODO: Navigate to category screen
        Alert.alert('Category', `See all ${categoryName}`);
    };

    const handleViewCart = () => {
        // TODO: Navigate to cart screen
        Alert.alert('View Cart', `${totalItems} items - ₹${totalAmount}`);
    };

    // Add wishlist status and cart quantity to products
    const enrichProducts = (products) => {
        return products.map(product => {
            const cartItem = cartItems.find(item => item.product._id === product.id);
            return {
                ...product,
                isWishlisted: wishlistedItems[product.id] || false,
                quantity: cartItem ? cartItem.quantity : 0,
            };
        });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerTitle}>Guruji Samagri Store</Text>
                        <Text style={styles.headerSubtitle}>Hi, {user?.name || 'Test User'}!</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => Alert.alert('Cart', 'Cart feature coming soon')}>
                        <Text style={styles.cartIcon}>🛒</Text>
                        {totalItems > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{totalItems}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <AnimatedSearchBar
                    rotatingTexts={[
                        'puja samagri',
                        'bracelets',
                        'pendants',
                        'organic honey',
                        'incense sticks',
                        'rudraksha mala',
                    ]}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmit={handleSearch}
                    rotationInterval={2000}
                />
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Glow up starts right here - Sunscreen */}
                <CategorySection
                    title="Glow up starts right here"
                    subtitle="Sponsored"
                    products={enrichProducts(mockProducts.sunscreen)}
                    categoryName="Sunscreen"
                    onSeeAll={handleSeeAll}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                />

                {/* Relax and breathe easy - Masks & Air Purifiers */}
                <CategorySection
                    title="Relax and breathe easy"
                    subtitle=">300 AQI in your area"
                    products={enrichProducts([
                        ...mockProducts.masks,
                        ...mockProducts.airPurifiers,
                    ])}
                    categoryName="Air Quality"
                    onSeeAll={handleSeeAll}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                />

                {/* Sweet and healthy - Honey */}
                <CategorySection
                    title="Sweet and healthy"
                    subtitle="Pure & Natural"
                    products={enrichProducts(mockProducts.honey)}
                    categoryName="Honey"
                    onSeeAll={handleSeeAll}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                />

                {/* Tea time essentials - Tea */}
                <CategorySection
                    title="Tea time essentials"
                    subtitle="Premium blends"
                    products={enrichProducts(mockProducts.tea)}
                    categoryName="Green Tea"
                    onSeeAll={handleSeeAll}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                />

                {/* Fresh & Radiant - Face Wash */}
                <CategorySection
                    title="Fresh & Radiant"
                    subtitle="Daily skincare"
                    products={enrichProducts(mockProducts.faceWash)}
                    categoryName="Face Wash"
                    onSeeAll={handleSeeAll}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                />

                {/* Bottom Spacing for Sticky Bar */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* View Cart Bar - Shows when cart has items */}
            {/* {totalItems > 0 && (
                <CartBubble />
            )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    header: {
        backgroundColor: COLORS.PRIMARY,
        paddingHorizontal: SIZES.PADDING_LG,
        paddingTop: SIZES.PADDING_XXL,
        paddingBottom: SIZES.PADDING_LG,
        borderBottomLeftRadius: SIZES.RADIUS_LG,
        borderBottomRightRadius: SIZES.RADIUS_LG,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.PADDING_MD,
    },
    headerTitle: {
        fontSize: SIZES.FONT_XL,
        fontWeight: 'bold',
        color: COLORS.WHITE,
    },
    headerSubtitle: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.WHITE,
        opacity: 0.9,
    },
    cartButton: {
        position: 'relative',
    },
    cartIcon: {
        fontSize: 28,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: COLORS.ACCENT,
        borderRadius: SIZES.RADIUS_ROUND,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: COLORS.TEXT_PRIMARY,
        fontSize: SIZES.FONT_XS,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: SIZES.PADDING_LG,
        paddingBottom: 80, // Space for sticky bar
    },
    bottomSpacer: {
        height: 20,
    },
    viewCartBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#2E7D32',
        paddingHorizontal: SIZES.PADDING_LG,
        paddingVertical: SIZES.PADDING_MD + 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 8,
    },
    viewCartContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: SIZES.PADDING_MD,
    },
    cartEmoji: {
        fontSize: 24,
        marginRight: 6,
    },
    productIcons: {
        fontSize: 18,
    },
    cartTextContainer: {
        flex: 1,
    },
    viewCartText: {
        fontSize: SIZES.FONT_MD,
        fontWeight: '600',
        color: COLORS.WHITE,
    },
    cartItemCount: {
        fontSize: SIZES.FONT_SM,
        color: COLORS.WHITE,
        opacity: 0.9,
    },
    viewCartArrow: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.WHITE,
    },
});

export default HomeScreen;
