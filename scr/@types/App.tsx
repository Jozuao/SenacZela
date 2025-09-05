import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import AppNavigator from './navigation/AppNavigator';
import { NotificationBehavior, setNotificationHandler } from 'expo-notifications';

setNotificationHandler({
  handleNotification: async (): Promise<NotificationBehavior> => ({
    shouldShowBanner: true, // replaces shouldShowAlert
    shouldShowList: true,   // optional, shows notification in notification center
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App(): JSX.Element {
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Notification permission not granted');
        }
      } catch (err) {
        console.error('Notification permission error:', err);
      }
    })();
  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <AppNavigator />
          </SafeAreaView>
        </NavigationContainer>
      </DataProvider>
    </AuthProvider>
  );
}
