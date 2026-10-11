import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useLanguage } from '../../i18n/LanguageContext';
import { deleteMood, getAllMoods, MoodEntry } from '../../storage/moods';

export default function JournalScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const [entries, setEntries] = useState<MoodEntry[]>([]);
    const [pendingDelete, setPendingDelete] = useState<MoodEntry | null>(null);

    useFocusEffect(
        useCallback(() => {
            loadEntries();
        }, [])
    );

    const loadEntries = async () => {
        const data = await getAllMoods();
        setEntries(data);
    };

    const confirmDelete = (item: MoodEntry) => {
        setPendingDelete(item);
    };

    const doDelete = async () => {
        if (pendingDelete) {
            await deleteMood(pendingDelete.id);
            await loadEntries();
            setPendingDelete(null);
        }
    };

    const renderRightActions = (item: MoodEntry) => {
        return (
            <Pressable style={styles.swipeDelete} onPress={() => confirmDelete(item)}>
                <Ionicons name="trash" size={26} color="#fff" />
                <Text style={styles.swipeDeleteText}>Жою</Text>
            </Pressable>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <SafeAreaView edges={['top']}>
                        <Text style={styles.headerTitle}>{t.myJournal}</Text>
                        <Text style={styles.headerSub}>
                            {entries.length} {t.entries}
                        </Text>
                    </SafeAreaView>
                </View>

                {entries.length === 0 ? (
                    <View style={styles.empty}>
                        <Ionicons name="journal-outline" size={50} color="#9AA5B1" />
                        <Text style={styles.emptyText}>Әзірге жазба жоқ</Text>
                        <Text style={styles.emptySub}>«Күй» бетінен жаңа жазба қосыңыз</Text>
                    </View>
                ) : (
                    <FlatList
                        data={entries}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.list}
                        renderItem={({ item }) => (
                            <Swipeable
                                renderRightActions={() => renderRightActions(item)}
                                overshootRight={false}
                            >
                                <Pressable
                                    style={styles.cardWrapper}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/details',
                                            params: { moodId: item.id },
                                        })
                                    }
                                    onLongPress={() => confirmDelete(item)}
                                    delayLongPress={500}
                                >
                                    <View style={styles.card}>
                                        <View style={styles.emojiCircle}>
                                            <Text style={styles.emoji}>{item.mood}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={styles.row}>
                                                <Text style={styles.title}>{item.moodLabel}</Text>
                                                <View style={styles.typeBadge}>
                                                    <Ionicons
                                                        name={item.audioUri ? 'mic' : 'document-text'}
                                                        size={12}
                                                        color="#1E4FD8"
                                                    />
                                                    <Text style={styles.typeText}>
                                                        {item.audioUri ? t.voice : t.text}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text style={styles.date}>{item.date}</Text>
                                            {item.note ? (
                                                <Text style={styles.preview} numberOfLines={1}>
                                                    {item.note}
                                                </Text>
                                            ) : null}
                                        </View>
                                        <Ionicons name="chevron-forward" size={20} color="#9AA5B1" />
                                    </View>
                                </Pressable>
                            </Swipeable>
                        )}
                    />
                )}

                {/* Custom Alert */}
                <ConfirmDialog
                    visible={pendingDelete !== null}
                    title="Жазбаны жою"
                    message={
                        pendingDelete
                            ? `«${pendingDelete.mood} ${pendingDelete.moodLabel}» жазбасын жою керек пе?`
                            : ''
                    }
                    confirmText="Иә, жою"
                    cancelText="Жоқ"
                    danger
                    onConfirm={doDelete}
                    onCancel={() => setPendingDelete(null)}
                />
            </View>
        </GestureHandlerRootView>
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
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 6 },
    headerSub: { color: '#C7D6FF', fontSize: 13, marginTop: 4 },
    list: { padding: 20 },
    cardWrapper: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    swipeDelete: {
        width: 100,
        backgroundColor: '#E5484D',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 10,
        gap: 4,
    },
    swipeDeleteText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    emojiCircle: {
        width: 46, height: 46, borderRadius: 23,
        backgroundColor: '#F5F7FA',
        justifyContent: 'center', alignItems: 'center', marginRight: 14,
    },
    emoji: { fontSize: 24 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    title: { fontSize: 16, fontWeight: '600', color: '#1A2233' },
    typeBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 3,
        backgroundColor: '#E3F0FF',
        paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
    },
    typeText: { fontSize: 10, color: '#1E4FD8', fontWeight: '700' },
    date: { fontSize: 12, color: '#9AA5B1', marginTop: 2 },
    preview: { fontSize: 13, color: '#6B7280', marginTop: 4 },
    empty: {
        flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40,
    },
    emptyText: { color: '#1A2233', fontWeight: '600', fontSize: 16, marginTop: 16 },
    emptySub: { color: '#9AA5B1', fontSize: 13, marginTop: 6, textAlign: 'center' },
});