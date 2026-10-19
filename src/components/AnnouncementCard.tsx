import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { Announcement } from '../types/announcement';

type Props = {
    item: Announcement;
    onPress: () => void;
};

export function AnnouncementCard({ item, onPress }: Props) {
    const { colors } = useSettings();

    return (
        <Pressable
            onPress={onPress}
            style={[styles.card, { backgroundColor: colors.card }]}
        >
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={[styles.body, { color: colors.muted }]} numberOfLines={2}>
                    {item.body}
                </Text>
            </View>
            <Text style={{ color: colors.muted }}>›</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        marginRight: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    body: {
        fontSize: 14,
    },
});