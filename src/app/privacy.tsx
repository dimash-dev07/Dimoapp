import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/LanguageContext';

export default function PrivacyScreen() {
    const router = useRouter();
    const { t } = useLanguage();

    // ✅ Қауіпсіз артқа қайту
    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/profile');
        }
    };

    const sections = [
        { icon: 'lock-closed', title: t.dataProtection, text: t.dataProtectionText },
        { icon: 'eye-off', title: t.anonymity, text: t.anonymityText },
        { icon: 'shield-checkmark', title: t.notMedical, text: t.notMedicalText },
        { icon: 'trash', title: t.dataDeletion, text: t.dataDeletionText },
        { icon: 'person', title: t.personalData, text: t.personalDataText },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <Pressable style={styles.backBtn} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </Pressable>
                    <Text style={styles.headerTitle}>{t.privacyTitle}</Text>
                    <Text style={styles.headerSub}>{t.privacySub}</Text>
                </SafeAreaView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.badge}>
                    <Ionicons name="checkmark-circle" size={28} color="#22A06B" />
                    <Text style={styles.badgeText}>{t.safeAndAnonymous}</Text>
                </View>

                {sections.map((s) => (
                    <View key={s.title} style={styles.card}>
                        <View style={styles.iconBg}>
                            <Ionicons name={s.icon as any} size={22} color="#1E4FD8" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{s.title}</Text>
                            <Text style={styles.text}>{s.text}</Text>
                        </View>
                    </View>
                ))}

                <Text style={styles.footer}>
                    {t.lastUpdate}{'\n'}
                    Mental Pulse © 2026
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: {
        backgroundColor: '#1E4FD8',
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center', alignItems: 'center', marginTop: 6,
    },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 12 },
    headerSub: { color: '#C7D6FF', fontSize: 13, marginTop: 4 },
    scrollContent: { padding: 20 },
    badge: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: '#E6F7EE', padding: 16, borderRadius: 16, marginBottom: 16,
        justifyContent: 'center',
    },
    badgeText: { color: '#22A06B', fontWeight: '700', fontSize: 15 },
    card: {
        flexDirection: 'row', gap: 14,
        backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 10,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    iconBg: {
        width: 42, height: 42, borderRadius: 21, backgroundColor: '#E3F0FF',
        justifyContent: 'center', alignItems: 'center',
    },
    title: { fontSize: 15, fontWeight: '700', color: '#1A2233' },
    text: { fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 19 },
    footer: { textAlign: 'center', color: '#9AA5B1', fontSize: 12, marginTop: 24, lineHeight: 18 },
});
