import React from 'react';
import { View, StyleSheet } from 'react-native';
import useAppStore from '../../../stores/appStore';
import Type1Section from './Type1Section';

const ExclusiveSectionRenderer = () => {
    const { config, exclusiveSections } = useAppStore();

    // Only render if app config exists and exclusive sections are enabled
    if (!config?.isExclusiveActive) return null;

    // Filter active sections and sort by order (though they should be sorted from BE)
    const activeSections = exclusiveSections
        .filter(section => section.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    if (activeSections.length === 0) return null;

    const renderSection = (section) => {
        // Handle based on type code
        const typeCode = section.type?.code;

        switch (typeCode) {
            case 'TYPE_1':
                return <Type1Section key={section._id} section={section} />;
            // Add case for TYPE_2 here later
            default:
                // Fallback for Type 1 if code naming is slightly different or for testing
                if (section.image && !section.backgroundImage) {
                    return <Type1Section key={section._id} section={section} />;
                }
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {activeSections.map(renderSection)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});

export default ExclusiveSectionRenderer;
