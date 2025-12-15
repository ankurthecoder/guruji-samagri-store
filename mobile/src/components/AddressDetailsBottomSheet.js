import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
    Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddressDetailsBottomSheet = ({ visible, onClose, onSave, addressData }) => {
    const insets = useSafeAreaInsets();
    const [receiver, setReceiver] = useState('Myself'); // Myself, Someone else
    const [tag, setTag] = useState('Home'); // Home, Work, Hotel, Other
    const [flatNo, setFlatNo] = useState('');
    const [floor, setFloor] = useState('');
    const [landmark, setLandmark] = useState('');

    // Animation for bottom sheet
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleSave = () => {
        // Validate required fields
        if (!flatNo) {
            // Show error or toast
            return;
        }

        const details = {
            receiver,
            tag,
            flatNo,
            floor,
            landmark,
            ...addressData
        };
        onSave(details);
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <Animated.View
                    style={[
                        styles.bottomSheet,
                        {
                            transform: [{
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [600, 0]
                                })
                            }]
                        }
                    ]}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Enter complete address</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={COLORS.BLACK} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.content}
                        contentContainerStyle={[
                            styles.scrollContent,
                            { paddingBottom: insets.bottom + verticalScale(80) } // Extra padding for fixed button
                        ]}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Receiver Selection */}
                        <Text style={styles.sectionLabel}>Who you are ordering for?</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity
                                style={styles.radioOption}
                                onPress={() => setReceiver('Myself')}
                            >
                                <Ionicons
                                    name={receiver === 'Myself' ? "radio-button-on" : "radio-button-off"}
                                    size={20}
                                    color={receiver === 'Myself' ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY}
                                />
                                <Text style={styles.radioText}>Myself</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.radioOption}
                                onPress={() => setReceiver('Someone else')}
                            >
                                <Ionicons
                                    name={receiver === 'Someone else' ? "radio-button-on" : "radio-button-off"}
                                    size={20}
                                    color={receiver === 'Someone else' ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY}
                                />
                                <Text style={styles.radioText}>Someone else</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Address Tag */}
                        <Text style={[styles.sectionLabel, { marginTop: verticalScale(16) }]}>Save address as *</Text>
                        <View style={styles.tagGroup}>
                            {['Home', 'Work', 'Hotel', 'Other'].map((t) => (
                                <TouchableOpacity
                                    key={t}
                                    style={[
                                        styles.tagChip,
                                        tag === t && styles.tagChipSelected
                                    ]}
                                    onPress={() => setTag(t)}
                                >
                                    <Ionicons
                                        name={
                                            t === 'Home' ? 'home-outline' :
                                                t === 'Work' ? 'briefcase-outline' :
                                                    t === 'Hotel' ? 'business-outline' : 'location-outline'
                                        }
                                        size={16}
                                        color={tag === t ? COLORS.BLACK : COLORS.TEXT_SECONDARY}
                                    />
                                    <Text style={[
                                        styles.tagText,
                                        tag === t && styles.tagTextSelected
                                    ]}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Inputs */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.floatingLabel}>Flat / House no / Building name *</Text>
                            <TextInput
                                style={styles.input}
                                value={flatNo}
                                onChangeText={setFlatNo}
                                placeholder=""
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.floatingLabel}>Floor (optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={floor}
                                onChangeText={setFloor}
                                placeholder=""
                            />
                        </View>

                        <View style={styles.areaContainer}>
                            <Text style={styles.floatingLabel}>Area / Sector / Locality *</Text>
                            <View style={styles.areaRow}>
                                <Text style={styles.areaText} numberOfLines={2}>
                                    {addressData?.mainText || 'Select Location'}
                                </Text>
                                <TouchableOpacity>
                                    <Text style={styles.changeText}>Change</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.floatingLabel}>Nearby landmark (optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={landmark}
                                onChangeText={setLandmark}
                                placeholder=""
                            />
                        </View>

                    </ScrollView>

                    {/* Fixed Save Button */}
                    <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveButtonText}>Save address</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        zIndex: 100,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bottomSheet: {
        backgroundColor: COLORS.WHITE,
        borderTopLeftRadius: scale(16),
        borderTopRightRadius: scale(16),
        maxHeight: '85%',
        minHeight: '50%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: scale(16),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: COLORS.BLACK,
    },
    closeButton: {
        padding: scale(4),
    },
    content: {
        paddingHorizontal: scale(16),
    },
    scrollContent: {
        paddingTop: verticalScale(16),
    },
    sectionLabel: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: verticalScale(8),
    },
    radioGroup: {
        flexDirection: 'row',
        gap: scale(24),
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    radioText: {
        fontSize: moderateScale(14),
        color: COLORS.BLACK,
    },
    tagGroup: {
        flexDirection: 'row',
        gap: scale(10),
        marginBottom: verticalScale(20),
    },
    tagChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
        borderRadius: scale(20),
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: COLORS.WHITE,
    },
    tagChipSelected: {
        backgroundColor: '#FFF8E1', // Light yellow/orange
        borderColor: '#FFC107',
    },
    tagText: {
        fontSize: moderateScale(12),
        color: COLORS.TEXT_SECONDARY,
        fontWeight: '500',
    },
    tagTextSelected: {
        color: COLORS.BLACK,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: scale(8),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(8),
        marginBottom: verticalScale(16),
    },
    floatingLabel: {
        fontSize: moderateScale(10),
        color: COLORS.TEXT_SECONDARY,
        marginBottom: verticalScale(2),
    },
    input: {
        padding: 0,
        fontSize: moderateScale(14),
        color: COLORS.BLACK,
        height: verticalScale(24),
    },
    areaContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: scale(8),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(8),
        marginBottom: verticalScale(16),
    },
    areaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: verticalScale(4),
    },
    areaText: {
        flex: 1,
        fontSize: moderateScale(13),
        color: COLORS.BLACK,
        fontWeight: '500',
        marginRight: scale(8),
    },
    changeText: {
        fontSize: moderateScale(12),
        color: COLORS.PRIMARY,
        fontWeight: '600',
    },
    footer: {
        padding: scale(16),
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: COLORS.WHITE,
    },
    saveButton: {
        backgroundColor: '#2E7D32', // Blinkit Green
        paddingVertical: verticalScale(12),
        borderRadius: scale(8),
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: COLORS.WHITE,
    },
});

export default AddressDetailsBottomSheet;
