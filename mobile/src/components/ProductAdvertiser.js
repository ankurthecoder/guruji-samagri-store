import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
} from 'react-native';
import { COLORS, SIZES } from '../constants/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8; // 80% of screen width
const SPACING = 12;
const ITEM_SIZE = CARD_WIDTH + SPACING;

const ProductAdvertiser = ({ ads }) => {
    const flatListRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    // Infinite Scroll Setup
    const LOOPS = 100;
    const MIDDLE_LOOP_INDEX = 50;
    // Memoize the infinite data to prevent re-calculations
    const infiniteAds = React.useMemo(() => {
        return Array(LOOPS).fill(ads).flat();
    }, [ads]);

    const startIndex = ads.length * MIDDLE_LOOP_INDEX;
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    // Auto-scroll logic
    useEffect(() => {
        let intervalId;

        const startAutoScroll = () => {
            intervalId = setInterval(() => {
                let nextIndex = currentIndex + 1;
                // Reset if we get too close to the end (unlikely but safe)
                if (nextIndex >= infiniteAds.length - 10) {
                    nextIndex = startIndex;
                    flatListRef.current?.scrollToIndex({
                        index: nextIndex,
                        animated: false,
                    });
                } else {
                    flatListRef.current?.scrollToIndex({
                        index: nextIndex,
                        animated: true,
                    });
                }
                setCurrentIndex(nextIndex);
            }, 3000);
        };

        startAutoScroll();

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [currentIndex, infiniteAds.length, startIndex]);

    const renderItem = ({ item, index }) => {
        return (
            <View style={[styles.cardContainer, { backgroundColor: item.backgroundColor }]}>
                <View style={styles.contentContainer}>
                    {/* Header Image/Icon */}
                    {item.headerImage && (
                        <Image
                            source={item.headerImage}
                            style={styles.headerImage}
                            resizeMode="contain"
                        />
                    )}

                    {/* Title */}
                    <Text style={styles.title}>{item.title}</Text>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>{item.subtitle}</Text>

                    {/* Powered By */}
                    {item.poweredBy && (
                        <View style={styles.poweredByContainer}>
                            <Text style={styles.poweredByText}>POWERED BY</Text>
                            <View style={styles.brandBadge}>
                                <Text style={styles.brandText}>{item.poweredBy}</Text>
                            </View>
                        </View>
                    )}

                    {/* CTA Button */}
                    <TouchableOpacity style={styles.ctaButton} onPress={item.onPress}>
                        <Text style={styles.ctaText}>{item.buttonText || 'Shop now'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Product Image Composition */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.productImage }}
                        style={styles.productImage}
                        resizeMode="contain"
                    />
                </View>
            </View>
        );
    };

    const getItemLayout = (data, index) => ({
        length: ITEM_SIZE,
        offset: ITEM_SIZE * index,
        index,
    });

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={infiniteAds}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_SIZE}
                decelerationRate="fast"
                contentContainerStyle={{
                    paddingHorizontal: (width - CARD_WIDTH) / 2 - SPACING / 2,
                }}
                getItemLayout={getItemLayout}
                initialScrollIndex={startIndex}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(
                        event.nativeEvent.contentOffset.x / ITEM_SIZE
                    );
                    setCurrentIndex(index);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: SIZES.PADDING_MD,
    },
    listContent: {
        paddingHorizontal: SIZES.PADDING_LG,
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: 200,
        borderRadius: SIZES.RADIUS_LG,
        marginRight: SPACING,
        flexDirection: 'row',
        overflow: 'hidden',
        padding: SIZES.PADDING_LG,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        zIndex: 2,
    },
    headerImage: {
        width: 100,
        height: 40,
        marginBottom: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#333', // Dark text for contrast
        marginBottom: 4,
        lineHeight: 26,
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        marginBottom: 12,
        lineHeight: 18,
    },
    poweredByContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    poweredByText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#666',
        marginRight: 6,
    },
    brandBadge: {
        backgroundColor: '#E53935', // Red brand color example
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    brandText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    ctaButton: {
        backgroundColor: '#212121',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    ctaText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 13,
    },
    imageContainer: {
        width: '45%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'relative',
    },
    productImage: {
        width: '140%', // Make it slightly larger to pop out
        height: '100%',
        position: 'absolute',
        bottom: -10,
        right: -10,
    },
});

export default ProductAdvertiser;
