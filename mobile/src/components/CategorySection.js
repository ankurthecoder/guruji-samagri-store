import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import ProductCard from './ProductCard';

const CategorySection = ({
    title,
    subtitle,
    products,
    categoryName,
    onSeeAll,
    onAddToCart,
    onToggleWishlist,
}) => {
    return (
        <View style={styles.section}>
            {/* Section Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && (
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    )}
                </View>
            </View>

            {/* Horizontal Product Scroll */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                        onToggleWishlist={onToggleWishlist}
                    />
                ))}
            </ScrollView>

            {/* See All Button */}
            {categoryName && (
                <TouchableOpacity
                    style={styles.seeAllButton}
                    onPress={() => onSeeAll?.(categoryName)}>
                    <Text style={styles.seeAllText}>
                        See all {categoryName}
                    </Text>
                    <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: SIZES.PADDING_XL,
    },
    header: {
        paddingHorizontal: SIZES.PADDING_LG,
        marginBottom: SIZES.PADDING_MD,
    },
    title: {
        fontSize: SIZES.FONT_XL,
        fontWeight: 'bold',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: SIZES.FONT_SM,
        color: COLORS.TEXT_SECONDARY,
        fontWeight: '500',
    },
    scrollContent: {
        paddingHorizontal: SIZES.PADDING_LG,
        paddingBottom: SIZES.PADDING_SM,
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#E8F5E9',
        marginHorizontal: SIZES.PADDING_LG,
        marginTop: SIZES.PADDING_SM,
        paddingVertical: SIZES.PADDING_MD,
        paddingHorizontal: SIZES.PADDING_LG,
        borderRadius: SIZES.RADIUS_MD,
    },
    seeAllText: {
        fontSize: SIZES.FONT_MD,
        fontWeight: '600',
        color: '#2E7D32',
    },
    arrow: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2E7D32',
    },
});

export default CategorySection;
