import React, { useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale } from 'react-native-size-matters';
import { COLORS, SIZES } from '../constants/colors';
import CategoryCard from '../components/CategoryCard';
import AppHeader from '../components/AppHeader';
import CATEGORIES from '../data/mockCategories';
import useUIStore from '../stores/uiStore';

const CategoriesScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const setTabBarVisible = useUIStore(state => state.setTabBarVisible);
    const lastContentOffset = useRef(0);
    const isTabBarVisible = useRef(true);

    // Calculate dynamic header height (same as HomeScreen and AppHeader)
    const BASE_HEADER_HEIGHT = verticalScale(125);
    const HEADER_MAX_HEIGHT = BASE_HEADER_HEIGHT + insets.top;

    const scrollY = useRef(new Animated.Value(0)).current;

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            useNativeDriver: false,
            listener: (event) => {
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
            }
        }
    );

    const handleCategoryPress = (category) => {
        navigation.navigate('CategoryProducts', { category });
    };

    const renderCategorySection = (sectionTitle, categories) => (
        <View style={styles.section} key={sectionTitle}>
            <Text style={styles.sectionTitle}>{sectionTitle}</Text>
            <View style={styles.grid}>
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        onPress={handleCategoryPress}
                    />
                ))}
            </View>
        </View>
    );

    // Split categories into sections
    const groceryKitchen = CATEGORIES.filter(cat =>
        ['grocery-kitchen', 'puja-essentials', 'home-cleaning'].includes(cat.id)
    );

    const snacksDrinks = CATEGORIES.filter(cat =>
        ['snacks-drinks', 'personal-care', 'health-wellness'].includes(cat.id)
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <AppHeader
                    title="Categories"
                    showSearch={true}
                    scrollY={scrollY}
                />
            </View>

            {/* Content */}
            <Animated.ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: HEADER_MAX_HEIGHT }
                ]}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {renderCategorySection('Grocery & Kitchen', groceryKitchen)}
                {renderCategorySection('Snacks & Drinks', snacksDrinks)}
                {renderCategorySection('Snacks & Drinks', snacksDrinks)}
                {renderCategorySection('Snacks & Drinks', snacksDrinks)}
                {renderCategorySection('Snacks & Drinks', snacksDrinks)}
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    headerContainer: {
        zIndex: 10,
        elevation: 10,
        backgroundColor: COLORS.WHITE,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: SIZES.PADDING_XL,
        paddingBottom: 100,
    },
    section: {
        marginBottom: SIZES.PADDING_XL,
    },
    sectionTitle: {
        fontSize: SIZES.FONT_LG,
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: SIZES.PADDING_MD,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: SIZES.PADDING_SM,
    },
});

export default CategoriesScreen;

