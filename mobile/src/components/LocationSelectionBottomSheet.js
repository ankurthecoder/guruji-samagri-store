import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
    PermissionsAndroid,
    Platform,
    Linking,
    Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';
import useUIStore from '../stores/uiStore';

const LocationSelectionBottomSheet = ({ visible, onClose, onSelectLocation, navigation }) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
    const searchTimeout = useRef(null);
    const setTabBarVisible = useUIStore(state => state.setTabBarVisible);

    // Hide tabs when visible
    useEffect(() => {
        if (visible) {
            setTabBarVisible(false);
        } else {
            setTabBarVisible(true);
        }
    }, [visible]);

    // Check if location is enabled
    useEffect(() => {
        if (visible) {
            checkLocationPermission();
        }
    }, [visible]);

    const checkLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            setLocationEnabled(granted);
        }
    };

    // Google Places Autocomplete
    const searchPlaces = async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(
                'https://maps.googleapis.com/maps/api/place/autocomplete/json',
                {
                    params: {
                        input: query,
                        key: GOOGLE_MAPS_API_KEY,
                        components: 'country:in', // Restrict to India
                        types: 'geocode', // Address results only
                    },
                }
            );

            if (response.data.predictions) {
                setSuggestions(response.data.predictions);
            }
        } catch (error) {
            console.error('Places API error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    const handleSearch = (text) => {
        setSearchQuery(text);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            searchPlaces(text);
        }, 500);
    };

    const handleEnableLocation = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location for better delivery experience',
                        buttonPositive: 'OK',
                        buttonNegative: 'Cancel',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    setLocationEnabled(true);
                    // Get current location here if needed
                } else {
                    // Open app settings
                    Linking.openSettings();
                }
            } catch (error) {
                console.error('Permission error:', error);
            }
        } else {
            // iOS - request permission
            Geolocation.requestAuthorization();
        }
    };

    const handleSelectSuggestion = (place) => {
        if (onSelectLocation) {
            onSelectLocation({
                placeId: place.place_id,
                description: place.description,
                mainText: place.structured_formatting?.main_text || place.description,
            });
        }
        onClose();
    };

    // Handle location confirmation from map screen
    const handleLocationConfirm = (location) => {
        if (onSelectLocation) {
            onSelectLocation({
                placeId: 'custom_location',
                description: location.address,
                mainText: 'Selected Location',
                geometry: {
                    location: {
                        lat: location.latitude,
                        lng: location.longitude,
                    }
                }
            });
        }
        onClose();
    };

    const handleSearchPress = () => {
        onClose(); // Close bottom sheet
        navigation.navigate('LocationConfirmRoot', {
            onLocationConfirm: handleLocationConfirm
        });
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />

                {/* Close Button - On backdrop */}
                <TouchableOpacity
                    style={[
                        styles.closeButtonContainer,
                        bottomSheetHeight > 0 && { bottom: bottomSheetHeight + 15 }
                    ]}
                    onPress={onClose}
                >
                    <View style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={COLORS.WHITE} />
                    </View>
                </TouchableOpacity>

                <View
                    style={[styles.bottomSheet, { paddingBottom: insets.bottom + 20 }]}
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setBottomSheetHeight(height);
                    }}
                >
                    {/* Location Status Banner */}
                    {!locationEnabled && (
                        <View style={styles.banner}>
                            <View style={styles.bannerLeft}>
                                <Ionicons name="location-outline" size={24} color="#E53935" />
                                <View style={styles.bannerTextContainer}>
                                    <Text style={styles.bannerTitle}>Device location not enabled</Text>
                                    <Text style={styles.bannerSubtitle}>Enable for a better delivery experience</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.enableLocationButton}
                                onPress={handleEnableLocation}
                            >
                                <Text style={styles.enableLocationText}>Enable</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Title */}
                    <Text style={styles.title}>Select delivery location</Text>

                    {/* Search Input */}
                    <TouchableOpacity
                        style={styles.searchContainer}
                        onPress={handleSearchPress}
                        activeOpacity={0.9}
                    >
                        <Ionicons name="search" size={20} color={COLORS.TEXT_SECONDARY} />
                        <Text style={[styles.searchInput, { color: COLORS.TEXT_SECONDARY, paddingVertical: verticalScale(2) }]}>
                            Search for area, street name...
                        </Text>
                    </TouchableOpacity>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Suggestions */}
                        {suggestions.length > 0 && (
                            <View style={styles.suggestions}>
                                {suggestions.map((place) => (
                                    <TouchableOpacity
                                        key={place.place_id}
                                        style={styles.suggestionItem}
                                        onPress={() => handleSelectSuggestion(place)}
                                    >
                                        <Ionicons name="location-outline" size={20} color={COLORS.PRIMARY} />
                                        <View style={styles.suggestionText}>
                                            <Text style={styles.suggestionMain}>
                                                {place.structured_formatting?.main_text || place.description}
                                            </Text>
                                            {place.structured_formatting?.secondary_text && (
                                                <Text style={styles.suggestionSecondary}>
                                                    {place.structured_formatting.secondary_text}
                                                </Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Quick Options */}
                        {suggestions.length === 0 && (
                            <>
                                {/* Use Current Location */}
                                <TouchableOpacity
                                    style={styles.optionItem}
                                    onPress={handleEnableLocation}
                                >
                                    <View style={styles.optionLeft}>
                                        <View style={[styles.optionIcon, { backgroundColor: '#E8F5E9' }]}>
                                            <Ionicons name="locate" size={22} color={COLORS.PRIMARY} />
                                        </View>
                                        <Text style={styles.optionText}>Use current location</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_SECONDARY} />
                                </TouchableOpacity>

                                {/* Saved Addresses */}
                                <View style={styles.savedAddresses}>
                                    <Text style={styles.savedTitle}>Your saved addresses</Text>

                                    {/* Sample Address */}
                                    <TouchableOpacity style={styles.addressCard}>
                                        <View style={styles.addressHeader}>
                                            <View style={styles.addressIconContainer}>
                                                <Ionicons name="home" size={24} color="#FFA000" />
                                            </View>
                                            <View style={styles.addressInfo}>
                                                <Text style={styles.addressType}>Home</Text>
                                                <Text style={styles.addressText}>
                                                    Floor 4, F 215 top floor managal bazar road, laxmi nagar, Bal bhavan public school ki band gali
                                                </Text>
                                                <Text style={styles.addressPhone}>Phone number: 9911881520</Text>
                                            </View>
                                        </View>
                                        <View style={styles.addressActions}>
                                            <TouchableOpacity style={styles.actionButton}>
                                                <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.TEXT_SECONDARY} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.actionButton}>
                                                <Ionicons name="share-outline" size={20} color={COLORS.TEXT_SECONDARY} />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    bottomSheet: {
        backgroundColor: '#F8F8F8',
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        maxHeight: '90%',
        minHeight: '70%',
    },
    closeButtonContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    closeButton: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFEBEE',
        marginHorizontal: scale(16),
        marginTop: verticalScale(8),
        padding: scale(12),
        borderRadius: scale(8),
    },
    bannerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bannerTextContainer: {
        marginLeft: scale(10),
        flex: 1,
    },
    bannerTitle: {
        fontSize: moderateScale(11), // Reduced font size
        fontWeight: '700',
        color: COLORS.BLACK,
    },
    bannerSubtitle: {
        fontSize: moderateScale(9), // Reduced font size
        color: COLORS.TEXT_SECONDARY,
        marginTop: verticalScale(2),
    },
    enableLocationButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingHorizontal: scale(12), // Reduced padding
        paddingVertical: verticalScale(4), // Reduced padding
        borderRadius: scale(6),
    },
    enableLocationText: {
        fontSize: moderateScale(11), // Reduced font size
        fontWeight: '600',
        color: COLORS.WHITE,
    },
    title: {
        fontSize: moderateScale(14), // Reduced font size
        fontWeight: '700',
        color: COLORS.BLACK,
        paddingHorizontal: scale(16),
        marginTop: verticalScale(12), // Reduced margin
        marginBottom: verticalScale(8), // Reduced margin
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(16),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(8), // Reduced padding
        borderRadius: scale(8),
        marginBottom: verticalScale(12),
    },
    searchInput: {
        flex: 1,
        fontSize: moderateScale(12), // Reduced font size
        color: COLORS.TEXT_PRIMARY,
        marginLeft: scale(10),
        padding: 0,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: verticalScale(20),
    },
    suggestions: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(16),
        borderRadius: scale(8),
        overflow: 'hidden',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: scale(12), // Reduced padding
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    suggestionText: {
        marginLeft: scale(12),
        flex: 1,
    },
    suggestionMain: {
        fontSize: moderateScale(12), // Reduced font size
        fontWeight: '600',
        color: COLORS.BLACK,
    },
    suggestionSecondary: {
        fontSize: moderateScale(10), // Reduced font size
        color: COLORS.TEXT_SECONDARY,
        marginTop: verticalScale(2),
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(16),
        marginBottom: verticalScale(8), // Reduced margin
        padding: scale(12), // Reduced padding
        borderRadius: scale(8),
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIcon: {
        width: scale(36), // Reduced size
        height: scale(36),
        borderRadius: scale(18),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    zomatoIcon: {
        fontSize: moderateScale(18),
    },
    optionText: {
        fontSize: moderateScale(12), // Reduced font size
        fontWeight: '500',
        color: COLORS.BLACK,
        flex: 1,
    },
    savedAddresses: {
        marginTop: verticalScale(8),
    },
    savedTitle: {
        fontSize: moderateScale(10), // Reduced font size
        color: COLORS.TEXT_SECONDARY,
        paddingHorizontal: scale(16),
        marginBottom: verticalScale(8), // Reduced margin
    },
    addressCard: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(16),
        padding: scale(12), // Reduced padding
        borderRadius: scale(8),
    },
    addressHeader: {
        flexDirection: 'row',
    },
    addressIconContainer: {
        width: scale(40), // Reduced size
        height: scale(40),
        borderRadius: scale(8),
        backgroundColor: '#FFF3E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    addressInfo: {
        flex: 1,
    },
    addressType: {
        fontSize: moderateScale(13), // Reduced font size
        fontWeight: '700',
        color: COLORS.BLACK,
        marginBottom: verticalScale(2),
    },
    addressText: {
        fontSize: moderateScale(10), // Reduced font size
        color: COLORS.TEXT_SECONDARY,
        lineHeight: moderateScale(14),
        marginBottom: verticalScale(4),
    },
    addressPhone: {
        fontSize: moderateScale(10), // Reduced font size
        color: COLORS.TEXT_SECONDARY,
    },
    addressActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: verticalScale(6),
        gap: scale(8),
    },
    actionButton: {
        padding: scale(4),
    },
});

export default LocationSelectionBottomSheet;
