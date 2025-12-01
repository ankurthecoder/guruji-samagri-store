import React, { useState, useRef } from 'react';
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
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import useUIStore from '../stores/uiStore';

import ProductAdvertiser from '../components/ProductAdvertiser';

const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [wishlistedItems, setWishlistedItems] = useState({});
    const setTabBarVisible = useUIStore(state => state.setTabBarVisible);
    const lastContentOffset = useRef(0);
    const isTabBarVisible = useRef(true);

    // Mock Data for Advertiser
    const AD_DATA = [
        {
            id: '1',
            title: 'Cheese Mania',
            subtitle: 'Explore a wide range of cheese and breads',
            poweredBy: 'Dlecta',
            backgroundColor: '#FFD54F', // Light Amber
            buttonText: 'Shop now',
            productImage: 'https://png.pngtree.com/png-clipart/20230427/original/pngtree-cheese-food-png-image_9113674.png', // Placeholder cheese
        },
        {
            id: '2',
            title: 'Healthy Breakfast',
            subtitle: 'Start your day with organic honey & oats',
            poweredBy: 'Dabur',
            backgroundColor: '#A5D6A7', // Light Green
            buttonText: 'Explore',
            productImage: 'https://png.pngtree.com/png-clipart/20231124/original/pngtree-honey-jar-with-dipper-isolated-on-transparent-background-png-image_13709325.png', // Placeholder honey
        },
        {
            id: '3',
            title: 'Puja Essentials',
            subtitle: 'Premium samagri for your daily rituals',
            poweredBy: 'Guruji',
            backgroundColor: '#FFCC80', // Light Orange
            buttonText: 'Order now',
            productImage: 'https://png.pngtree.com/png-clipart/20230928/original/pngtree-diya-lamp-oil-lamp-png-image_13009589.png', // Placeholder diya
        },
    ];

    const user = useAuthStore(state => state.user);
    const cartItems = useCartStore(state => state.items);
    const addItem = useCartStore(state => state.addItem);
    const updateQuantity = useCartStore(state => state.updateQuantity);
    const totalItems = useCartStore(state => state.totalItems);
    const totalAmount = useCartStore(state => state.totalAmount);

    const handleScroll = (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const diff = currentOffset - lastContentOffset.current;

        // Ignore small scrolls (bounce effect)
        if (Math.abs(diff) < 3) return;

        if (diff > 0 && isTabBarVisible.current && currentOffset > 50) {
            // Scrolling down & tab bar is visible -> Hide it
            setTabBarVisible(false);
            isTabBarVisible.current = false;
        } else if (diff < 0 && !isTabBarVisible.current) {
            // Scrolling up & tab bar is hidden -> Show it
            setTabBarVisible(true);
            isTabBarVisible.current = true;
        }

        lastContentOffset.current = currentOffset;
    };

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
            <AppHeader
                title="Guruji Samagri Store"
                showSearch={true}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={handleSearch}
                onSearchPress={() => navigation.navigate('Search')}
            />

            {/* Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onScroll={handleScroll}
                scrollEventThrottle={16}>

                {/* Product Advertiser Carousel */}
                <ProductAdvertiser ads={AD_DATA} />

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

                {/* Footer */}
                <AppFooter />

                {/* Bottom Spacing for Sticky Bar */}
                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* View Cart Bar - Shows when cart has items */}
            {totalItems > 0 && (
                <CartBubble />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
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
