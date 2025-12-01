import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    Animated,
    Easing,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../constants/colors';
import FilterBar from '../components/FilterBar';
import ProductCard from '../components/ProductCard';
import SkeletonProductCard from '../components/SkeletonProductCard';
import ProductVariantModal from '../components/ProductVariantModal';
import mockProducts from '../data/mockProducts';
import { getProductsByCategory } from '../data/mockCategories';
import useCartStore from '../stores/cartStore';
import CartBubble from '../components/ViewCart';

const SubcategoryItem = ({ subcategory, isSelected, onPress, onLayout }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(scaleAnim, {
            toValue: isSelected ? 1.1 : 1,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    }, [isSelected]);

    return (
        <TouchableOpacity
            onLayout={onLayout}
            style={[
                styles.subcategoryItem,
                isSelected && styles.subcategoryItemActive,
            ]}
            onPress={() => onPress(subcategory)}
            activeOpacity={0.7}
        >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <View style={styles.subcategoryIconContainer}>
                    <Text style={styles.subcategoryEmoji}>{subcategory.emoji}</Text>
                </View>
            </Animated.View>
            <Text
                style={[
                    styles.subcategoryText,
                    isSelected && styles.subcategoryTextActive,
                ]}
                numberOfLines={2}
            >
                {subcategory.name}
            </Text>
        </TouchableOpacity>
    );
};

