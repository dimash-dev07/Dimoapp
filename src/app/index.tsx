import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';

const langs: { code: Language; label: string; flag: string }[] = [
  { code: 'kz', label: 'ҚАЗ', flag: '🇰🇿' },
  { code: 'ru', label: 'РУС', flag: '🇷🇺' },
  { code: 'en', label: 'ENG', flag: '🇬🇧' },
];

export default function LoginScreen() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();

  const handleLogin = () => {
    if (!login.trim() || password.length < 6) {
      Alert.alert(t.error, t.errorLogin);
      return;
    }
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      {/* Тіл ауыстырғыш — жоғары оң жақта */}
      <View style={styles.langRow}>
        {langs.map((l) => (
          <Pressable
            key={l.code}
            style={[styles.langBtn, language === l.code && styles.langBtnActive]}
            onPress={() => setLanguage(l.code)}
          >
            <Text style={styles.langFlag}>{l.flag}</Text>
            <Text
              style={[styles.langText, language === l.code && styles.langTextActive]}
            >
              {l.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Logo */}
      <View style={styles.logoBox}>
        <Text style={styles.logoEmoji}>🧠</Text>
      </View>
      <Text style={styles.title}>{t.appName}</Text>
      <Text style={styles.subtitle}>{t.appTagline}</Text>

      {/* Login card */}
      <View style={styles.card}>
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={20} color="#9AA5B1" />
          <TextInput
            style={styles.input}
            placeholder={t.login}
            placeholderTextColor="#9AA5B1"
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={20} color="#9AA5B1" />
          <TextInput
            style={styles.input}
            placeholder={t.password}
            placeholderTextColor="#9AA5B1"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>{t.signIn}</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>{t.privacyNote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F5F7FA' },

  langRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 8,
    position: 'absolute', top: 50, left: 0, right: 0,
  },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#E4E9F2',
  },
  langBtnActive: { backgroundColor: '#1E4FD8', borderColor: '#1E4FD8' },
  langFlag: { fontSize: 14 },
  langText: { fontSize: 11, fontWeight: '700', color: '#9AA5B1' },
  langTextActive: { color: '#fff' },

  logoBox: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#E3F0FF',
    justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 20,
  },
  logoEmoji: { fontSize: 48 },
  title: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: '#1A2233' },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#9AA5B1', marginBottom: 32 },

  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F5F7FA', borderRadius: 12,
    paddingHorizontal: 14, marginBottom: 12,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: '#1A2233' },

  button: {
    backgroundColor: '#1E4FD8', padding: 16, borderRadius: 14, marginTop: 8,
    shadowColor: '#1E4FD8', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },

  footer: { textAlign: 'center', color: '#9AA5B1', fontSize: 12, marginTop: 24 },
});