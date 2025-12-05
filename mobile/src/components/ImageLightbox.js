import React, { useState } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Text,
} from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from 'react-native-size-matters';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

/**
 * ImageLightbox Component
 * Full-screen image gallery with swipe and zoom
 * 
 * @param {boolean} visible - Lightbox visibility
 * @param {array} images - Array of image URLs
 * @param {number} initialIndex - Starting image index
 * @param {function} onClose - Close callback
 */
const ImageLightbox = ({ visible, images = [], initialIndex = 0, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentIndex(index);
    };

    return (
        <Modal
            isVisible={visible}
            style={styles.modal}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            animationIn="fadeIn"
            animationOut="fadeOut"
            backdropOpacity={0.95}
        >
            <View style={styles.container}>
                {/* Close Button */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    activeOpacity={0.8}
                >
                    <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>

                {/* Image Carousel */}
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    contentOffset={{ x: initialIndex * width, y: 0 }}
                >
                    {images.map((imageUri, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                    ))}
                </ScrollView>

                {/* Image Counter */}
                {images.length > 1 && (
                    <View style={styles.counterContainer}>
                        <Text style={styles.counterText}>
                            {currentIndex + 1} / {images.length}
                        </Text>
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        margin: 0,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: verticalScale(50),
        right: scale(20),
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        color: COLORS.WHITE,
        fontSize: scale(24),
        fontWeight: '600',
    },
    imageContainer: {
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width * 0.9,
        height: height * 0.7,
    },
    counterContainer: {
        position: 'absolute',
        bottom: verticalScale(50),
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(8),
        borderRadius: scale(20),
    },
    counterText: {
        color: COLORS.WHITE,
        fontSize: scale(14),
        fontWeight: '600',
    },
});

export default ImageLightbox;
