import React from 'react';
import { EntriesProvider } from './contexts/EntriesContext';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';


export default function App() {
  return (
    <SafeAreaProvider>
      <EntriesProvider>
        <AppNavigator />
      </EntriesProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
