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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS } from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';

/* ✅ Android-only safe import */
let promptForEnableLocationIfNeeded;
if (Platform.OS === 'android') {
    promptForEnableLocationIfNeeded =
        require('react-native-android-location-enabler').promptForEnableLocationIfNeeded;
}

const LocationSearchScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchTimeout = useRef(null);

    /* ---------------- Permissions ---------------- */

    const requestLocationPermission = async () => {
        const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message:
                    'Guruji Samagri Store needs your location to show nearby stores',
                buttonPositive: 'Allow',
                buttonNegative: 'Cancel',
            }
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }

        if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Linking.openSettings();
        }

        return false;
    };

    /* ---------------- Enable + Fetch Location ---------------- */

    const handleEnableLocation = async () => {
        if (Platform.OS === 'android') {
            const permissionGranted = await requestLocationPermission();
            if (!permissionGranted) return;

            try {
                // ✅ Blinkit-style GPS enable modal
                await promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 });

                setLoading(true);
                Geolocation.getCurrentPosition(
                    position => {
                        setLoading(false);
                        navigateToConfirm(position);
                    },
                    error => {
                        setLoading(false);
                        console.log('Location error:', error);
                    },
                    { enableHighAccuracy: true, timeout: 15000 }
                );
            } catch (err) {
                // User cancelled GPS enable dialog → stay on same screen
                console.log('GPS not enabled:', err);
            }
        } else {
            // iOS
            Geolocation.requestAuthorization();
            setLoading(true);
            Geolocation.getCurrentPosition(
                position => {
                    setLoading(false);
                    navigateToConfirm(position);
                },
                error => {
                    setLoading(false);
                    console.log(error);
                },
                { enableHighAccuracy: true }
            );
        }
    };

    const navigateToConfirm = position => {
        navigation.navigate('LocationConfirmRoot', {
            initialLocation: {
                placeId: 'current_location',
                description: 'Current Location',
                geometry: {
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                },
            },
        });
    };

    /* ---------------- Google Places ---------------- */

    const searchPlaces = async text => {
        if (!text || text.length < 3) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                'https://places.googleapis.com/v1/places:autocomplete',
                { input: text, includedRegionCodes: ['in'] },
                {
                    headers: {
                        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setSuggestions(res.data.suggestions || []);
        } catch (e) {
            console.log('Places error:', e.response?.data || e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = text => {
        setSearchQuery(text);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => searchPlaces(text), 400);
    };

    /* ---------------- UI ---------------- */

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />

            <View style={[styles.header, { marginTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Search your location</Text>
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={20} />
                <TextInput
                    placeholder="Search area, street name…"
                    value={searchQuery}
                    onChangeText={handleSearch}
                    style={styles.input}
                    autoFocus
                />
            </View>

            {loading && <ActivityIndicator style={{ marginTop: 16 }} />}

            <TouchableOpacity style={styles.currentLocation} onPress={handleEnableLocation}>
                <Ionicons name="locate" size={22} color={COLORS.PRIMARY} />
                <Text style={styles.currentLocationText}>Use current location</Text>
                <Ionicons name="chevron-forward" />
            </TouchableOpacity>

            <ScrollView>
                {suggestions.map((item, i) => {
                    const p = item.placePrediction;
                    return (
                        <TouchableOpacity
                            key={p.placeId || i}
                            style={styles.suggestion}
                            onPress={() =>
                                navigation.navigate('LocationConfirmRoot', {
                                    initialLocation: {
                                        placeId: p.placeId,
                                        description: p.text.text,
                                    },
                                })
                            }
                        >
                            <Ionicons name="location-outline" size={18} />
                            <View>
                                <Text>{p.structuredFormat?.mainText?.text}</Text>
                                <Text style={styles.subText}>
                                    {p.structuredFormat?.secondaryText?.text}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: { flexDirection: 'row', padding: 16, backgroundColor: '#fff' },
    headerTitle: { marginLeft: 12, fontSize: 16, fontWeight: '500' },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 16,
        padding: 12,
        borderRadius: 12,
    },
    input: { flex: 1, marginLeft: 8 },
    currentLocation: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    currentLocationText: {
        flex: 1,
        marginLeft: 12,
        fontWeight: '600',
        color: COLORS.PRIMARY,
    },
    suggestion: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    subText: { fontSize: 12, color: '#777' },
});

export default LocationSearchScreen;
