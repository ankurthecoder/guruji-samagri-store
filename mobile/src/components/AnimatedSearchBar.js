import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Animated,
} from 'react-native';
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
    rotationInterval = 2000,
    value = '',
    onChangeText,
    onSubmit,
    onPress,
    containerStyle,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);
    const [isFocused, setIsFocused] = useState(false);

    // Animation for the sliding effect
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Don't rotate if user is typing or field is focused
        if (isFocused || value.length > 0) {
            return;
        }

        const rotateText = () => {
            // Calculate next index
            const next = (currentIndex + 1) % rotatingTexts.length;
            setNextIndex(next);

            // Animate slide up
            Animated.timing(slideAnim, {
                toValue: -1, // Slide up by full height
                duration: 250,
                useNativeDriver: true,
            }).start(() => {
                // Update current index
                setCurrentIndex(next);
                // Reset animation value without animating
                slideAnim.setValue(0);
            });
        };

        const interval = setInterval(rotateText, rotationInterval);

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

    // Calculate translateY for current and next text
    // When slideAnim goes from 0 to -1:
    // - Current text: 0 -> -100% (slides up and out)
    // - Next text: 100% -> 0 (slides up into view)
    const currentTranslateY = slideAnim.interpolate({
        inputRange: [-1, 0],
        outputRange: [-20, 0], // -20 is approximate height, slides up
    });

    const nextTranslateY = slideAnim.interpolate({
        inputRange: [-1, 0],
        outputRange: [0, 20], // Starts below, slides up to position
    });

    return (
        <View style={[styles.searchContainer, containerStyle]}>
            {/* Custom Animated Placeholder */}
            {showPlaceholder && (
                <View style={styles.placeholderContainer} pointerEvents="none">
                    <Text style={styles.placeholderFixed}>Search for </Text>

                    {/* Animated text container with overflow hidden */}
                    <View style={styles.animatedTextContainer}>
                        {/* Current text - slides up and out */}
                        <Animated.Text
                            style={[
                                styles.placeholderAnimated,
                                {
                                    transform: [{ translateY: currentTranslateY }],
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
                                    transform: [{ translateY: nextTranslateY }],
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
        backgroundColor: COLORS.WHITE,
        borderRadius: SIZES.RADIUS_LG,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    placeholderContainer: {
        position: 'absolute',
        left: SIZES.PADDING_LG,
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
        height: 20,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    placeholderAnimated: {
        fontSize: SIZES.FONT_MD,
        color: '#666',
        fontWeight: '500',
    },
    placeholderNext: {
        position: 'absolute',
        top: 0,
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
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.ACCENT,
    },
    searchIcon: {
        fontSize: 24,
        color: COLORS.TEXT_PRIMARY,
        fontWeight: '600',
    },
});

export default AnimatedSearchBar;
