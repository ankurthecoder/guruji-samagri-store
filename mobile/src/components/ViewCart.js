import React, { useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    Image,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import useUIStore from "../stores/uiStore";

const CartBubble = ({
    visible = true,
    itemCount = 0,
    totalText = "View cart",
    subText = "0 items",
    thumbnails = ['https://picsum.photos/id/237/200/300', 'https://picsum.photos/seed/picsum/200/300', 'https://picsum.photos/id/237/200/300'],
    onPress = () => { },
}) => {
    const insets = useSafeAreaInsets();
    const isTabBarVisible = useUIStore(state => state.isTabBarVisible);

    // Animation values
    const translateY = useRef(new Animated.Value(0)).current;
    const positionY = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        // Entrance/Exit animation
        Animated.spring(translateY, {
            toValue: visible ? 0 : 140,
            useNativeDriver: true,
            damping: 12,
            stiffness: 120,
        }).start();
    }, [visible, translateY]);

    React.useEffect(() => {
        // Position animation based on Tab Bar visibility
        // If tab bar is visible, move up by ~60px (tab bar height)
        // If tab bar is hidden, move down to 0 (default bottom position)
        Animated.timing(positionY, {
            toValue: isTabBarVisible ? -60 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isTabBarVisible, positionY]);

    const thumbToShow = thumbnails.slice(0, 3);

    return (
        <Animated.View
            pointerEvents={visible ? "auto" : "none"}
            style={[
                styles.container,
                {
                    transform: [
                        { translateY: Animated.add(translateY, positionY) }
                    ],
                    bottom: insets.bottom + 16,
                },
            ]}
        >
            <Pressable style={styles.bubble} onPress={onPress}>
                <View style={styles.left}>
                    <View style={styles.thumbStack}>
                        {thumbToShow.map((uri, i) => (
                            <Image
                                key={i}
                                source={{ uri }}
                                style={[styles.thumb, { left: i * 18, zIndex: thumbToShow.length - i }]}
                                resizeMode="cover"
                            />
                        ))}
                        {thumbToShow.length === 0 && (
                            <View style={[styles.thumb, styles.thumbPlaceholder]}>
                                <Text style={styles.thumbPlaceholderText}>🛒</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.middle}>
                    <Text style={styles.title}>{totalText}</Text>
                    <Text style={styles.subtitle}>{subText}</Text>
                </View>

                <View style={styles.right}>

                    <View style={styles.chev}>
                        <Text style={styles.chevText}>›</Text>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 16,
        right: 16,
        // bottom set dynamically with safe area
        zIndex: 9999,
        alignItems: "center",
    },
    bubble: {
        width: "65%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1F9F28", // green base (use your theme color)
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 999,
        // shadow iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        // elevation Android
        elevation: 10,
    },
    left: {
        width: 85,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 2,
    },
    thumbStack: {
        width: 56,
        height: 40,
        position: "relative",
    },
    thumb: {
        position: "absolute",
        width: 40,
        height: 40,
        borderRadius: 20,       // CIRCLE
        borderWidth: 2,
        borderColor: "#FFFFFF",
        backgroundColor: "#EEE",
    },

    thumbPlaceholder: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff33",
        borderRadius: 20,       // also circle
    },

    thumbPlaceholderText: {
        fontSize: 18,
        color: "#fff",
    },
    middle: {
        flex: 1,
        paddingLeft: 8,
        justifyContent: "center",
    },
    title: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    subtitle: {
        color: "#ffffffcc",
        fontSize: 12,
        marginTop: 1,
    },
    right: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 6,
    },
    countWrap: {
        backgroundColor: "#fff",
        minWidth: 36,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    countText: {
        color: "#0C831F",
        fontWeight: "700",
        fontSize: 13,
    },
    chev: {
        width: 34,
        height: 34,
        borderRadius: 34,
        backgroundColor: "#ffffff22",
        alignItems: "center",
        justifyContent: "center",
    },
    chevText: {
        color: "#fff",
        fontSize: 22,
        lineHeight: Platform.OS === "ios" ? 24 : 22,
        fontWeight: "600",
    },
});

export default CartBubble;
