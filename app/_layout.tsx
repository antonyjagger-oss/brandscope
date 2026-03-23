import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SystemBars } from 'react-native-edge-to-edge';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { WidgetProvider } from '@/contexts/WidgetContext';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <WidgetProvider>
          <ThemeProvider value={DarkTheme}>
            <StatusBar style="light" animated />
            <SystemBars style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#0A0E1A' },
                animation: 'slide_from_right',
              }}
            />
          </ThemeProvider>
        </WidgetProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
