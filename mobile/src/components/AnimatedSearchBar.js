import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Animated,
    Easing,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS, SIZES } from '../constants/colors';

/**
 * AnimatedSearchBar Component
 * A reusable search bar with vertical scroll-up animated placeholder text
 * Similar to Blinkit's search bar implementation with ticker-style animation
 * 
 * @param {string[]} rotatingTexts - Array of texts to rotate in the placeholder
 * @param {number} rotationInterval - Interval in milliseconds for text rotation (default: 2000)
 * @param {string} value - Current search query value
 * @param {function} onChangeText - Callback when search text changes
 * @param {function} onSubmit - Callback when search is submitted
 * @param {function} onPress - Callback when search bar is pressed (for navigation)
 * @param {object} containerStyle - Additional styles for the container
 */
const AnimatedSearchBar = ({
    rotatingTexts = ['puja samagri', 'bracelets', 'pendants', 'organic honey'],
    rotationInterval = 3000,
    value = '',
    onChangeText,
    onSubmit,
    onPress,
    containerStyle,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [isFocused, setIsFocused] = useState(false);

    // Animation for smooth vertical scrolling
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Don't rotate if user is typing or field is focused
        if (isFocused || value.length > 0) {
            return;
        }

        const animateText = () => {
            // Calculate next index
            const next = (currentIndex + 1) % rotatingTexts.length;
            setNextIndex(next);

            // Smooth slide up animation
            Animated.timing(slideAnim, {
                toValue: 1, // Slide to next position
                duration: 500, // Smooth transition
                easing: Easing.out(Easing.cubic), // Smooth easing
                useNativeDriver: true,
            }).start(() => {
                // Update current index
                setCurrentIndex(next);
                // Reset animation instantly for next cycle
                slideAnim.setValue(0);
            });
        };

        const interval = setInterval(animateText, rotationInterval);

        return () => clearInterval(interval);
    }, [isFocused, value, currentIndex, rotatingTexts.length, rotationInterval, slideAnim]);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleSearch = () => {
        if (onSubmit) {
            onSubmit(value);
        }
    };

    // Show placeholder only when input is empty
    const showPlaceholder = !isFocused && value.length === 0;

    return (
        <View style={[styles.searchContainer, containerStyle]}>
            {/* Custom Animated Placeholder */}
            {showPlaceholder && (
                <View style={styles.placeholderContainer} pointerEvents="none">
                    <Text style={styles.placeholderFixed}>Search for </Text>

                    {/* Animated vertical scrolling text container */}
                    <View style={styles.animatedTextContainer}>
                        {/* Current text - slides up and out */}
                        <Animated.Text
                            style={[
                                styles.placeholderAnimated,
                                {
                                    transform: [{
                                        translateY: slideAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -verticalScale(40)], // Slide up
                                        })
                                    }],
                                    opacity: slideAnim.interpolate({
                                        inputRange: [0, 0.5, 1],
                                        outputRange: [1, 0.5, 0], // Fade out while sliding
                                    }),
                                },
                            ]}
                            numberOfLines={1}>
                            {rotatingTexts[currentIndex]}
                        </Animated.Text>

                        {/* Next text - slides up from below */}
                        <Animated.Text
                            style={[
                                styles.placeholderAnimated,
                                styles.placeholderNext,
                                {
                                    transform: [{
                                        translateY: slideAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [verticalScale(40), 0], // Slide up into view
                                        })
                                    }],
                                    opacity: slideAnim.interpolate({
                                        inputRange: [0, 0.5, 1],
                                        outputRange: [0, 0.5, 1], // Fade in while sliding
                                    }),
                                },
                            ]}
                            numberOfLines={1}>
                            {rotatingTexts[nextIndex]}
                        </Animated.Text>
                    </View>
                </View>
            )}

            {/* Search Input */}
            <TouchableOpacity
                style={styles.inputWrapper}
                activeOpacity={onPress ? 0.8 : 1}
                onPress={onPress}
                disabled={!onPress}>
                <TextInput
                    style={styles.searchInput}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    editable={!onPress}
                    // Empty placeholder since we're using custom placeholder
                    placeholder=""
                />
            </TouchableOpacity>

            {/* Search Button */}
            <TouchableOpacity style={styles.searchButton} onPress={onPress || handleSearch}>
                <Text style={styles.searchIcon}>⌕</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        height: verticalScale(SIZES.PADDING_XXL + 8),
        backgroundColor: COLORS.WHITE,
        borderRadius: SIZES.RADIUS_LG,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.08,
        shadowRadius: scale(4),
        elevation: 3,
    },
    placeholderContainer: {
        position: 'absolute',
        left: SIZES.PADDING_LG,
        right: scale(60), // Constrain width to prevent wrapping issues (50px button + padding)
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
    },
    placeholderFixed: {
        fontSize: SIZES.FONT_MD,
        color: '#999',
    },
    animatedTextContainer: {
        flex: 1, // Take remaining space
        height: verticalScale(40),
        overflow: 'hidden',
        justifyContent: 'center',
    },
    placeholderAnimated: {
        fontSize: SIZES.FONT_MD,
        color: '#666',
        fontWeight: '500',
        height: verticalScale(40),
        textAlignVertical: 'center',
        lineHeight: verticalScale(40),
        width: '100%', // Ensure text takes full width
    },
    placeholderNext: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    inputWrapper: {
        flex: 1,
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: SIZES.PADDING_LG,
        paddingVertical: SIZES.PADDING_MD + 2,
        fontSize: SIZES.FONT_MD,
        color: COLORS.TEXT_PRIMARY,
        zIndex: 2,
    },
    searchButton: {
        width: scale(50),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.ACCENT,
    },
    searchIcon: {
        fontSize: moderateScale(24),
        color: COLORS.TEXT_PRIMARY,
        fontWeight: '600',
    },
});

export default AnimatedSearchBar;