const CategoryProductsScreen = ({ route, navigation }) => {
    const { category } = route.params;
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [wishlistedItems, setWishlistedItems] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [variantModalVisible, setVariantModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Animation state
    const indicatorAnim = useRef(new Animated.Value(0)).current;
    const [layoutMap, setLayoutMap] = useState({});
    const [isFirstLayout, setIsFirstLayout] = useState(true);

    const cartItems = useCartStore(state => state.items);
    const addItem = useCartStore(state => state.addItem);
    const updateQuantity = useCartStore(state => state.updateQuantity);
    const totalItems = useCartStore(state => state.totalItems);

    // Get products for this category
    const categoryProducts = getProductsByCategory(category.id, mockProducts);

    // If no products found, show all products from first subcategory
    const displayProducts = categoryProducts.length > 0
        ? categoryProducts
        : Object.values(mockProducts).flat().slice(0, 10);

    const handleSubcategoryPress = (subcategory) => {
        if (selectedSubcategory?.id === subcategory.id) return;

        setSelectedSubcategory(subcategory);
        setIsLoading(true);

        // Simulate loading delay
        setTimeout(() => {
            setIsLoading(false);
        }, 800);

        // Animate highlighter
        const layout = layoutMap[subcategory.id];
        if (layout) {
            Animated.spring(indicatorAnim, {
                toValue: layout.y,
                useNativeDriver: true,
                damping: 15,
                stiffness: 100,
            }).start();
        }
    };

    // Initialize selection and loading
    useEffect(() => {
        if (category.subcategories?.length > 0 && !selectedSubcategory) {
            // Don't set immediately to allow layout to happen first
            // But we need a default selection
            // We'll handle the initial animation in onLayout
        }
        // Initial loading simulation
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleLayout = (id, event) => {
        const { y, height } = event.nativeEvent.layout;
        setLayoutMap(prev => {
            const newMap = { ...prev, [id]: { y, height } };

            // If this is the first item and we haven't selected anything, select it
            if (isFirstLayout && category.subcategories[0].id === id) {
                setSelectedSubcategory(category.subcategories[0]);
                indicatorAnim.setValue(y); // Set initial position without animation
                setIsFirstLayout(false);
            }
            return newMap;
        });
    };

    const handleAddToCart = (product, quantityChange = 1) => {
        const cartItem = cartItems.find(item => item.product._id === product.id);
        const currentQuantity = cartItem ? cartItem.quantity : 0;
        const newQuantity = currentQuantity + quantityChange;

        if (newQuantity <= 0) {
            updateQuantity(product.id, 0);
        } else if (currentQuantity === 0) {
            addItem({
                _id: product.id,
                name: product.name,
                price: product.price,
                category: product.category,
            }, quantityChange);
        } else {
            updateQuantity(product.id, newQuantity);
        }
    };

    const handleToggleWishlist = (product) => {
        setWishlistedItems(prev => ({
            ...prev,
            [product.id]: !prev[product.id],
        }));
    };

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

    const handleFilterPress = () => {
        Alert.alert('Filters', 'Filter options coming soon');
    };

    const handleSortPress = () => {
        Alert.alert('Sort', 'Sort options coming soon');
    };

    const handleBrandPress = () => {
        Alert.alert('Brand', 'Brand filter coming soon');
    };

    const handleDietPress = () => {
        Alert.alert('Diet Preference', 'Diet preference filter coming soon');
    };

    const handleOpenVariantModal = (product) => {
        setSelectedProduct(product);
        setVariantModalVisible(true);
    };

    const handleCloseVariantModal = () => {
        setVariantModalVisible(false);
        setSelectedProduct(null);
    };

    const handleAddVariant = (variantProduct) => {
        handleAddToCart(variantProduct, 1);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.WHITE} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {category.name}
                </Text>
                <View style={styles.headerRight} />
            </View>

            {/* Filter Bar */}
            <FilterBar
                onFilterPress={handleFilterPress}
                onSortPress={handleSortPress}
                onBrandPress={handleBrandPress}
                onDietPress={handleDietPress}
            />

            {/* Content */}
            <View style={styles.content}>
                {/* Left Sidebar - Subcategories */}
                <View style={styles.sidebarContainer}>
                    <ScrollView
                        style={styles.sidebar}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.sidebarContent}
                    >
                        {/* Animated Highlighter */}
                        {selectedSubcategory && layoutMap[selectedSubcategory.id] && (
                            <Animated.View
                                style={[
                                    styles.highlighter,
                                    {
                                        transform: [{ translateY: indicatorAnim }],
                                        height: layoutMap[selectedSubcategory.id].height,
                                    },
                                ]}
                            />
                        )}

                        {category.subcategories?.map((subcategory) => (
                            <SubcategoryItem
                                key={subcategory.id}
                                subcategory={subcategory}
                                isSelected={selectedSubcategory?.id === subcategory.id}
                                onPress={handleSubcategoryPress}
                                onLayout={(e) => handleLayout(subcategory.id, e)}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Product Grid */}
                <View style={styles.productListContainer}>
                    <ScrollView
                        style={styles.productList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.productListContent}
                    >
                        <View style={styles.productGrid}>
                            {isLoading ? (
                                // Render Skeletons
                                Array.from({ length: 6 }).map((_, index) => (
                                    <View key={`skeleton-${index}`} style={styles.productCardWrapper}>
                                        <SkeletonProductCard />
                                    </View>
                                ))
                            ) : (
                                // Render Products
                                enrichProducts(displayProducts).map((product) => (
                                    <View key={product.id} style={styles.productCardWrapper}>
                                        <ProductCard
                                            product={product}
                                            onAddToCart={handleAddToCart}
                                            onToggleWishlist={handleToggleWishlist}
                                            onOpenVariantModal={handleOpenVariantModal}
                                        />
                                    </View>
                                ))
                            )}
                        </View>
                    </ScrollView>
                </View>
            </View>

            {/* Product Variant Modal */}
            <ProductVariantModal
                visible={variantModalVisible}
                onClose={handleCloseVariantModal}
                product={selectedProduct}
                onAddVariant={handleAddVariant}
            />

            {/* View Cart Bar */}
            {totalItems > 0 && <CartBubble />}
        </SafeAreaView>
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
        justifyContent: 'space-between',
        backgroundColor: COLORS.PRIMARY,
        paddingHorizontal: SIZES.PADDING_MD,
        paddingVertical: SIZES.PADDING_MD,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: SIZES.FONT_LG,
        fontWeight: '700',
        color: COLORS.WHITE,
        textAlign: 'center',
        marginHorizontal: SIZES.PADDING_SM,
    },
    headerRight: {
        width: 40,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebarContainer: {
        width: 80,
        backgroundColor: '#F0F2F5',
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0',
    },
    sidebar: {
        flex: 1,
    },
    sidebarContent: {
        paddingBottom: 100,
        position: 'relative', // Needed for absolute positioning of highlighter
    },
    highlighter: {
        position: 'absolute',
        right: 0,
        width: 4,
        backgroundColor: COLORS.PRIMARY,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        zIndex: 10,
    },
    subcategoryItem: {
        paddingVertical: 12,
        paddingHorizontal: 4,
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        // Removed borderRightWidth/Color as it's handled by highlighter now
    },
    subcategoryItemActive: {
        backgroundColor: '#FFFFFF',
    },
    subcategoryIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    subcategoryEmoji: {
        fontSize: 20,
    },
    subcategoryText: {
        fontSize: 10,
        color: COLORS.TEXT_SECONDARY,
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 12,
    },
    subcategoryTextActive: {
        color: COLORS.PRIMARY,
        fontWeight: '700',
    },
    productListContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    productList: {
        flex: 1,
    },
    productListContent: {
        padding: SIZES.PADDING_SM,
        paddingBottom: 100,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productCardWrapper: {
        width: '48%',
        marginBottom: SIZES.PADDING_MD,
    },
});

export default CategoryProductsScreen;
