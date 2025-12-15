import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    PermissionsAndroid,
    Platform,
    Linking,
    ActivityIndicator,
    ScrollView,
    Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';
import AddressDetailsBottomSheet from '../components/AddressDetailsBottomSheet';

const LocationConfirmScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationEnabled, setLocationEnabled] = useState(false);
    const { headerTitle, buttonText, initialLocation } = route.params || {};

    const [region, setRegion] = useState({
        latitude: initialLocation?.geometry?.location?.lat || 28.6139, // Use passed location or default to Delhi
        longitude: initialLocation?.geometry?.location?.lng || 77.2090,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });
    const searchTimeout = useRef(null);
    const mapRef = useRef(null);

    // Check if location is enabled
    useEffect(() => {
        checkLocationPermission();
    }, []);

    const checkLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            setLocationEnabled(granted);
        }
    };

    // Google Places Autocomplete (New API)
    const searchPlaces = async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                'https://places.googleapis.com/v1/places:autocomplete',
                {
                    input: query,
                    includedRegionCodes: ['in'],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                    },
                }
            );

            if (response.data.suggestions) {
                setSuggestions(response.data.suggestions);
            }
        } catch (error) {
            console.error('Places API error:', error.response?.data || error.message);
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

    const handleSelectSuggestion = async (suggestion) => {
        const placeId = suggestion.placePrediction.placeId;
        const description = suggestion.placePrediction.text.text;

        setSearchQuery(description);
        setSuggestions([]);
        Keyboard.dismiss();

        try {
            // Get place details for geometry (New API)
            const response = await axios.get(
                `https://places.googleapis.com/v1/places/${placeId}`,
                {
                    headers: {
                        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                        'X-Goog-FieldMask': 'location',
                    },
                }
            );

            if (response.data.location) {
                const { latitude, longitude } = response.data.location;
                const newRegion = {
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                };

                setRegion(newRegion);
                mapRef.current?.animateToRegion(newRegion, 1000);
            }
        } catch (error) {
            console.error('Place details error:', error.response?.data || error.message);
        }
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
        }
    };

    const handleConfirmLocation = () => {
        // Pass the selected location back to the previous screen
        if (route.params?.onLocationConfirm) {
            route.params.onLocationConfirm({
                latitude: region.latitude,
                longitude: region.longitude,
                address: 'Agra Division, Vrindavan, Uttar Pradesh, 281121, India', // Sample address
            });
        }
        navigation.goBack();
    };

    const handleUseCurrentLocation = () => {
        if (!locationEnabled) {
            handleEnableLocation();
        } else {
            // Get current location and update region
            // This would require Geolocation API implementation
            console.log('Getting current location...');
        }
    };

    // Force light mode map style
    const customMapStyle = [
        {
            "elementType": "geometry",
            "stylers": [{ "color": "#f5f5f5" }]
        },
        {
            "elementType": "labels.icon",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#616161" }]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#f5f5f5" }]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#bdbdbd" }]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{ "color": "#eeeeee" }]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#757575" }]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{ "color": "#e5e5e5" }]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9e9e9e" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#ffffff" }]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#757575" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{ "color": "#dadada" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#616161" }]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9e9e9e" }]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [{ "color": "#e5e5e5" }]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [{ "color": "#eeeeee" }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#c9c9c9" }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9e9e9e" }]
        }
    ];



    const [showAddressDetails, setShowAddressDetails] = useState(false);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={22} color={COLORS.BLACK} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{headerTitle || 'Confirm location'}</Text>
            </View>

            {/* ... (Search Bar and other content remain same) ... */}

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color={COLORS.TEXT_SECONDARY} />
                <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholder="Search for a new area, locality..."
                    placeholderTextColor={COLORS.TEXT_SECONDARY}
                />
                {loading && <ActivityIndicator size="small" color={COLORS.PRIMARY} />}
            </View>

            {/* Suggestions List */}
            {suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        {suggestions.map((item, index) => {
                            const prediction = item.placePrediction;
                            return (
                                <TouchableOpacity
                                    key={prediction.placeId || index}
                                    style={styles.suggestionItem}
                                    onPress={() => handleSelectSuggestion(item)}
                                >
                                    <Ionicons name="location-outline" size={18} color={COLORS.PRIMARY} />
                                    <View style={styles.suggestionText}>
                                        <Text style={styles.suggestionMain}>
                                            {prediction.text.text}
                                        </Text>
                                        {prediction.structuredFormat?.secondaryText?.text && (
                                            <Text style={styles.suggestionSecondary}>
                                                {prediction.structuredFormat.secondaryText.text}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

            {/* Location Permission Banner */}
            {!locationEnabled && (
                <View style={styles.banner}>
                    <View style={styles.bannerLeft}>
                        <Ionicons name="location-outline" size={20} color="#E53935" />
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

            {/* Map View */}
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={region}
                    onRegionChangeComplete={setRegion}
                    showsUserLocation={locationEnabled}
                    showsMyLocationButton={false}
                    customMapStyle={customMapStyle}
                >
                    {/* Center marker that stays fixed */}
                </MapView>

                {/* Fixed Center Marker */}
                <View style={styles.centerMarkerContainer} pointerEvents="none">
                    <View style={styles.marker}>
                        <Ionicons name="location" size={36} color={COLORS.PRIMARY} />
                    </View>
                    <View style={styles.markerShadow} />
                </View>

                {/* Tooltip */}
                <View style={styles.tooltipContainer} pointerEvents="none">
                    <View style={styles.tooltip}>
                        <Text style={styles.tooltipText}>Move the pin to adjust your location</Text>
                    </View>
                    <View style={styles.tooltipArrow} />
                </View>

                {/* Use Current Location Button */}
                <TouchableOpacity
                    style={styles.useCurrentLocationButton}
                    onPress={handleEnableLocation}
                >
                    <Ionicons name="locate" size={20} color={COLORS.PRIMARY} />
                    <Text style={styles.useCurrentLocationText}>Use current location</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Sheet Content */}
            <View style={[styles.bottomContent, { paddingBottom: insets.bottom + 10 }]}>
                <View style={styles.addressContainer}>
                    <View style={styles.addressHeader}>
                        <View style={styles.addressIcon}>
                            <Ionicons name="location" size={24} color={COLORS.PRIMARY} />
                        </View>
                        <View style={styles.addressTextContainer}>
                            <Text style={styles.addressTitle}>Select delivery location</Text>
                            <Text style={styles.addressSubtitle}>
                                {searchQuery || "Adjust pin to select location"}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.changeButton}>
                            <Text style={styles.changeButtonText}>Change</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => setShowAddressDetails(true)}
                >
                    <Text style={styles.confirmButtonText}>{buttonText || 'Confirm Location'}</Text>
                </TouchableOpacity>
            </View>

            {/* Address Details Bottom Sheet */}
            <AddressDetailsBottomSheet
                visible={showAddressDetails}
                onClose={() => setShowAddressDetails(false)}
                addressData={{
                    mainText: searchQuery || "Selected Location",
                    region: region
                }}
                onSave={(details) => {
                    console.log('Address Saved:', details);
                    setShowAddressDetails(false);
                    if (route.params?.onLocationConfirm) {
                        route.params.onLocationConfirm(details);
                    }
                    navigation.goBack();
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingBottom: verticalScale(12), // Increased padding
        paddingTop: verticalScale(8), // Added top padding
        backgroundColor: COLORS.WHITE,
        zIndex: 1,
    },
    backButton: {
        padding: scale(4),
    },
    headerTitle: {
        fontSize: moderateScale(16), // Increased font size slightly
        fontWeight: '600',
        color: COLORS.BLACK,
        marginLeft: scale(12),
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        marginHorizontal: scale(16),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(4), // Reduced vertical padding to accommodate larger input height
        borderRadius: scale(12),
        marginBottom: verticalScale(12),
        zIndex: 10, // Ensure it's above everything
        elevation: 5, // For Android
    },
    searchInput: {
        flex: 1,
        fontSize: moderateScale(14),
        color: COLORS.TEXT_PRIMARY,
        marginLeft: scale(8),
        padding: 0,
        height: verticalScale(40), // Increased explicit height for better touch target
    },
    suggestionsContainer: {
        position: 'absolute',
        top: verticalScale(100) + (Platform.OS === 'ios' ? 44 : 0), // Adjusted top
        left: scale(16),
        right: scale(16),
        backgroundColor: COLORS.WHITE,
        borderRadius: scale(8),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        zIndex: 1000,
        maxHeight: verticalScale(200),
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: scale(10), // Reduced padding
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    suggestionText: {
        marginLeft: scale(10),
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
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFEBEE',
        marginHorizontal: scale(16),
        marginBottom: verticalScale(8),
        padding: scale(10), // Reduced padding
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
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    centerMarkerContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -18, // Half of icon size
        marginTop: -36, // Full icon size
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    marker: {
        marginBottom: 4,
    },
    markerShadow: {
        width: 8,
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 4,
    },
    tooltipContainer: {
        position: 'absolute',
        top: '42%',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 2,
    },
    tooltip: {
        backgroundColor: '#333',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
        borderRadius: scale(20),
    },
    tooltipText: {
        color: COLORS.WHITE,
        fontSize: moderateScale(10), // Reduced font size
        fontWeight: '500',
    },
    tooltipArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#333',
    },
    useCurrentLocationButton: {
        position: 'absolute',
        bottom: verticalScale(20),
        right: scale(16),
        backgroundColor: COLORS.WHITE,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(12), // Reduced padding
        paddingVertical: verticalScale(8), // Reduced padding
        borderRadius: scale(20),
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    useCurrentLocationText: {
        marginLeft: scale(6),
        fontSize: moderateScale(11), // Reduced font size
        fontWeight: '600',
        color: COLORS.PRIMARY,
    },
    bottomContent: {
        backgroundColor: COLORS.WHITE,
        borderTopLeftRadius: scale(16),
        borderTopRightRadius: scale(16),
        padding: scale(16),
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    addressContainer: {
        marginBottom: verticalScale(16),
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    addressIcon: {
        marginRight: scale(12),
        marginTop: verticalScale(2),
    },
    addressTextContainer: {
        flex: 1,
    },
    addressTitle: {
        fontSize: moderateScale(14), // Reduced font size
        fontWeight: '700',
        color: COLORS.BLACK,
        marginBottom: verticalScale(2),
    },
    addressSubtitle: {
        fontSize: moderateScale(11), // Reduced font size
        color: COLORS.TEXT_SECONDARY,
        lineHeight: moderateScale(16),
    },
    changeButton: {
        padding: scale(4),
    },
    changeButtonText: {
        fontSize: moderateScale(11), // Reduced font size
        fontWeight: '600',
        color: COLORS.PRIMARY,
    },
    confirmButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: verticalScale(12), // Reduced padding
        borderRadius: scale(8),
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: moderateScale(14), // Reduced font size
        fontWeight: '600',
        color: COLORS.WHITE,
    },
});

export default LocationConfirmScreen;
