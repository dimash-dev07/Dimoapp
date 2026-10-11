import { useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, View } from 'react-native';
import { SectionTitle, ServiceCard } from '../components';
import { services } from '../data/services';
import { colors, spacing } from '../styles/theme';
import { Service } from '../types/service';

export function ServicesScreen() {
    const navigation = useNavigation<any>();

    const openService = (service: Service) => {
        navigation.navigate('Details', {
            serviceId: service.id,
            title: service.title,
        });
    };

    return (
        <View style={styles.container}>
            <SectionTitle
                title="Services"
                subtitle="Everything you need in one place"
            />
            <FlatList
                data={services}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ServiceCard service={item} onPress={openService} />
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
});