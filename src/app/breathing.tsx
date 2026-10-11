import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/LanguageContext';

export default function BreathingScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const [running, setRunning] = useState(false);
    const [phaseIdx, setPhaseIdx] = useState(0);
    const [seconds, setSeconds] = useState(4);
    const [cycles, setCycles] = useState(0);

    const phases = [
        { label: t.inhale, seconds: 4, color: '#1E4FD8' },
        { label: t.hold, seconds: 4, color: '#F5A524' },
        { label: t.exhale, seconds: 6, color: '#22A06B' },
        { label: t.rest, seconds: 2, color: '#9AA5B1' },
    ];

    // ✅ Қауіпсіз артқа қайту
    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/home');
        }
    };

    useEffect(() => {
        if (!running) return;
        const timer = setInterval(() => {
            setSeconds((s) => {
                if (s <= 1) {
                    const next = (phaseIdx + 1) % phases.length;
                    setPhaseIdx(next);
                    if (next === 0) setCycles((c) => c + 1);
                    return phases[next].seconds;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [running, phaseIdx]);

    const current = phases[phaseIdx];

    const handleStop = () => {
        setRunning(false);
        setPhaseIdx(0);
        setSeconds(phases[0].seconds);
        setCycles(0);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <Pressable style={styles.backBtn} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </Pressable>
                    <Text style={styles.headerTitle}>{t.breathingTitle}</Text>
                    <Text style={styles.headerSub}>{t.breathingMethod}</Text>
                </SafeAreaView>
            </View>

            <View style={styles.body}>
                <View style={[styles.circle, { borderColor: current.color }]}>
                    <Text style={[styles.seconds, { color: current.color }]}>{seconds}</Text>
                    <Text style={styles.phaseLabel}>{current.label}</Text>
                </View>

                <View style={styles.cyclesBox}>
                    <Text style={styles.cyclesLabel}>{t.cycles}</Text>
                    <Text style={styles.cyclesValue}>{cycles}</Text>
                </View>

                <Pressable
                    style={[styles.button, running && styles.buttonStop]}
                    onPress={() => (running ? handleStop() : setRunning(true))}
                >
                    <Ionicons name={running ? 'stop' : 'play'} size={22} color="#fff" />
                    <Text style={styles.buttonText}>{running ? t.stop : t.start}</Text>
                </Pressable>

                <View style={styles.tip}>
                    <Ionicons name="information-circle" size={18} color="#1E4FD8" />
                    <Text style={styles.tipText}>{t.breathingTip}</Text>
                </View>
            </View>
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
    body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    circle: {
        width: 220, height: 220, borderRadius: 110, borderWidth: 6,
        justifyContent: 'center', alignItems: 'center', marginBottom: 32,
        backgroundColor: '#fff',
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 6,
    },
    seconds: { fontSize: 64, fontWeight: 'bold' },
    phaseLabel: { fontSize: 16, color: '#1A2233', fontWeight: '600', marginTop: 4 },
    cyclesBox: {
        backgroundColor: '#fff', paddingHorizontal: 30, paddingVertical: 14,
        borderRadius: 16, marginBottom: 24, alignItems: 'center',
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    cyclesLabel: { fontSize: 12, color: '#9AA5B1' },
    cyclesValue: { fontSize: 24, fontWeight: 'bold', color: '#1E4FD8', marginTop: 2 },
    button: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#1E4FD8', paddingHorizontal: 40, paddingVertical: 16,
        borderRadius: 16,
        shadowColor: '#1E4FD8', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    buttonStop: { backgroundColor: '#E5484D' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    tip: {
        flexDirection: 'row', gap: 10, backgroundColor: '#E3F0FF',
        padding: 14, borderRadius: 12, marginTop: 32,
    },
    tipText: { flex: 1, color: '#1A2233', fontSize: 12, lineHeight: 18 },
});