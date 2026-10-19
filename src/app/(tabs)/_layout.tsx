import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../i18n/LanguageContext';

export default function TabsLayout() {
    const { t } = useLanguage();
    const { colors, scaleFont } = useSettings();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.tabInactive,
                tabBarStyle: {
                    height: 68,
                    paddingBottom: 10,
                    paddingTop: 8,
                    borderTopWidth: 0,
                    elevation: 10,
                    backgroundColor: colors.tabBar,
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                },
                tabBarLabelStyle: { fontSize: scaleFont(11), fontWeight: '600' },
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
            {/* ЖАҢА ҚОСЫЛҒАН ТАБ: Жаңалықтар */}
            <Tabs.Screen
                name="news"
                options={{
                    tabBarLabel: 'Жаңалықтар',
                    tabBarIcon: ({ color, size }) => <Ionicons name="newspaper" size={size} color={color} />,
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