import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useLanguage } from '../../i18n/LanguageContext';
import { Language } from '../../i18n/translations';
import { clearAll, getAllMoods } from '../../storage/moods';

const langs: { code: Language; label: string; flag: string }[] = [
    { code: 'kz', label: 'ҚАЗ', flag: '🇰🇿' },
    { code: 'ru', label: 'РУС', flag: '🇷🇺' },
    { code: 'en', label: 'ENG', flag: '🇬🇧' },
];

export default function ProfileScreen() {
    const router = useRouter();
    const { t, language, setLanguage } = useLanguage();
    const [entryCount, setEntryCount] = useState(0);
    const [showClearDialog, setShowClearDialog] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const [infoTitle, setInfoTitle] = useState('');
    const [infoMessage, setInfoMessage] = useState('');

    useFocusEffect(
        useCallback(() => {
            loadCount();
        }, [])
    );

    const loadCount = async () => {
        const data = await getAllMoods();
        setEntryCount(data.length);
    };

    const handleClearAll = () => {
        setShowClearDialog(true);
    };

    const doClearAll = async () => {
        await clearAll();
        await loadCount();
        setShowClearDialog(false);
    };

    // ℹ️ Ақпараттық терезе
    const showInfo = (title: string, message: string) => {
        setInfoTitle(title);
        setInfoMessage(message);
        setShowInfoDialog(true);
    };

    const menu = [
        {
            icon: 'person-outline',
            label: t.personalInfo,
            onPress: () =>
                showInfo(
                    t.personalInfo,
                    'Аты: Amina S.\nРөлі: Mental Pulse қолданушысы\n\nБарлық деректер құрылғыда сақталады.'
                ),
        },
        {
            icon: 'notifications-outline',
            label: t.notifications,
            onPress: () =>
                showInfo(
                    t.notifications,
                    'Хабарламалар өшірілген.\n\nКүнделікті еске салғыштар жақында қосылады.'
                ),
        },
        {
            icon: 'settings-outline',
            label: t.settings,
            onPress: () =>
                showInfo(
                    t.settings,
                    'Қосымша баптаулары:\n\n• Тіл: Profile экранында\n• Деректер: құрылғыда\n• Нұсқа: 1.0.0'
                ),
        },
    ];

    const support = [
        { icon: 'call-outline', label: t.hotline, color: '#22A06B' },
        { icon: 'chatbubbles-outline', label: t.onlineChat, color: '#1E4FD8' },
        { icon: 'people-outline', label: t.supportGroups, color: '#F5A524' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <Text style={styles.headerTitle}>{t.profile}</Text>
                </SafeAreaView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Аватар */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>A</Text>
                    </View>
                    <Text style={styles.name}>Amina S.</Text>
                    <Text style={styles.role}>{t.role}</Text>
                </View>

                {/* Тіл ауыстырғыш */}
                <Text style={styles.sectionTitle}>{t.language}</Text>
                <View style={styles.card}>
                    <View style={styles.langRow}>
                        {langs.map((l) => (
                            <Pressable
                                key={l.code}
                                style={[styles.langBtn, language === l.code && styles.langBtnActive]}
                                onPress={() => setLanguage(l.code)}
                            >
                                <Text style={styles.langFlag}>{l.flag}</Text>
                                <Text
                                    style={[
                                        styles.langText,
                                        language === l.code && styles.langTextActive,
                                    ]}
                                >
                                    {l.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Қолдау */}
                <Text style={styles.sectionTitle}>{t.support}</Text>
                <View style={styles.card}>
                    {support.map((s, idx) => (
                        <Pressable
                            key={s.label}
                            style={[
                                styles.menuItem,
                                idx < support.length - 1 && styles.menuBorder,
                            ]}
                            onPress={() => router.push('/support')}
                        >
                            <View style={[styles.iconBg, { backgroundColor: `${s.color}20` }]}>
                                <Ionicons name={s.icon as any} size={20} color={s.color} />
                            </View>
                            <Text style={styles.menuLabel}>{s.label}</Text>
                            <Ionicons name="chevron-forward" size={18} color="#9AA5B1" />
                        </Pressable>
                    ))}
                </View>

                {/* Тыныс алу */}
                <Text style={styles.sectionTitle}>{t.selfRegulation}</Text>
                <Pressable style={styles.bigCard} onPress={() => router.push('/breathing')}>
                    <View style={styles.bigIcon}>
                        <Ionicons name="leaf" size={26} color="#22A06B" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.bigTitle}>{t.breathing}</Text>
                        <Text style={styles.bigSub}>{t.breathingDesc}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9AA5B1" />
                </Pressable>

                {/* Баптаулар */}
                <Text style={styles.sectionTitle}>{t.settings}</Text>
                <View style={styles.card}>
                    {menu.map((m, idx) => (
                        <Pressable
                            key={m.label}
                            style={[
                                styles.menuItem,
                                idx < menu.length - 1 && styles.menuBorder,
                            ]}
                            onPress={m.onPress}
                        >
                            <Ionicons name={m.icon as any} size={20} color="#1E4FD8" />
                            <Text style={styles.menuLabel}>{m.label}</Text>
                            <Ionicons name="chevron-forward" size={18} color="#9AA5B1" />
                        </Pressable>
                    ))}

                    <Pressable
                        style={[styles.menuItem, styles.menuBorder]}
                        onPress={() => router.push('/privacy')}
                    >
                        <Ionicons name="shield-checkmark-outline" size={20} color="#1E4FD8" />
                        <Text style={styles.menuLabel}>{t.privacy}</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9AA5B1" />
                    </Pressable>

                    <Pressable
                        style={styles.menuItem}
                        onPress={() =>
                            showInfo(
                                t.help,
                                'Сұрақтарыңыз болса:\n\n📞 150 — психологиялық көмек\n📞 111 — сенім телефоны\n📧 support@mentalpulse.kz\n\nБіз 24/7 қолдау көрсетеміз.'
                            )
                        }
                    >
                        <Ionicons name="help-circle-outline" size={20} color="#1E4FD8" />
                        <Text style={styles.menuLabel}>{t.help}</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9AA5B1" />
                    </Pressable>
                </View>

                {/* 🗑 Барлық жазбаларды жою */}
                {entryCount > 0 ? (
                    <>
                        <Text style={styles.sectionTitle}>Қауіпті аймақ</Text>
                        <Pressable style={styles.dangerBtn} onPress={handleClearAll}>
                            <Ionicons name="trash-outline" size={20} color="#E5484D" />
                            <Text style={styles.dangerText}>
                                Барлық жазбаларды жою ({entryCount})
                            </Text>
                        </Pressable>
                    </>
                ) : null}

                {/* Шығу */}
                <Pressable style={styles.logout} onPress={() => router.replace('/')}>
                    <Ionicons name="log-out-outline" size={20} color="#E5484D" />
                    <Text style={styles.logoutText}>{t.logout}</Text>
                </Pressable>
            </ScrollView>

            {/* Барлығын жою диалогы */}
            <ConfirmDialog
                visible={showClearDialog}
                title="Барлығын жою"
                message={`Барлық ${entryCount} жазбаны жою керек пе?\n\nБұл әрекетті кері қайтару мүмкін емес!`}
                confirmText="Иә, бәрін жою"
                cancelText="Жоқ"
                danger
                onConfirm={doClearAll}
                onCancel={() => setShowClearDialog(false)}
            />

            {/* Ақпараттық диалог */}
            <ConfirmDialog
                visible={showInfoDialog}
                title={infoTitle}
                message={infoMessage}
                confirmText="Жабу"
                cancelText=""
                onConfirm={() => setShowInfoDialog(false)}
                onCancel={() => setShowInfoDialog(false)}
            />
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
        paddingBottom: 40,
    },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 6 },

    scrollContent: { padding: 20, marginTop: -30 },

    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1E4FD8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: { fontSize: 34, color: '#fff', fontWeight: 'bold' },
    name: { fontSize: 20, fontWeight: 'bold', color: '#1A2233' },
    role: { fontSize: 13, color: '#9AA5B1', marginTop: 4 },

    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9AA5B1',
        marginTop: 20,
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },

    langRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 12,
        gap: 8,
    },
    langBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F5F7FA',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    langBtnActive: {
        backgroundColor: '#E3F0FF',
        borderColor: '#1E4FD8',
    },
    langFlag: { fontSize: 18 },
    langText: { fontSize: 13, fontWeight: '700', color: '#9AA5B1' },
    langTextActive: { color: '#1E4FD8' },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    menuBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F2F5' },
    menuLabel: { flex: 1, fontSize: 15, color: '#1A2233', fontWeight: '500' },
    iconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },

    bigCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    bigIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E6F7EE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bigTitle: { fontSize: 15, fontWeight: '700', color: '#1A2233' },
    bigSub: { fontSize: 12, color: '#9AA5B1', marginTop: 2 },

    dangerBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        padding: 16,
        borderRadius: 16,
        gap: 8,
        borderWidth: 1,
        borderColor: '#FFE0E0',
    },
    dangerText: {
        color: '#E5484D',
        fontWeight: '700',
        fontSize: 14,
    },

    logout: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDECEC',
        padding: 16,
        borderRadius: 16,
        marginTop: 20,
        gap: 8,
    },
    logoutText: { color: '#E5484D', fontWeight: '700', fontSize: 15 },
});