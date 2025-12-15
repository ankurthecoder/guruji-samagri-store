import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
    SafeAreaView,
    Platform
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

// Generic city illustration placeholder
// In a real app, this would be a local asset or a specific URL
const ILLUSTRATION_IMAGE = 'https://img.freepik.com/free-vector/city-skyline-concept-illustration_114360-8923.jpg';

const LocationAccessScreen = () => {
    const navigation = useNavigation();

    const handleEnableLocation = async () => {
        if (Platform.OS === 'android') {
            try {
                // Request enablement (assuming permissions are handled or will be prompted)
                // Integrating logic similar to LocationSearchScreen for consistency
                // For this screen, we might just want to trigger the "Enable Location" flow
                const enableResult = await promptForEnableLocationIfNeeded();
                console.log('Location Enable Result:', enableResult);

                Geolocation.getCurrentPosition(
                    (position) => {
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
                        navigation.navigate('LocationConfirmRoot', {
                            initialLocation: locationData
                        });
                    },
                    (error) => {
                        console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );

            } catch (error) {
                console.log('Location Enable Error:', error);
            }
        } else {
            Geolocation.requestAuthorization();
            Geolocation.getCurrentPosition(
                (position) => {
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
                    navigation.navigate('LocationConfirmRoot', {
                        initialLocation: locationData
                    });
                },
                (error) => console.log(error),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
    };

    const handleManualEntry = () => {
        navigation.navigate('LocationSearchScreen');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />

            <View style={styles.contentContainer}>
                {/* Header Text */}
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>What's your location?</Text>
                    <Text style={styles.subtitle}>
                        We need your location to show you our serviceable hubs.
                    </Text>
                </View>

                {/* Illustration */}
                <View style={styles.illustrationContainer}>
                    {/* Using an icon as a placeholder for the cityscape if image fails or as preferred vector graphic */}
                    {/* <Image 
                        source={{ uri: ILLUSTRATION_IMAGE }} 
                        style={styles.image} 
                        resizeMode="contain"
                    /> */}
                    <Ionicons name="business" size={scale(150)} color="#E0E0E0" />
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleEnableLocation}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name="locate" size={20} color={COLORS.WHITE} />
                        </View>
                        <Text style={styles.primaryButtonText}>Use current location</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={handleManualEntry}
                    >
                        <Text style={styles.secondaryButtonText}>Enter location manually</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: scale(20),
        justifyContent: 'space-between',
        paddingVertical: verticalScale(40),
    },
    headerContainer: {
        marginTop: verticalScale(20),
    },
    title: {
        fontSize: moderateScale(24),
        fontWeight: '700',
        color: COLORS.BLACK,
        marginBottom: verticalScale(8),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: moderateScale(14),
        color: COLORS.TEXT_SECONDARY,
        textAlign: 'center',
        lineHeight: verticalScale(20),
    },
    illustrationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        width: '100%',
        gap: verticalScale(16),
        marginBottom: verticalScale(20),
    },
    primaryButton: {
        backgroundColor: COLORS.PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(14),
        borderRadius: scale(12),
        elevation: 2,
    },
    iconContainer: {
        marginRight: scale(8),
    },
    primaryButtonText: {
        color: COLORS.WHITE,
        fontSize: moderateScale(16),
        fontWeight: '700',
    },
    secondaryButton: {
        paddingVertical: verticalScale(12),
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: COLORS.PRIMARY,
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
});

export default LocationAccessScreen;
