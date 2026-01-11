import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SIZES } from '../../../constants/colors';
import { sanitizeUrl } from '../../../utils/urlHelper';

const { width } = Dimensions.get('window');

const Type1Section = ({ section }) => {
    if (!section.image) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    // Navigate to products or category if linked
                    console.log('Exclusive Section Pressed:', section.title);
                }}
            >
                <Image
                    source={{ uri: sanitizeUrl(section.image) }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        // paddingHorizontal: SIZES.PADDING_MD,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: SIZES.RADIUS_MD,
    },
});

export default Type1Section;
