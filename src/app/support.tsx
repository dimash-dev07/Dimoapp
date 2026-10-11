import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/LanguageContext';

export default function SupportScreen() {
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

    const contacts = [
        { icon: 'call', label: t.hotline, desc: t.hotlineDesc, color: '#22A06B', phone: '150' },
        { icon: 'chatbubbles', label: t.onlineChat, desc: t.onlineChatDesc, color: '#1E4FD8', phone: null },
        { icon: 'people', label: t.supportGroups, desc: t.supportGroupsDesc, color: '#F5A524', phone: null },
        { icon: 'heart', label: t.trustPhone, desc: t.trustPhoneDesc, color: '#E5484D', phone: '111' },
    ];

    const handleContact = (c: any) => {
        if (c.phone) {
            Linking.openURL(`tel:${c.phone}`);
        } else {
            Alert.alert(c.label, t.comingSoon);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <Pressable style={styles.backBtn} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </Pressable>
                    <Text style={styles.headerTitle}>{t.supportTitle}</Text>
                    <Text style={styles.headerSub}>{t.supportSub}</Text>
                </SafeAreaView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.notice}>
                    <Ionicons name="shield-checkmark" size={20} color="#22A06B" />
                    <Text style={styles.noticeText}>{t.confidentiality}</Text>
                </View>

                {contacts.map((c) => (
                    <Pressable key={c.label} style={styles.card} onPress={() => handleContact(c)}>
                        <View style={[styles.iconBg, { backgroundColor: `${c.color}20` }]}>
                            <Ionicons name={c.icon as any} size={24} color={c.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>{c.label}</Text>
                            <Text style={styles.desc}>{c.desc}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9AA5B1" />
                    </Pressable>
                ))}

                <View style={styles.emergency}>
                    <Ionicons name="warning" size={22} color="#E5484D" />
                    <Text style={styles.emergencyTitle}>{t.emergency}</Text>
                    <Text style={styles.emergencyText}>
                        {t.emergencyServices}{'\n'}
                        {t.ambulance}{'\n'}
                        {t.psychHelp}
                    </Text>
                </View>
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
    notice: {
        flexDirection: 'row', gap: 10, backgroundColor: '#E6F7EE',
        padding: 14, borderRadius: 12, marginBottom: 16,
    },
    noticeText: { flex: 1, color: '#1A2233', fontSize: 12, lineHeight: 18 },
    card: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 10,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    iconBg: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    label: { fontSize: 15, fontWeight: '700', color: '#1A2233' },
    desc: { fontSize: 12, color: '#9AA5B1', marginTop: 2 },
    emergency: {
        backgroundColor: '#FDECEC', borderRadius: 16, padding: 20, marginTop: 10,
    },
    emergencyTitle: { fontSize: 16, fontWeight: '700', color: '#E5484D', marginTop: 8 },
    emergencyText: { fontSize: 14, color: '#1A2233', marginTop: 8, lineHeight: 22 },
});