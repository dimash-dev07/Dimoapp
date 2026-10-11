import { Ionicons } from '@expo/vector-icons';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { deleteMood, getAllMoods, MoodEntry } from '../storage/moods';

export default function DetailsScreen() {
    const { moodId } = useLocalSearchParams<{ moodId: string }>();
    const router = useRouter();
    const [entry, setEntry] = useState<MoodEntry | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const player = useAudioPlayer(entry?.audioUri ? { uri: entry.audioUri } : null);

    useEffect(() => {
        loadEntry();
        (async () => {
            await setAudioModeAsync({
                playsInSilentMode: true,
            });
        })();
    }, []);

    const loadEntry = async () => {
        const all = await getAllMoods();
        const found = all.find((m) => m.id === moodId);
        setEntry(found || null);
    };

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/journal');
        }
    };

    const playAudio = async () => {
        if (!entry?.audioUri || !player) return;
        try {
            if (isPlaying) {
                player.pause();
                setIsPlaying(false);
            } else {
                player.play();
                setIsPlaying(true);
            }
        } catch (e) {
            console.error('playAudio error:', e);
            Alert.alert('Қате', 'Дауысты ойнату мүмкін болмады');
        }
    };

    const handleDelete = () => {
        setShowDeleteDialog(true);
    };

    const doDelete = async () => {
        if (entry) {
            await deleteMood(entry.id);
            setShowDeleteDialog(false);
            router.replace('/(tabs)/journal');
        }
    };

    if (!entry) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <SafeAreaView edges={['top']}>
                        <Pressable style={styles.backBtn} onPress={handleBack}>
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </Pressable>
                    </SafeAreaView>
                </View>
                <View style={styles.loading}>
                    <Text style={styles.loadingText}>Жүктелуде...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerRow}>
                        <Pressable style={styles.iconBtn} onPress={handleBack}>
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </Pressable>
                        <Pressable style={styles.iconBtn} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={22} color="#fff" />
                        </Pressable>
                    </View>
                    <Text style={styles.headerTitle}>
                        {entry.mood} {entry.moodLabel}
                    </Text>
                    <Text style={styles.headerSub}>📅 {entry.date}</Text>
                </SafeAreaView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {entry.audioUri ? (
                    <View style={styles.audioCard}>
                        <View style={styles.audioHeader}>
                            <Ionicons name="mic" size={20} color="#1E4FD8" />
                            <Text style={styles.audioLabel}>Дауыстық жазба</Text>
                        </View>

                        <Pressable style={styles.playBtn} onPress={playAudio}>
                            <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="#fff" />
                        </Pressable>

                        <Text style={styles.playText}>
                            {isPlaying ? 'Ойнатылып жатыр...' : 'Тыңдау'}
                        </Text>
                    </View>
                ) : null}

                {entry.note && entry.note.trim().length > 0 ? (
                    <View style={styles.noteCard}>
                        <View style={styles.noteHeader}>
                            <Ionicons name="document-text" size={20} color="#1E4FD8" />
                            <Text style={styles.noteLabel}>Мәтіндік жазба</Text>
                        </View>
                        <Text style={styles.note}>{entry.note}</Text>
                    </View>
                ) : (
                    <View style={styles.emptyNote}>
                        <Ionicons name="document-outline" size={32} color="#9AA5B1" />
                        <Text style={styles.emptyNoteText}>Мәтіндік жазба жоқ</Text>
                        <Text style={styles.emptyNoteSub}>Тек дауыстық жазба сақталған</Text>
                    </View>
                )}

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>ID</Text>
                        <Text style={styles.infoValue}>{entry.id}</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Күні</Text>
                        <Text style={styles.infoValue}>{entry.date}</Text>
                    </View>
                    <View style={styles.infoDivider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Уақыты</Text>
                        <Text style={styles.infoValue}>
                            {new Date(entry.createdAt).toLocaleTimeString('kk-KZ', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <ConfirmDialog
                visible={showDeleteDialog}
                title="Жазбаны жою"
                message={
                    entry
                        ? `«${entry.mood} ${entry.moodLabel}» жазбасын жою керек пе?`
                        : ''
                }
                confirmText="Иә, жою"
                cancelText="Жоқ"
                danger
                onConfirm={doDelete}
                onCancel={() => setShowDeleteDialog(false)}
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
        paddingHorizontal: 20, paddingBottom: 28,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center', alignItems: 'center',
    },
    iconBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center', alignItems: 'center',
    },
    headerTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginTop: 14 },
    headerSub: { color: '#C7D6FF', fontSize: 13, marginTop: 6 },
    scrollContent: { padding: 20 },
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingText: { color: '#9AA5B1' },
    audioCard: {
        backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center',
        marginBottom: 14,
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
    },
    audioHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
    audioLabel: { fontSize: 14, color: '#1A2233', fontWeight: '600' },
    playBtn: {
        width: 72, height: 72, borderRadius: 36, backgroundColor: '#1E4FD8',
        justifyContent: 'center', alignItems: 'center', marginBottom: 12,
        shadowColor: '#1E4FD8', shadowOpacity: 0.35, shadowRadius: 12, elevation: 5,
    },
    playText: { fontSize: 13, color: '#1E4FD8', fontWeight: '600' },
    noteCard: {
        backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 14,
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
    },
    noteHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    noteLabel: { fontSize: 14, color: '#1A2233', fontWeight: '600' },
    note: { fontSize: 15, color: '#1A2233', lineHeight: 24 },
    emptyNote: {
        backgroundColor: '#fff', borderRadius: 20, padding: 32, alignItems: 'center',
        marginBottom: 14, borderWidth: 1, borderColor: '#E4E9F2', borderStyle: 'dashed',
    },
    emptyNoteText: { fontSize: 15, color: '#6B7280', fontWeight: '600', marginTop: 12 },
    emptyNoteSub: { fontSize: 12, color: '#9AA5B1', marginTop: 4 },
    infoCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 4,
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
    },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14 },
    infoLabel: { fontSize: 13, color: '#9AA5B1', fontWeight: '600' },
    infoValue: { fontSize: 13, color: '#1A2233', fontWeight: '500' },
    infoDivider: { height: 1, backgroundColor: '#F0F2F5', marginHorizontal: 14 },
});