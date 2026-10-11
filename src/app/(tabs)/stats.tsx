import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../i18n/LanguageContext';

export default function StatsScreen() {
    const { t } = useLanguage();

    const stats = [
        { label: t.joy, count: 12, color: '#22A06B' },
        { label: t.calm, count: 8, color: '#1E4FD8' },
        { label: t.tired, count: 5, color: '#F5A524' },
        { label: t.sad, count: 2, color: '#8E44AD' },
    ];

    const trend = [
        { day: 'Дс', value: 60 },
        { day: 'Сс', value: 75 },
        { day: 'Ср', value: 45 },
        { day: 'Бс', value: 80 },
        { day: 'Жм', value: 65 },
        { day: 'Сн', value: 90 },
        { day: 'Жс', value: 70 },
    ];

    const max = Math.max(...stats.map((s) => s.count));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <Text style={styles.headerTitle}>{t.analysis}</Text>
                    <Text style={styles.headerSub}>{t.last7Days}</Text>
                </SafeAreaView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.summaryCard}>
                    <Ionicons name="trending-up" size={28} color="#22A06B" />
                    <Text style={styles.summaryTitle}>{t.overallMood}</Text>
                    <Text style={styles.summaryValue}>{t.improved}</Text>
                    <Text style={styles.summarySub}>{t.comparedToLast}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t.moodFrequency}</Text>
                    {stats.map((s) => (
                        <View key={s.label} style={styles.row}>
                            <View style={[styles.dot, { backgroundColor: s.color }]} />
                            <Text style={styles.label}>{s.label}</Text>
                            <View style={styles.barBg}>
                                <View
                                    style={[
                                        styles.barFill,
                                        { width: `${(s.count / max) * 100}%`, backgroundColor: s.color },
                                    ]}
                                />
                            </View>
                            <Text style={styles.count}>{s.count}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t.weeklyDynamic}</Text>
                    <View style={styles.chart}>
                        {trend.map((tr) => (
                            <View key={tr.day} style={styles.chartCol}>
                                <View style={[styles.chartBar, { height: `${tr.value}%` }]} />
                                <Text style={styles.chartLabel}>{tr.day}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.notice}>
                    <Ionicons name="information-circle" size={20} color="#1E4FD8" />
                    <Text style={styles.noticeText}>{t.disclaimer}</Text>
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
        paddingHorizontal: 20, paddingBottom: 24,
    },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 6 },
    headerSub: { color: '#C7D6FF', fontSize: 13, marginTop: 4 },
    scrollContent: { padding: 20 },
    summaryCard: {
        backgroundColor: '#1E4FD8', borderRadius: 16, padding: 20,
        alignItems: 'center', marginBottom: 14,
    },
    summaryTitle: { color: '#C7D6FF', fontSize: 13, marginTop: 8 },
    summaryValue: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 4 },
    summarySub: { color: '#C7D6FF', fontSize: 12, marginTop: 4 },
    card: {
        backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 14,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    cardTitle: { fontSize: 15, fontWeight: '700', color: '#1A2233', marginBottom: 14 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
    label: { width: 90, fontSize: 13, color: '#1A2233', fontWeight: '500' },
    barBg: {
        flex: 1, height: 10, backgroundColor: '#F0F2F5',
        borderRadius: 5, marginHorizontal: 10,
    },
    barFill: { height: 10, borderRadius: 5 },
    count: { width: 26, textAlign: 'right', color: '#1A2233', fontWeight: '600', fontSize: 13 },
    chart: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'flex-end', height: 100, marginTop: 8,
    },
    chartCol: { alignItems: 'center', flex: 1 },
    chartBar: { width: 14, borderRadius: 7, backgroundColor: '#1E4FD8', marginBottom: 6 },
    chartLabel: { fontSize: 11, color: '#9AA5B1' },
    notice: {
        flexDirection: 'row', gap: 10, backgroundColor: '#E3F0FF',
        padding: 14, borderRadius: 12,
    },
    noticeText: { flex: 1, color: '#1A2233', fontSize: 12, lineHeight: 18 },
});