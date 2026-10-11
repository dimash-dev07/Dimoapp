import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';

export default function TabsLayout() {
    const { t } = useLanguage();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#1E4FD8',
                tabBarInactiveTintColor: '#9AA5B1',
                tabBarStyle: {
                    height: 68, paddingBottom: 10, paddingTop: 8,
                    borderTopWidth: 0, elevation: 10,
                    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
                },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarLabel: t.home,
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="add-mood"
                options={{
                    tabBarLabel: t.mood,
                    tabBarIcon: ({ color, size }) => <Ionicons name="happy" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="journal"
                options={{
                    tabBarLabel: t.journal,
                    tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    tabBarLabel: t.stats,
                    tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: t.profile,
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}