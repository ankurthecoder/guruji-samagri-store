// src/components/CarouselComponent.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Text, Dimensions, StyleSheet, ScrollView, Animated } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.82;
const CARD_SPACING = scale(5);
const SIDE_CARD_SCALE = 0.95;

const CarouselComponent = ({ data = [] }) => {
    const [activeIndex, setActiveIndex] = useState(data.length);
    const scrollX = useRef(new Animated.Value(data.length * (CARD_WIDTH + CARD_SPACING))).current;
    const scrollViewRef = useRef(null);

    // Prevent crash → if empty, return nothing
    if (!data || data.length === 0) {
        return null;
    }

    // Triple the data for infinite loop
    const loopedData = [...data, ...data, ...data];

    // Set initial position to middle set (2nd copy)
    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                x: data.length * (CARD_WIDTH + CARD_SPACING),
                animated: false,
            });
        }, 50);
    }, []);

    // Auto-scroll every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            // If we are at the end of the loop (index 10 = Slide 1)
            // We want to go to Slide 2.
            // Best way: Reset to index 5 (Slide 1), then animate to index 6 (Slide 2).
            if (activeIndex >= data.length * 2) {
                // 1. Instant jump to middle set equivalent
                scrollViewRef.current?.scrollTo({
                    x: data.length * (CARD_WIDTH + CARD_SPACING),
                    animated: false,
                });

                // 2. Animate to next slide after small delay to ensure reset happens first
                setTimeout(() => {
                    scrollViewRef.current?.scrollTo({
                        x: (data.length + 1) * (CARD_WIDTH + CARD_SPACING),
                        animated: true,
                    });
                    setActiveIndex(data.length + 1);
                }, 20);
            } else {
                const nextIndex = activeIndex + 1;
                scrollViewRef.current?.scrollTo({
                    x: nextIndex * (CARD_WIDTH + CARD_SPACING),
                    animated: true,
                });
                setActiveIndex(nextIndex);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [activeIndex, data.length]);

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_SPACING));
        setActiveIndex(index);
    };

    const handleMomentumScrollEnd = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_SPACING));

        // Only reset when scrolled past edges, not on edge slides
        if (index > data.length * 2 - 1) {
            // Scrolled past end of third set, jump to same position in middle set
            const targetIndex = index - data.length;
            scrollViewRef.current?.scrollTo({
                x: targetIndex * (CARD_WIDTH + CARD_SPACING),
                animated: false,
            });
            setActiveIndex(targetIndex);
        } else if (index < 1) {
            // Scrolled before start, jump to same position in middle set  
            scrollViewRef.current?.scrollTo({
                x: (data.length + index) * (CARD_WIDTH + CARD_SPACING),
                animated: false,
            });
            setActiveIndex(data.length + index);
        }
    };

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled={false}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true, listener: handleScroll }
                )}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                scrollEventThrottle={16}
                snapToInterval={CARD_WIDTH + CARD_SPACING}
                decelerationRate={0.9}
                contentContainerStyle={styles.scrollContent}
                removeClippedSubviews={false}
                overScrollMode="never"
            >
                {loopedData.map((item, index) => {
                    const inputRange = [
                        (index - 1) * (CARD_WIDTH + CARD_SPACING),
                        index * (CARD_WIDTH + CARD_SPACING),
                        (index + 1) * (CARD_WIDTH + CARD_SPACING),
                    ];

                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [SIDE_CARD_SCALE, 1, SIDE_CARD_SCALE],
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.7, 1, 0.7],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={`${item.id}-${index}`}
                            style={[
                                styles.cardContainer,
                                {
                                    transform: [{ scale }],
                                    opacity,
                                },
                            ]}
                        >
                            <View style={styles.card}>
                                <Image source={{ uri: item.image }} style={styles.image} />
                                {item.title && <Text style={styles.title}>{item.title}</Text>}
                            </View>
                        </Animated.View>
                    );
                })}
            </Animated.ScrollView>

            {/* Pagination dots */}
            {/* <View style={styles.pagination}>
                {data.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === (activeIndex % data.length) && styles.activeDot,
                        ]}
                    />
                ))}
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: verticalScale(5),
    },
    scrollContent: {
        paddingHorizontal: (width - CARD_WIDTH) / 2,
        paddingBottom: verticalScale(10),
    },
    cardContainer: {
        width: CARD_WIDTH,
        marginHorizontal: CARD_SPACING / 2,
    },
    card: {
        width: '100%',
        borderRadius: scale(16),
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: verticalScale(4) },
        shadowOpacity: 0.2,
        shadowRadius: scale(12),
        elevation: 8,
    },
    image: {
        width: '100%',
        height: verticalScale(140),
        resizeMode: 'cover',
    },
    title: {
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: verticalScale(5),
    },
    dot: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: '#ccc',
        marginHorizontal: scale(4),
    },
    activeDot: {
        backgroundColor: '#FF6B35',
        width: scale(24),
    },
});

export default CarouselComponent;
