import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { COLORS } from '../../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    keyboardType = 'default',
    maxLength,
    autoCapitalize = 'sentences',
    editable = true,
    multiline = false,
    numberOfLines = 1,
    secureTextEntry = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[
                styles.inputWrapper,
                isFocused && styles.inputWrapperFocused,
                !editable && styles.inputWrapperDisabled
            ]}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={isFocused ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={[
                        styles.input,
                        multiline && styles.inputMultiline,
                        !icon && styles.inputNoIcon
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.TEXT_SECONDARY}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    autoCapitalize={autoCapitalize}
                    editable={editable}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    secureTextEntry={secureTextEntry}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: verticalScale(16),
    },
    label: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: verticalScale(8),
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE,
        borderRadius: scale(12),
        borderWidth: 1.5,
        borderColor: COLORS.BORDER,
        paddingHorizontal: scale(14),
        paddingVertical: Platform.OS === 'ios' ? verticalScale(14) : verticalScale(8),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputWrapperFocused: {
        borderColor: COLORS.PRIMARY,
        backgroundColor: COLORS.WHITE,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputWrapperDisabled: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E0E0E0',
    },
    icon: {
        marginRight: scale(10),
    },
    input: {
        flex: 1,
        fontSize: moderateScale(14),
        color: COLORS.TEXT_PRIMARY,
        padding: 0,
        margin: 0,
    },
    inputNoIcon: {
        marginLeft: 0,
    },
    inputMultiline: {
        minHeight: verticalScale(80),
        textAlignVertical: 'top',
    },
});

export default CustomInput;
