import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../styles/theme';

type Props = {
    title: string;
    subtitle?: string;
};

export function SectionTitle({ title, subtitle }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: colors.muted,
        marginTop: 4,
    },
});