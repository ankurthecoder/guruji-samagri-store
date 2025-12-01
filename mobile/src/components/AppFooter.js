import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';

const AppFooter = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                The place that fits all{'\n'}your needs
            </Text>
            <View style={styles.craftedContainer}>
                <Text style={styles.craftedText}>
                    Crafted with love from{' '}
                    <Text style={styles.brandText}>Guruji Samagri Store</Text>
                    {' '}❤️
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F7FA',
        paddingHorizontal: SIZES.PADDING_XL,
        paddingVertical: SIZES.PADDING_XXL * 2,
        alignItems: 'flex-start',
        marginTop: SIZES.PADDING_XL,
    },
    heading: {
        fontSize: 32,
        fontWeight: '700',
        color: '#9BA4B5',
        lineHeight: 42,
        marginBottom: SIZES.PADDING_XL,
    },
    craftedContainer: {
        marginTop: SIZES.PADDING_MD,
    },
    craftedText: {
        fontSize: SIZES.FONT_MD,
        color: '#7A8199',
        fontWeight: '500',
    },
    brandText: {
        color: COLORS.PRIMARY,
        fontWeight: '700',
    },
});

export default AppFooter;
