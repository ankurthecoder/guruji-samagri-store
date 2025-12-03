import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

const BottomSheetHandler = () => {

    // FIXED REF
    const bottomSheetRef = useRef(null);

    // REQUIRED snapPoints
    const snapPoints = useMemo(() => ['25%', '50%'], []);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
    }, []);
    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.5}
            />
        ),
        []
    );

    return (
        <GestureHandlerRootView style={styles.container}>
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={0}
                backdropComponent={renderBackdrop}
                onChange={handleSheetChanges}
            >

                <BottomSheetView style={styles.contentContainer}>
                    <Text>Awesome 🎉</Text>
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',   // ✔ safe
        position: 'absolute',
        width: '100%',
        height: '100%',
    }
    ,
    contentContainer: {
        flex: 1,
        padding: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default BottomSheetHandler;
