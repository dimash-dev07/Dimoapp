import { Stack } from 'expo-router';
import { LanguageProvider } from '../i18n/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="details" />
        <Stack.Screen name="breathing" />
        <Stack.Screen name="support" />
        <Stack.Screen name="privacy" />
      </Stack>
    </LanguageProvider>
  );
}