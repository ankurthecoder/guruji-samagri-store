import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    PanResponder,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProductVariantModal = ({ visible, onClose, product, onAddVariant }) => {
    const [showModal, setShowModal] = React.useState(visible);
    const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only capture if moving down significantly
                return gestureState.dy > 5;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    // Dragging down
                    slideAnim.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100) {
                    // Dragged down enough to close
                    onClose();
                } else {
                    // Snap back to top
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        damping: 20,
                        stiffness: 100,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    React.useEffect(() => {
        if (visible) {
            setShowModal(true);
            slideAnim.setValue(SCREEN_HEIGHT); // Ensure it starts from bottom
            Animated.spring(slideAnim, {
                toValue: 0,
                damping: 20,
                stiffness: 100,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    setShowModal(false);
                }
            });
        }
    }, [visible]);

    if (!product || !product.variants) return null;

    const handleAddVariant = (variant) => {
        const variantProduct = {
            ...product,
            id: variant.id,
            variant: variant.size,
            price: variant.price,
            mrp: variant.mrp,
            discount: variant.discount,
            perUnitPrice: variant.perUnitPrice,
            stock: variant.stock,
        };
        onAddVariant(variantProduct);
        onClose();
    };

    return (
        <Modal
            transparent
            visible={showModal}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.animatedWrapper,
                                {
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                            {...panResponder.panHandlers}
                        >
                            {/* Floating Close Button */}
                            <TouchableOpacity style={styles.floatingCloseButton} onPress={onClose}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>

                            <View style={styles.modalContainer}>
                                {/* Header - Just Product Name */}
                                <View style={styles.header}>
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {product.name}
                                    </Text>
                                </View>

                                {/* Variants List */}
                                <View style={styles.listContainer}>
                                    <ScrollView
                                        style={styles.variantsList}
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={styles.variantsListContent}
                                    >
                                        {product.variants.map((variant, index) => (
                                            <View key={variant.id} style={styles.variantCard}>
                                                <View style={styles.cardContent}>
                                                    {/* 1. Image with Badge */}
                                                    <View style={styles.imageContainer}>
                                                        <View style={styles.variantImagePlaceholder}>
                                                            <Text style={styles.variantImageEmoji}>📦</Text>
                                                        </View>
                                                        {variant.discount > 0 && (
                                                            <View style={styles.discountBadge}>
                                                                <Text style={styles.discountText}>
                                                                    {variant.discount}%{'\n'}OFF
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>

                                                    {/* 2. Size */}
                                                    <View style={styles.sizeContainer}>
                                                        <Text style={styles.variantSize}>{variant.size}</Text>
                                                    </View>

                                                    {/* 3. Price Info */}
                                                    <View style={styles.priceInfoContainer}>
                                                        <View style={styles.priceRow}>
                                                            <Text style={styles.variantPrice}>₹{variant.price}</Text>
                                                            {variant.mrp > variant.price && (
                                                                <Text style={styles.variantMrp}>₹{variant.mrp}</Text>
                                                            )}
                                                        </View>
                                                        {variant.perUnitPrice && (
                                                            <Text style={styles.perUnitPrice}>
                                                                {variant.perUnitPrice}
                                                            </Text>
                                                        )}
                                                    </View>

                                                    {/* 4. ADD Button */}
                                                    <TouchableOpacity
                                                        style={styles.addButton}
                                                        onPress={() => handleAddVariant(variant)}
                                                    >
                                                        <Text style={styles.addButtonText}>ADD</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    animatedWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    floatingCloseButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    modalContainer: {
        width: '100%',
        backgroundColor: '#F5F7FD', // Light blue-gray background
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: SCREEN_HEIGHT * 0.7,
        paddingBottom: 20,
    },
    header: {
        padding: 20,
        backgroundColor: '#F5F7FD', // Match background
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    productName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1C1C1C',
        lineHeight: 24,
    },
    listContainer: {
        backgroundColor: '#F5F7FD',
    },
    variantsList: {
        // Removed flex: 1 to allow auto-height
    },
    variantsListContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    variantCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        marginBottom: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imageContainer: {
        position: 'relative',
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    variantImagePlaceholder: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    variantImageEmoji: {
        fontSize: 36,
    },
    discountBadge: {
        position: 'absolute',
        top: -4,
        left: -4,
        backgroundColor: '#256FEF', // Blue badge
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 4,
        alignItems: 'center',
        zIndex: 1,
    },
    discountText: {
        fontSize: 9,
        fontWeight: '800',
        color: COLORS.WHITE,
        textAlign: 'center',
        lineHeight: 10,
    },
    sizeContainer: {
        flex: 1,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    variantSize: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1C1C1C',
    },
    priceInfoContainer: {
        alignItems: 'flex-end',
        marginRight: 16,
        minWidth: 80,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    variantPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1C1C1C',
        marginRight: 6,
    },
    variantMrp: {
        fontSize: 13,
        color: '#9E9E9E',
        textDecorationLine: 'line-through',
    },
    perUnitPrice: {
        fontSize: 11,
        color: '#9E9E9E',
    },
    addButton: {
        borderWidth: 1,
        borderColor: '#2E7D32',
        backgroundColor: COLORS.WHITE,
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2E7D32',
    },
});

export default ProductVariantModal;
