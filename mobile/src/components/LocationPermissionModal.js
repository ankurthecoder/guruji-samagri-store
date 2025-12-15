import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Image,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS } from '../constants/colors';

const LocationPermissionModal = ({ visible, onEnableLocation, onSelectManually, onClose }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.iconText}>📍</Text>
                            <View style={styles.iconSlash} />
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Location permission not enabled</Text>

                    {/* Description */}
                    <Text style={styles.description}>
                        Please enable location permission for a better delivery experience
                    </Text>

                    {/* Enable Button */}
                    <TouchableOpacity
                        style={styles.enableButton}
                        onPress={onEnableLocation}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.enableButtonText}>Enable device location</Text>
                    </TouchableOpacity>

                    {/* Manual Selection Button */}
                    <TouchableOpacity
                        style={styles.manualButton}
                        onPress={onSelectManually}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.manualButtonText}>Select location manually</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(20),
    },
    modalContent: {
        backgroundColor: COLORS.WHITE,
        borderRadius: scale(12),
        padding: scale(20), // Reduced padding
        width: '100%',
        maxWidth: scale(300), // Reduced max width
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: verticalScale(16), // Reduced margin
    },
    iconCircle: {
        width: scale(60), // Reduced size
        height: scale(60),
        borderRadius: scale(30),
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    iconText: {
        fontSize: moderateScale(30), // Reduced font size
    },
    iconSlash: {
        position: 'absolute',
        width: scale(70), // Reduced size
        height: scale(3),
        backgroundColor: '#E53935',
        transform: [{ rotate: '-45deg' }],
        borderRadius: scale(2),
    },
    title: {
        fontSize: moderateScale(14), // Reduced font size
        fontWeight: '700',
        color: COLORS.BLACK,
        textAlign: 'center',
        marginBottom: verticalScale(6),
    },
    description: {
        fontSize: moderateScale(11), // Reduced font size
        color: COLORS.TEXT_SECONDARY,
        textAlign: 'center',
        marginBottom: verticalScale(20),
        lineHeight: moderateScale(16),
    },
    enableButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: verticalScale(10), // Reduced padding
        paddingHorizontal: scale(20),
        borderRadius: scale(8),
        width: '100%',
        marginBottom: verticalScale(10),
    },
    enableButtonText: {
        fontSize: moderateScale(13), // Reduced font size
        fontWeight: '600',
        color: COLORS.WHITE,
        textAlign: 'center',
    },
    manualButton: {
        paddingVertical: verticalScale(8), // Reduced padding
        paddingHorizontal: scale(20),
        width: '100%',
    },
    manualButtonText: {
        fontSize: moderateScale(12), // Reduced font size
        fontWeight: '500',
        color: COLORS.TEXT_SECONDARY,
        textAlign: 'center',
    },
});

export default LocationPermissionModal;
