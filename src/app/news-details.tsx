import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAnnouncement } from '../api/announcements';
import { useSettings } from '../context/SettingsContext';
import { AppTheme } from '../theme/themes';
import { Announcement } from '../types/announcement';

export default function NewsDetailsScreen() {
    const { announcementId } = useLocalSearchParams<{ announcementId?: string }>();
    const router = useRouter();

    // useSettings-тен түстерді аламыз. Егер сізде scaleFont функциясы болмаса,
    // оны қарапайым көбейту арқылы жасаймыз.
    const { colors } = useSettings();

    // Егер scaleFont функциясы SettingsContext-те болмаса, мына резервтік нұсқаны қолданамыз:
    const scaleFont = (base: number) => base;

    const styles = createStyles(colors, scaleFont);
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadAnnouncement = useCallback(async () => {
        const id = Number(announcementId);
        if (!announcementId || !Number.isInteger(id) || id <= 0) {
            setError('Жаңалық табылмады.');
            setLoading(false);
            return;
        }

        try {
            setError(null);
            setLoading(true);
            setAnnouncement(await getAnnouncement(id));
        } catch {
            setError('Жаңалықты жүктеу мүмкін болмады. Интернетті тексеріп, қайталап көріңіз.');
        } finally {
            setLoading(false);
        }
    }, [announcementId]);

    useEffect(() => {
        loadAnnouncement();
    }, [loadAnnouncement]);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/news');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <Pressable style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Жаңалық</Text>
                </SafeAreaView>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Text style={styles.errorText}>{error}</Text>
                    {announcementId ? (
                        <Button title="Қайталау" onPress={loadAnnouncement} color={colors.primary} />
                    ) : null}
                </View>
            ) : announcement ? (
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.title}>{announcement.title}</Text>
                    <Text style={styles.body}>{announcement.body}</Text>
                </ScrollView>
            ) : null}
        </View>
    );
}

// Стильдер функциясы (түстер өзгергенде стильдер де автоматты түрде жаңарады)
function createStyles(colors: AppTheme, scaleFont: (base: number) => number) {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        header: {
            // Егер colors.header жоқ болса, негізгі түсті қолданамыз
            backgroundColor: (colors as any).header || colors.primary,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
            paddingHorizontal: 20,
            paddingBottom: 20,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 6,
        },
        headerTitle: {
            // Егер colors.headerText жоқ болса, ақ түсті қолданамыз
            color: (colors as any).headerText || '#FFFFFF',
            fontSize: scaleFont(22),
            fontWeight: 'bold',
            marginTop: 12,
        },
        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        errorText: {
            color: colors.text,
            fontSize: scaleFont(15),
            textAlign: 'center',
            marginBottom: 16,
        },
        content: { padding: 20 },
        title: {
            color: colors.text,
            fontSize: scaleFont(22),
            fontWeight: 'bold',
            marginBottom: 16,
        },
        body: {
            color: colors.text,
            fontSize: scaleFont(16),
            lineHeight: scaleFont(24),
        },
    });
}