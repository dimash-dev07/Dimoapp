import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SettingsProvider, useSettings } from '../context/SettingsContext';
import { LanguageProvider } from '../i18n/LanguageContext';

// Баптаулар жүктелгенше жүйелік Splash экранын көрсету
SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigator() {
    const { isReady } = useSettings();

    useEffect(() => {
        if (isReady) {
            SplashScreen.hideAsync();
        }
    }, [isReady]);

    // Баптаулар әлі оқылмады — Splash күйінде қаламыз
    if (!isReady) {
        return null;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="details" />
            <Stack.Screen name="news-details" />
            <Stack.Screen name="breathing" />
            <Stack.Screen name="support" />
            <Stack.Screen name="privacy" />
            <Stack.Screen name="settings" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <LanguageProvider>
            <SettingsProvider>
                <RootNavigator />
            </SettingsProvider>
        </LanguageProvider>
    );
}
