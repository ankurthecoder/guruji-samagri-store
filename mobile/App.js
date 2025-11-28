import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/colors';

const App = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={COLORS.PRIMARY}
            />
            <AppNavigator />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
});

export default App;
