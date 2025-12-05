import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS, SIZES } from '../constants/colors';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * AccordionSection Component
 * Reusable accordion with smooth expand/collapse animation
 * 
 * @param {string} title - Section title
 * @param {ReactNode} children - Content to show when expanded
 * @param {boolean} defaultExpanded - Initial expanded state
 */
const AccordionSection = ({ title, children, defaultExpanded = false }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const [rotateValue] = useState(new Animated.Value(defaultExpanded ? 1 : 0));

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);

        Animated.timing(rotateValue, {
            toValue: expanded ? 0 : 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const rotation = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={toggleExpand}
                activeOpacity={0.7}
            >
                <Text style={styles.title}>{title}</Text>
                <Animated.Text
                    style={[styles.arrow, { transform: [{ rotate: rotation }] }]}
                >
                    ▼
                </Animated.Text>
            </TouchableOpacity>

            {expanded && (
                <View style={styles.content}>
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
        backgroundColor: COLORS.WHITE,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(16),
    },
    title: {
        fontSize: SIZES.FONT_LG,
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
        flex: 1,
    },
    arrow: {
        fontSize: moderateScale(14),
        color: COLORS.TEXT_SECONDARY,
        marginLeft: scale(8),
    },
    content: {
        paddingHorizontal: scale(16),
        paddingBottom: verticalScale(16),
    },
});

export default AccordionSection;
