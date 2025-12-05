import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import { COLORS, SIZES } from '../constants/colors';
import CategoryCard from '../components/CategoryCard';
import AppHeader from '../components/AppHeader';
import CATEGORIES from '../data/mockCategories';

const CategoriesScreen = ({ navigation }) => {
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
                />
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {renderCategorySection('Grocery & Kitchen', groceryKitchen)}
                {renderCategorySection('Snacks & Drinks', snacksDrinks)}
            </ScrollView>
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
        paddingTop: verticalScale(130),
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

