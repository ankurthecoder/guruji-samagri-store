import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Animated, View, Text, Image } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BootSplash from "react-native-bootsplash";

const App = () => {
    const [showSplash, setShowSplash] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const textTranslateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        // Hide the native splash screen immediately
        BootSplash.hide({ fade: true });

        // Step 1: Fade in the brand text
        Animated.parallel([
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 800,
                delay: 400,
                useNativeDriver: true,
            }),
            Animated.timing(textTranslateY, {
                toValue: 0,
                duration: 800,
                delay: 400,
                useNativeDriver: true,
            }),
        ]).start();

        // Step 2: Fade out the entire splash screen after showing text
        const hideTimeout = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }).start(() => {
                setShowSplash(false);
            });
        }, 2500);

        return () => clearTimeout(hideTimeout);
    }, []);

    return (
        <View style={styles.root}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaView style={styles.container}>
                    <AppNavigator />
                </SafeAreaView>
            </GestureHandlerRootView>

            {showSplash && (
                <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
                    <View style={styles.centerContent}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('./src/assets/images/logo.png')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Animated.View style={{
                            opacity: textOpacity,
                            transform: [{ translateY: textTranslateY }],
                            alignItems: 'center'
                        }}>
                            <Text style={styles.brandText}>Guruji Samagri Store</Text>
                            <View style={styles.divider} />
                            <Text style={styles.tagline}>One App for all your Puja Needs</Text>
                        </Animated.View>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    splashContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    brandText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0C831F',
        marginTop: 10,
        letterSpacing: 0.5,
    },
    divider: {
        height: 2,
        width: 50,
        backgroundColor: '#F7CA00',
        marginVertical: 12,
        borderRadius: 1,
    },
    tagline: {
        fontSize: 14,
        color: '#888888',
        letterSpacing: 0.5,
        fontWeight: '400',
        fontStyle: 'italic',
    }
});

export default App;
