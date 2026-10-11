import { Ionicons } from '@expo/vector-icons';
import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioRecorder,
} from 'expo-audio';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../i18n/LanguageContext';
import { addMood, formatDate } from '../../storage/moods';

export default function AddMoodScreen() {
    const { t } = useLanguage();
    const router = useRouter();
    const [selected, setSelected] = useState('😊');
    const [selectedLabel, setSelectedLabel] = useState(t.joy);
    const [note, setNote] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [audioUri, setAudioUri] = useState<string | null>(null);

    const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

    useEffect(() => {
        (async () => {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
                Alert.alert(t.error, 'Микрофонға рұқсат беріңіз');
            }
            await setAudioModeAsync({
                allowsRecording: true,
                playsInSilentMode: true,
            });
        })();
    }, []);

    const emojis = [
        { e: '😊', label: t.joy },
        { e: '😌', label: t.calm },
        { e: '😐', label: t.neutral },
        { e: '😔', label: t.sad },
        { e: '😴', label: t.tired },
        { e: '😡', label: t.angry },
        { e: '😢', label: t.crying },
    ];

    const startRecording = async () => {
        try {
            await recorder.prepareToRecordAsync();
            recorder.record();
            setIsRecording(true);
        } catch (e) {
            console.error('startRecording error:', e);
            Alert.alert(t.error, 'Жазуды бастау мүмкін болмады');
        }
    };

    const stopRecording = async () => {
        try {
            await recorder.stop();
            const uri = recorder.uri;
            setIsRecording(false);
            if (uri) {
                setAudioUri(uri);
                Alert.alert('✅', t.recordingSaved);
            }
        } catch (e) {
            console.error('stopRecording error:', e);
        }
    };

    const toggleRecording = () => {
        if (isRecording) stopRecording();
        else startRecording();
    };

    const handleSave = async () => {
        const now = Date.now();
        const entry = {
            id: now.toString(),
            mood: selected,
            moodLabel: selectedLabel,
            note: note.trim(),
            audioUri,
            date: formatDate(now),
            createdAt: now,
        };

        await addMood(entry);
        Alert.alert(t.saved, `${selected} ${t.savedMessage}`, [
            {
                text: 'OK',
                onPress: () => {
                    setNote('');
                    setAudioUri(null);
                    setSelected('😊');
                    setSelectedLabel(t.joy);
                    router.push('/(tabs)/home');
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <Text style={styles.headerTitle}>{t.addMood}</Text>
                    <Text style={styles.headerSub}>{t.addMoodSub}</Text>
                </SafeAreaView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Эмодзи */}
                <View style={styles.card}>
                    <Text style={styles.label}>{t.chooseMood}</Text>
                    <View style={styles.emojiRow}>
                        {emojis.map((item) => (
                            <Pressable
                                key={item.e}
                                style={[styles.emojiBtn, selected === item.e && styles.emojiBtnActive]}
                                onPress={() => {
                                    setSelected(item.e);
                                    setSelectedLabel(item.label);
                                }}
                            >
                                <Text style={styles.emojiText}>{item.e}</Text>
                                <Text style={styles.emojiLabel}>{item.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Мәтін */}
                <View style={styles.card}>
                    <Text style={styles.label}>{t.textNote}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t.textNotePlaceholder}
                        placeholderTextColor="#9AA5B1"
                        value={note}
                        onChangeText={setNote}
                        multiline
                    />
                </View>

                {/* Дауыс */}
                <View style={styles.card}>
                    <View style={styles.voiceHeader}>
                        <Text style={styles.label}>{t.voiceNote}</Text>
                        <Text style={styles.optional}>{t.optional}</Text>
                    </View>

                    <Pressable
                        style={[styles.voiceBtn, isRecording && styles.voiceBtnActive]}
                        onPress={toggleRecording}
                    >
                        <Ionicons
                            name={isRecording ? 'stop-circle' : 'mic-circle'}
                            size={56}
                            color={isRecording ? '#E5484D' : '#1E4FD8'}
                        />
                        <Text style={[styles.voiceText, isRecording && { color: '#E5484D' }]}>
                            {isRecording ? t.stop : t.pressToRecord}
                        </Text>
                    </Pressable>

                    {isRecording && (
                        <View style={styles.recordingInfo}>
                            <View style={styles.pulse} />
                            <Text style={styles.recordingTime}>{t.recording}</Text>
                        </View>
                    )}

                    {audioUri && !isRecording && (
                        <View style={styles.savedAudio}>
                            <Ionicons name="checkmark-circle" size={18} color="#22A06B" />
                            <Text style={styles.savedAudioText}>Дауыс сақталды</Text>
                        </View>
                    )}
                </View>

                {/* Сақтау */}
                <Pressable style={styles.button} onPress={handleSave}>
                    <Ionicons name="checkmark-circle" size={22} color="#fff" />
                    <Text style={styles.buttonText}>{t.save}</Text>
                </Pressable>
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
    card: {
        backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 14,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    label: { fontSize: 15, color: '#1A2233', fontWeight: '700', marginBottom: 12 },
    emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
    emojiBtn: {
        width: '22%', aspectRatio: 1, borderRadius: 16,
        backgroundColor: '#F5F7FA', justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: 'transparent', paddingVertical: 8,
    },
    emojiBtnActive: { borderColor: '#1E4FD8', backgroundColor: '#E3F0FF' },
    emojiText: { fontSize: 26 },
    emojiLabel: { fontSize: 9, color: '#1A2233', marginTop: 2, fontWeight: '600' },
    input: {
        backgroundColor: '#F5F7FA', borderRadius: 12, padding: 14,
        minHeight: 100, textAlignVertical: 'top', fontSize: 15, color: '#1A2233',
    },
    voiceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    optional: { fontSize: 12, color: '#9AA5B1', marginBottom: 12 },
    voiceBtn: {
        alignItems: 'center', padding: 20,
        backgroundColor: '#F5F7FA', borderRadius: 14, borderWidth: 2,
        borderColor: '#E3F0FF', borderStyle: 'dashed',
    },
    voiceBtnActive: { borderColor: '#E5484D', backgroundColor: '#FDECEC' },
    voiceText: { color: '#1E4FD8', fontWeight: '600', fontSize: 14, marginTop: 8 },
    recordingInfo: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginTop: 12, gap: 8,
    },
    pulse: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E5484D' },
    recordingTime: { color: '#E5484D', fontSize: 14, fontWeight: '600' },
    savedAudio: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginTop: 12, gap: 6,
    },
    savedAudioText: { color: '#22A06B', fontSize: 13, fontWeight: '600' },
    button: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
        backgroundColor: '#1E4FD8', padding: 18, borderRadius: 16,
        shadowColor: '#1E4FD8', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});