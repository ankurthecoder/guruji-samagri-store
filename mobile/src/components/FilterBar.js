import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../constants/colors';

const FilterBar = ({ onFilterPress, onSortPress, onBrandPress, onDietPress }) => {
    const FilterButton = ({ icon, label, onPress }) => (
        <TouchableOpacity
            style={styles.filterButton}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons name={icon} size={16} color={COLORS.TEXT_PRIMARY} />
            <Text style={styles.filterText}>{label}</Text>
            <Ionicons name="chevron-down" size={14} color={COLORS.TEXT_SECONDARY} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <FilterButton
                    icon="options-outline"
                    label="Filters"
                    onPress={onFilterPress}
                />
                <FilterButton
                    icon="swap-vertical-outline"
                    label="Sort"
                    onPress={onSortPress}
                />
                <FilterButton
                    icon="pricetag-outline"
                    label="Brand"
                    onPress={onBrandPress}
                />
                <FilterButton
                    icon="nutrition-outline"
                    label="Diet Preference"
                    onPress={onDietPress}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingVertical: SIZES.PADDING_SM,
    },
    scrollContent: {
        paddingHorizontal: SIZES.PADDING_MD,
        gap: SIZES.PADDING_SM,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SIZES.PADDING_MD,
        paddingVertical: SIZES.PADDING_SM,
        backgroundColor: '#F8F8F8',
        borderRadius: SIZES.RADIUS_MD,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        gap: 6,
    },
    filterText: {
        fontSize: SIZES.FONT_SM,
        fontWeight: '500',
        color: COLORS.TEXT_PRIMARY,
    },
});

export default FilterBar;
