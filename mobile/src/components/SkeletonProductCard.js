import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../constants/colors';

const SkeletonProductCard = () => {
    const opacityAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();

        return () => pulse.stop();
    }, []);

    return (
        <View style={styles.container}>
            {/* Image Skeleton */}
            <Animated.View style={[styles.imageSkeleton, { opacity: opacityAnim }]} />

            {/* Content Skeleton */}
            <View style={styles.contentContainer}>
                {/* Time Badge Skeleton */}
                <Animated.View style={[styles.badgeSkeleton, { opacity: opacityAnim }]} />

                {/* Title Skeleton - 2 lines */}
                <Animated.View style={[styles.textSkeleton, { width: '90%', opacity: opacityAnim }]} />
                <Animated.View style={[styles.textSkeleton, { width: '60%', opacity: opacityAnim }]} />

                {/* Weight Skeleton */}
                <Animated.View style={[styles.textSkeleton, { width: '40%', marginTop: 8, opacity: opacityAnim }]} />

                {/* Price & Add Button Skeleton */}
                <View style={styles.footer}>
                    <View>
                        <Animated.View style={[styles.textSkeleton, { width: 40, height: 14, opacity: opacityAnim }]} />
                        <Animated.View style={[styles.textSkeleton, { width: 50, height: 16, marginTop: 4, opacity: opacityAnim }]} />
                    </View>
                    <Animated.View style={[styles.buttonSkeleton, { opacity: opacityAnim }]} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: SIZES.RADIUS_LG,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: 4,
    },
    imageSkeleton: {
        width: '100%',
        height: 120,
        backgroundColor: '#E0E0E0',
    },
    contentContainer: {
        padding: SIZES.PADDING_SM,
    },
    badgeSkeleton: {
        width: 60,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        marginBottom: 8,
    },
    textSkeleton: {
        height: 12,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        marginBottom: 6,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    buttonSkeleton: {
        width: 70,
        height: 32,
        borderRadius: SIZES.RADIUS_MD,
        backgroundColor: '#E0E0E0',
    },
});

export default SkeletonProductCard;
