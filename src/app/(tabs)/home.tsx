import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../i18n/LanguageContext';
import { getAllMoods, MoodEntry } from '../../storage/moods';

export default function HomeScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const [moods, setMoods] = useState<MoodEntry[]>([]);

    // Экранға кіргенде жазбаларды жүктеу
    useFocusEffect(
        useCallback(() => {
            loadMoods();
        }, [])
    );

    const loadMoods = async () => {
        const data = await getAllMoods();
        setMoods(data.slice(0, 3)); // Тек 3 соңғы
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.greetingSmall}>{t.goodMorning}</Text>
                            <Text style={styles.greetingName}>Amina S. 👋</Text>
                            <Text style={styles.greetingSub}>{t.howAreYou}</Text>
                        </View>
                        <Pressable style={styles.bellBtn}>
                            <Ionicons name="notifications-outline" size={22} color="#fff" />
                        </Pressable>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.section}>{t.recentEntries}</Text>
                    <Pressable onPress={() => router.push('/(tabs)/journal')}>
                        <Text style={styles.seeAll}>{t.seeAll}</Text>
                    </Pressable>
                </View>

                {moods.length === 0 ? (
                    <View style={styles.empty}>
                        <Ionicons name="journal-outline" size={40} color="#9AA5B1" />
                        <Text style={styles.emptyText}>Әзірге жазба жоқ</Text>
                        <Text style={styles.emptySub}>«Күй» бетінен бастаңыз</Text>
                    </View>
                ) : (
                    moods.map((item) => (
                        <Pressable
                            key={item.id}
                            style={styles.card}
                            onPress={() =>
                                router.push({
                                    pathname: '/details',
                                    params: { moodId: item.id },
                                })
                            }
                        >
                            <View style={styles.emojiCircle}>
                                <Text style={styles.emoji}>{item.mood}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardTitle}>{item.moodLabel}</Text>
                                <Text style={styles.cardDate}>{item.date}</Text>
                            </View>
                            {item.audioUri && (
                                <Ionicons name="mic" size={16} color="#1E4FD8" style={{ marginRight: 8 }} />
                            )}
                            <Ionicons name="chevron-forward" size={20} color="#9AA5B1" />
                        </Pressable>
                    ))
                )}

                <Text style={[styles.section, { marginTop: 24, marginBottom: 12 }]}>
                    {t.quickActions}
                </Text>
                <View style={styles.quickRow}>
                    <Pressable style={styles.quickCard} onPress={() => router.push('/(tabs)/add-mood')}>
                        <View style={[styles.quickIcon, { backgroundColor: '#E3F0FF' }]}>
                            <Ionicons name="add" size={22} color="#1E4FD8" />
                        </View>
                        <Text style={styles.quickLabel}>{t.add}</Text>
                    </Pressable>
                    <Pressable style={styles.quickCard} onPress={() => router.push('/(tabs)/stats')}>
                        <View style={[styles.quickIcon, { backgroundColor: '#E6F7EE' }]}>
                            <Ionicons name="stats-chart" size={22} color="#22A06B" />
                        </View>
                        <Text style={styles.quickLabel}>{t.statistics}</Text>
                    </Pressable>
                    <Pressable style={styles.quickCard} onPress={() => router.push('/(tabs)/profile')}>
                        <View style={[styles.quickIcon, { backgroundColor: '#FDECEC' }]}>
                            <Ionicons name="person" size={22} color="#E5484D" />
                        </View>
                        <Text style={styles.quickLabel}>{t.profile}</Text>
                    </Pressable>
                </View>

                <Pressable
                    style={[styles.bigCard, { marginTop: 16 }]}
                    onPress={() => router.push('/breathing')}
                >
                    <View style={styles.bigIcon}>
                        <Ionicons name="leaf" size={26} color="#22A06B" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.bigTitle}>{t.breathing}</Text>
                        <Text style={styles.bigSub}>{t.breathingDesc}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9AA5B1" />
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: {
        backgroundColor: '#1E4FD8',
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        paddingBottom: 28, paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'flex-start', paddingTop: 8,
    },
    greetingSmall: { color: '#C7D6FF', fontSize: 14 },
    greetingName: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 2 },
    greetingSub: { color: '#C7D6FF', fontSize: 13, marginTop: 6 },
    bellBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center', alignItems: 'center',
    },
    scrollContent: { padding: 20 },
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 12,
    },
    section: { fontSize: 17, fontWeight: '700', color: '#1A2233' },
    seeAll: { color: '#1E4FD8', fontSize: 13, fontWeight: '600' },
    empty: {
        backgroundColor: '#fff', borderRadius: 16, padding: 32,
        alignItems: 'center', marginBottom: 10,
    },
    emptyText: { color: '#1A2233', fontWeight: '600', fontSize: 15, marginTop: 12 },
    emptySub: { color: '#9AA5B1', fontSize: 13, marginTop: 4 },
    card: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 10,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    emojiCircle: {
        width: 46, height: 46, borderRadius: 23,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center', alignItems: 'center', marginRight: 14,
    },
    emoji: { fontSize: 24 },
    cardTitle: { fontSize: 16, fontWeight: '600', color: '#1A2233' },
    cardDate: { fontSize: 13, color: '#9AA5B1', marginTop: 2 },
    quickRow: { flexDirection: 'row', justifyContent: 'space-between' },
    quickCard: {
        flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 14,
        alignItems: 'center', marginHorizontal: 4,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    quickIcon: {
        width: 44, height: 44, borderRadius: 22,
        justifyContent: 'center', alignItems: 'center', marginBottom: 8,
    },
    quickLabel: { fontSize: 12, color: '#1A2233', fontWeight: '600' },
    bigCard: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: '#fff', padding: 16, borderRadius: 16,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    bigIcon: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: '#E6F7EE',
        justifyContent: 'center', alignItems: 'center',
    },
    bigTitle: { fontSize: 15, fontWeight: '700', color: '#1A2233' },
    bigSub: { fontSize: 12, color: '#9AA5B1', marginTop: 2 },
});