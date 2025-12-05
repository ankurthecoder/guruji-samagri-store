import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';
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
    scrollY,
}) => {
    const insets = useSafeAreaInsets();
    const user = useAuthStore(state => state.user);
    const totalItems = useCartStore(state => state.totalItems);

    // Use provided scrollY or create a dummy one to prevent crashes
    const scrollAnim = scrollY || new Animated.Value(0);

    // Dynamic dimensions based on safe area - using responsive scaling
    const BASE_HEADER_HEIGHT = verticalScale(115); // Base height without safe area
    const HEADER_MAX_HEIGHT = BASE_HEADER_HEIGHT + insets.top;
    const HEADER_MIN_HEIGHT = verticalScale(60) + insets.top; // Search bar height + safe area
    const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

    const headerTranslateY = scrollAnim.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -HEADER_SCROLL_DISTANCE],
        extrapolate: 'clamp',
    });

    const topInfoOpacity = scrollAnim.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View style={[
            styles.header,
            {
                height: HEADER_MAX_HEIGHT,
                paddingTop: insets.top + SIZES.PADDING_SM, // Dynamic padding
                transform: [{ translateY: headerTranslateY }]
            }
        ]}>
            <Animated.View style={[
                styles.headerTop,
                {
                    top: insets.top + SIZES.PADDING_SM, // Adjust top position
                    opacity: topInfoOpacity
                }
            ]}>
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
            </Animated.View>

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
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: COLORS.PRIMARY,
        paddingHorizontal: SIZES.PADDING_XL - 8,
        // paddingTop is now handled dynamically
        paddingBottom: SIZES.PADDING_MD, // Reduced from XL
        borderBottomLeftRadius: SIZES.RADIUS_XL,
        borderBottomRightRadius: SIZES.RADIUS_XL,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        // height is now handled dynamically
        justifyContent: 'flex-end', // Align content to bottom so search bar stays
    },
    headerTop: {
        position: 'absolute',
        // top is now handled dynamically
        left: SIZES.PADDING_XL,
        right: SIZES.PADDING_XL,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.PADDING_LG,
        height: verticalScale(60), // Fixed height for top part
    },
    headerTitle: {
        fontSize: moderateScale(18),
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
        width: scale(44),
        height: scale(44),
        borderRadius: scale(22),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartIcon: {
        fontSize: moderateScale(24),
    },
    badge: {
        position: 'absolute',
        top: scale(-3),
        right: scale(-3),
        backgroundColor: COLORS.ACCENT,
        borderRadius: SIZES.RADIUS_ROUND,
        minWidth: scale(22),
        height: scale(22),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(5),
        borderWidth: scale(2),
        borderColor: COLORS.PRIMARY,
    },
    badgeText: {
        color: COLORS.TEXT_PRIMARY,
        fontSize: SIZES.FONT_XS,
        fontWeight: '700',
    },
});

export default AppHeader;
