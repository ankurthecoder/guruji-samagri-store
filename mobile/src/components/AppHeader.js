import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';
import AnimatedSearchBar from './AnimatedSearchBar';
import useAuthStore from '../stores/authStore';
import useCartStore from '../stores/cartStore';

const AppHeader = ({
    title = 'Guruji Samagri Store',
    showSearch = true,
    onSearchPress,
    searchQuery = '',
    onSearchChange,
    onSearchSubmit,
}) => {
    const user = useAuthStore(state => state.user);
    const totalItems = useCartStore(state => state.totalItems);

    return (
        <View style={styles.header}>
            <View style={styles.headerTop}>
                <View>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <Text style={styles.headerSubtitle}>Hi, {user?.name || 'User'}!</Text>
                </View>
                <TouchableOpacity
                    style={styles.cartButton}
                    onPress={() => Alert.alert('Cart', 'Cart feature coming soon')}
                >
                    <Text style={styles.cartIcon}>🛒</Text>
                    {totalItems > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{totalItems}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            {showSearch && (
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
                    onChangeText={onSearchChange}
                    onSubmit={onSearchSubmit}
                    onPress={onSearchPress}
                    rotationInterval={2000}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.PRIMARY,
        paddingHorizontal: SIZES.PADDING_XL,
        paddingTop: SIZES.PADDING_XXL + 8,
        paddingBottom: SIZES.PADDING_XL,
        borderBottomLeftRadius: SIZES.RADIUS_XL,
        borderBottomRightRadius: SIZES.RADIUS_XL,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.PADDING_LG,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.WHITE,
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    headerSubtitle: {
        fontSize: SIZES.FONT_MD,
        color: COLORS.WHITE,
        opacity: 0.95,
        marginTop: 2,
        fontWeight: '400',
    },
    cartButton: {
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartIcon: {
        fontSize: 24,
    },
    badge: {
        position: 'absolute',
        top: -3,
        right: -3,
        backgroundColor: COLORS.ACCENT,
        borderRadius: SIZES.RADIUS_ROUND,
        minWidth: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        borderWidth: 2,
        borderColor: COLORS.PRIMARY,
    },
    badgeText: {
        color: COLORS.TEXT_PRIMARY,
        fontSize: SIZES.FONT_XS,
        fontWeight: '700',
    },
});

export default AppHeader;
