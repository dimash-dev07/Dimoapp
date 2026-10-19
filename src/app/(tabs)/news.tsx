import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAnnouncements } from '../../api/announcements';
import { useSettings } from '../../context/SettingsContext';
import { AppTheme } from '../../theme/themes';
import { Announcement } from '../../types/announcement';

export default function NewsScreen() {
    const router = useRouter();
    const { colors, scaleFont } = useSettings();
    const styles = createStyles(colors, scaleFont);

    const [items, setItems] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            setError(null);
            const data = await getAnnouncements();
            setItems(data);
        } catch (e) {
            setError('Деректерді жүктеу мүмкін болмады. Интернетті тексеріңіз.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadData();
    }, []);

    // 1. Жүктелу күйі
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    // 2. Қате күйі
    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
                <Button title="Қайталау" onPress={loadData} color={colors.primary} />
            </View>
        );
    }

    // 3. Деректер күйі (FlatList)
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <Text style={styles.headerTitle}>Жаңалықтар</Text>
                </SafeAreaView>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.card}
                        onPress={() => {
                            // Міне, навигацияның дұрыс жолы:
                            router.push({
                                pathname: '/news-details',
                                params: { announcementId: item.id },
                            });
                        }}
                    >
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                            <Text style={styles.cardBody} numberOfLines={2}>{item.body}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
                    </Pressable>
                )}
            />
        </View>
    );
}

function createStyles(colors: AppTheme, scaleFont: (base: number) => number) {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        header: {
            backgroundColor: (colors as any).header || colors.primary,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
            paddingHorizontal: 20,
            paddingBottom: 20,
        },
        headerTitle: {
            color: (colors as any).headerText || '#FFFFFF',
            fontSize: scaleFont(24),
            fontWeight: 'bold',
            marginTop: 12,
        },
        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: colors.background,
        },
        errorText: {
            color: colors.text,
            fontSize: scaleFont(16),
            textAlign: 'center',
            marginBottom: 16,
        },
        list: { padding: 16 },
        card: {
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: colors.border,
        },
        cardContent: {
            flex: 1,
            marginRight: 10,
        },
        cardTitle: {
            color: colors.text,
            fontSize: scaleFont(16),
            fontWeight: '600',
            marginBottom: 6,
        },
        cardBody: {
            color: colors.muted,
            fontSize: scaleFont(14),
        },
    });
}