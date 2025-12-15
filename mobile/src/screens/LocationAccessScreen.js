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
//import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

let promptForEnableLocationIfNeeded;

if (Platform.OS === 'android') {
    promptForEnableLocationIfNeeded =
        require('react-native-android-location-enabler')
            .promptForEnableLocationIfNeeded;
}

// Generic city illustration placeholder
// In a real app, this would be a local asset or a specific URL
const ILLUSTRATION_IMAGE = 'https://img.freepik.com/free-vector/city-skyline-concept-illustration_114360-8923.jpg';

const LocationAccessScreen = () => {
    const navigation = useNavigation();

    const handleEnableLocation = async () => {
        if (Platform.OS === 'android') {
            try {
                // 1️⃣ Permission
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message:
                            'Guruji Samagri Store needs access to your location to show relevant stores and products.',
                        buttonPositive: 'Allow',
                        buttonNegative: 'Cancel',
                    }
                );

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                        Linking.openSettings();
                    }
                    return;
                }

                // 2️⃣ Blinkit-style GPS enable modal
                try {
                    await promptForEnableLocationIfNeeded({
                        interval: 10000,
                        fastInterval: 5000,
                    });
                } catch (e) {
                    // User tapped "No thanks"
                    return;
                }

                // 3️⃣ Get location
                setLoading(true);
                Geolocation.getCurrentPosition(
                    (position) => {
                        setLoading(false);
                        setLocationEnabled(true);
                        handleLocationFound(position);
                    },
                    (error) => {
                        setLoading(false);
                        console.log('Location error:', error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000,
                    }
                );
            } catch (error) {
                setLoading(false);
                console.error('Location flow error:', error);
            }
        } else {
            // iOS (no system GPS modal exists)
            Geolocation.requestAuthorization();
            setLoading(true);
            Geolocation.getCurrentPosition(
                (position) => {
                    setLoading(false);
                    handleLocationFound(position);
                },
                (error) => {
                    setLoading(false);
                    console.log(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                }
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
