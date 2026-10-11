import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../styles/theme';
import { Service } from '../types/service';

type Props = {
    service: Service;
    onPress: (service: Service) => void;
};

export function ServiceCard({ service, onPress }: Props) {
    return (
        <Pressable
            onPress={() => onPress(service)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
            <Text style={styles.title}>{service.title}</Text>
            <Text style={styles.description}>{service.description}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.sm,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    pressed: {
        opacity: 0.7,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    description: {
        fontSize: 13,
        color: colors.muted,
        marginTop: 4,
    },
});