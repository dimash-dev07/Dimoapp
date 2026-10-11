import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    danger?: boolean;
};

export function ConfirmDialog({
    visible,
    title,
    message,
    confirmText = 'Иә',
    cancelText = 'Жоқ',
    onConfirm,
    onCancel,
    danger = false,
}: Props) {
    const showCancel = cancelText.trim().length > 0;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.btnRow}>
                        {showCancel ? (
                            <Pressable style={[styles.btn, styles.cancelBtn]} onPress={onCancel}>
                                <Text style={styles.cancelText}>{cancelText}</Text>
                            </Pressable>
                        ) : null}

                        <Pressable
                            style={[styles.btn, danger ? styles.dangerBtn : styles.confirmBtn]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmText}>{confirmText}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dialog: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    title: { fontSize: 18, fontWeight: 'bold', color: '#1A2233', marginBottom: 8 },
    message: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 24 },
    btnRow: { flexDirection: 'row', gap: 10 },
    btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    cancelBtn: { backgroundColor: '#F5F7FA' },
    cancelText: { color: '#1A2233', fontWeight: '700', fontSize: 15 },
    confirmBtn: { backgroundColor: '#1E4FD8' },
    dangerBtn: { backgroundColor: '#E5484D' },
    confirmText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});