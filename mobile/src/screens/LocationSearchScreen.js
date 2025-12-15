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
    StatusBar,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';
// import useUIStore from '../stores/uiStore'; // Not strictly needed for a full screen unless we want to control tab bar globally, but standard navigation usually hides tabs for stack screens if configured.

const LocationSearchScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationEnabled, setLocationEnabled] = useState(false);
    const searchTimeout = useRef(null);

    // Initial permission check
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
            console.log('Fetching predictions for:', query, 'Key:', GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing');
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

            console.log('Places Response:', response.data);

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

    const handleEnableLocation = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'Guruji Samagri Store needs access to your location to show relevant stores and products.',
                        buttonPositive: 'OK',
                        buttonNegative: 'Cancel',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    setLoading(true);
                    try {
                        const enableResult = await promptForEnableLocationIfNeeded();
                        console.log('Location Enable Result:', enableResult);

                        Geolocation.getCurrentPosition(
                            (position) => {
                                setLoading(false);
                                setLocationEnabled(true);
                                handleLocationFound(position);
                            },
                            (error) => {
                                setLoading(false);
                                console.log(error.code, error.message);
                            },
                            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                        );
                    } catch (error) {
                        setLoading(false);
                        console.log('Location Enable Error:', error);
                    }
                } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    Linking.openSettings();
                } else {
                    console.log('Location permission denied');
                }
            } catch (error) {
                console.error('Permission error:', error);
                setLoading(false);
            }
        } else {
            // iOS
            Geolocation.requestAuthorization();
            Geolocation.getCurrentPosition(
                (position) => {
                    handleLocationFound(position);
                },
                (error) => {
                    console.log(error);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
    };

    const handleLocationFound = (position) => {
        const locationData = {
            placeId: 'current_location',
            description: 'Current Location',
            mainText: 'Current Location',
            geometry: {
                location: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }
            }
        };
        // Navigate to Confirm Screen with location data
        navigation.navigate('LocationConfirmRoot', {
            onLocationConfirm: (confirmedLocation) => {
                // This callback might be complex via navigation params depending on how LocationConfirmScreen works.
                // Usually we pass initialLocation params to the screen.
                // Assuming LocationConfirmScreen takes 'location' or similar and handles the confirmation itself (e.g. updating store).
                // Or if it expects a callback, we can't easily pass functions via navigation.
                // Best practice: LocationConfirmScreen updates the store/global state upon confirmation.
                // For now, let's pass the location data it needs to display the map.
                console.log('Confirmed via search:', confirmedLocation);
            },
            // Pass the location data so the map centers on it
            initialLocation: locationData
        });
    };

    const handleSelectSuggestion = (suggestion) => {
        const placeId = suggestion.placePrediction.placeId;
        const description = suggestion.placePrediction.text.text;

        // Pass the full suggestion object or just what's needed for display
        // We'll fetch details here to get geometry for the next screen
        fetchPlaceDetails(placeId, description);
    };

    const fetchPlaceDetails = async (placeId, description) => {
        setLoading(true);
        try {
            // Get place details for geometry (New API)
            const response = await axios.get(
                `https://places.googleapis.com/v1/places/${placeId}`,
                {
                    headers: {
                        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                        'X-Goog-FieldMask': 'location,formattedAddress',
                    },
                }
            );

            if (response.data.location) {
                const { latitude, longitude } = response.data.location;
                const formattedAddress = response.data.formattedAddress || description;

                const locationData = {
                    placeId: placeId,
                    description: formattedAddress,
                    mainText: description,
                    geometry: {
                        location: {
                            lat: latitude,
                            lng: longitude
                        }
                    }
                };

                navigation.navigate('LocationConfirmRoot', {
                    initialLocation: locationData
                });
            }
        } catch (error) {
            console.error('Place Details API error:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />

            {/* Header */}
            <View style={[styles.header, { marginTop: insets.top }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Search your location</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
                <Ionicons name="search-outline" size={20} color={COLORS.TEXT_SECONDARY} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for area, street name..."
                    placeholderTextColor={COLORS.TEXT_SECONDARY}
                    value={searchQuery}
                    onChangeText={handleSearch}
                    autoFocus={true}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch('')}>
                        <Ionicons name="close-circle" size={18} color={COLORS.TEXT_SECONDARY} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                style={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Loading Indicator */}
                {loading && (
                    <ActivityIndicator size="small" color={COLORS.PRIMARY} style={styles.loader} />
                )}

                {/* Use Current Location - Always visible as per request */}
                <TouchableOpacity
                    style={styles.currentLocationButton}
                    onPress={handleEnableLocation}
                >
                    <View style={styles.currentLocationIcon}>
                        <Ionicons name="locate" size={22} color={COLORS.PRIMARY} />
                    </View>
                    <Text style={styles.currentLocationText}>Use current location</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_SECONDARY} />
                </TouchableOpacity>

                {/* Suggestions List */}
                {suggestions.length > 0 ? (
                    <View style={styles.suggestionsContainer}>
                        {suggestions.map((item, index) => {
                            const prediction = item.placePrediction;
                            return (
                                <TouchableOpacity
                                    key={prediction.placeId || index}
                                    style={styles.suggestionItem}
                                    onPress={() => handleSelectSuggestion(item)}
                                >
                                    <View style={styles.suggestionIconContainer}>
                                        <Ionicons name="location-outline" size={20} color={COLORS.TEXT_SECONDARY} />
                                    </View>
                                    <View style={styles.suggestionTextContainer}>
                                        <Text style={styles.suggestionMain}>
                                            {prediction.structuredFormat?.mainText?.text || prediction.text.text}
                                        </Text>
                                        <Text style={styles.suggestionSecondary}>
                                            {prediction.structuredFormat?.secondaryText?.text || ''}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ) : (
                    /* Saved Addresses - Only show when NO suggestions */
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Your saved addresses</Text>
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
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA', // Light greyish background like screenshot
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        backgroundColor: COLORS.WHITE,
    },
    backButton: {
        padding: scale(4),
        marginRight: scale(12),
    },
    headerTitle: {
        fontSize: moderateScale(16),
        fontWeight: '500',
        color: COLORS.BLACK,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
        margin: scale(16),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(Platform.OS === 'ios' ? 12 : 4),
        borderRadius: scale(12),
        borderWidth: 1,
        borderColor: '#EEEEEE',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: scale(10),
        fontSize: moderateScale(14),
        color: COLORS.BLACK,
    },
    content: {
        flex: 1,
    },
    loader: {
        marginTop: verticalScale(20),
    },
    currentLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
        padding: scale(16),
        marginTop: verticalScale(8),
        marginHorizontal: scale(16),
        borderRadius: scale(12),
    },
    currentLocationIcon: {
        marginRight: scale(12),
    },
    currentLocationText: {
        flex: 1,
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: COLORS.PRIMARY, // Usually green in Blinkit
    },
    suggestionsContainer: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(16),
        marginTop: verticalScale(8),
        borderRadius: scale(12),
        paddingVertical: verticalScale(8),
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    suggestionIconContainer: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    suggestionTextContainer: {
        flex: 1,
    },
    suggestionMain: {
        fontSize: moderateScale(14),
        fontWeight: '500',
        color: COLORS.BLACK,
        marginBottom: verticalScale(2),
    },
    suggestionSecondary: {
        fontSize: moderateScale(12),
        color: COLORS.TEXT_SECONDARY,
    },
    sectionContainer: {
        marginTop: verticalScale(16),
    },
    sectionTitle: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: COLORS.TEXT_SECONDARY,
        marginLeft: scale(16),
        marginBottom: verticalScale(8),
    },
    addressCard: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: scale(16),
        padding: scale(12),
        borderRadius: scale(8),
    },
    addressHeader: {
        flexDirection: 'row',
    },
    addressIconContainer: {
        width: scale(40),
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
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: COLORS.BLACK,
        marginBottom: verticalScale(2),
    },
    addressText: {
        fontSize: moderateScale(10),
        color: COLORS.TEXT_SECONDARY,
        lineHeight: moderateScale(14),
        marginBottom: verticalScale(4),
    },
    addressPhone: {
        fontSize: moderateScale(10),
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

export default LocationSearchScreen;
