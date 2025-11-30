import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import useAuthStore from '../stores/authStore';

// Auth Screens
import PhoneLoginScreen from '../screens/auth/PhoneLoginScreen';
import OTPVerifyScreen from '../screens/auth/OTPVerifyScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

// Main Screens
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const needsProfileSetup = useAuthStore(state => state.needsProfileSetup);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    // Auth Stack
                    <>
                        <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
                        <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} />
                    </>
                ) : needsProfileSetup ? (
                    // Profile Setup
                    <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
                ) : (
                    // Main App
                    <Stack.Screen name="Main" component={BottomTabNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
