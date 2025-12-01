import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';

const { width } = Dimensions.get('window');
// 4 columns with padding
const CARD_WIDTH = (width - SIZES.PADDING_XL * 2 - SIZES.PADDING_SM * 3) / 4;

const CategoryCard = ({ category, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: '#F5F7FA' }]} // Blinkit uses uniform light background usually, or we can keep pastel
            onPress={() => onPress(category)}
            activeOpacity={0.7}
        >
            <View style={styles.imageContainer}>
                <Text style={styles.emoji}>{category.icon || category.emoji || '📦'}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.categoryName} numberOfLines={2}>
                    {category.name}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: 100, // Fixed height for uniformity
        borderRadius: SIZES.RADIUS_MD,
        overflow: 'hidden',
        marginBottom: SIZES.PADDING_MD,
        // Removed shadow for flatter look typical of category grids
        backgroundColor: '#F5F7FA',
        alignItems: 'center',
    },
    imageContainer: {
        height: 60,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    emoji: {
        fontSize: 32,
    },
    infoContainer: {
        paddingHorizontal: 4,
        paddingBottom: 8,
        alignItems: 'center',
        width: '100%',
    },
    categoryName: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
        textAlign: 'center',
        lineHeight: 14,
    },
});

export default CategoryCard;
