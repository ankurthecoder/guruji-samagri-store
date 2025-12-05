import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import OrderAgainScreen from '../screens/OrderAgainScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import AccountScreen from '../screens/AccountScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useUIStore from '../stores/uiStore';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const CategoriesStack = createStackNavigator();

// Home Stack Navigator
const HomeStackNavigator = () => {
    return (
        <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="HomeMain" component={HomeScreen} />
            <HomeStack.Screen name="Search" component={SearchScreen} />
            <HomeStack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <HomeStack.Screen name="Cart" component={CartScreen} />
        </HomeStack.Navigator>
    );
};

// Categories Stack Navigator
const CategoriesStackNavigator = () => {
    return (
        <CategoriesStack.Navigator screenOptions={{ headerShown: false }}>
            <CategoriesStack.Screen name="CategoriesMain" component={CategoriesScreen} />
            <CategoriesStack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
        </CategoriesStack.Navigator>
    );
};

// Custom Animated Tab Bar
const AnimatedTabBar = (props) => {
    const isTabBarVisible = useUIStore(state => state.isTabBarVisible);
    const translateY = useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();
    const TAB_BAR_HEIGHT = 60 + insets.bottom; // Adjust based on safe area

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: isTabBarVisible ? 0 : TAB_BAR_HEIGHT,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isTabBarVisible, translateY, TAB_BAR_HEIGHT]);

    return (
        <Animated.View
            style={[
                styles.tabBarContainer,
                {
                    transform: [{ translateY }],
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                },
            ]}>
            <BottomTabBar {...props} />
        </Animated.View>
    );
};

const BottomTabNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            tabBar={props => <AnimatedTabBar {...props} />}
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#0C831F', // Blinkit Green
                tabBarInactiveTintColor: '#666',
                tabBarStyle: {
                    paddingBottom: Platform.OS === 'ios' ? 0 : 5 + insets.bottom, // Add bottom padding for Android
                    paddingTop: 5,
                    height: 60 + (Platform.OS === 'ios' ? 0 : insets.bottom), // Increase height to accommodate padding
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E0E0E0',
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginBottom: Platform.OS === 'ios' ? 0 : 5, // Adjust label position
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Order Again') {
                        iconName = focused ? 'bag-handle' : 'bag-handle-outline';
                    } else if (route.name === 'Categories') {
                        iconName = focused ? 'grid' : 'grid-outline';
                    } else if (route.name === 'Account') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen name="Order Again" component={OrderAgainScreen} />
            <Tab.Screen name="Categories" component={CategoriesStackNavigator} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarContainer: {
        backgroundColor: 'transparent',
        elevation: 0,
    },
});

export default BottomTabNavigator;

