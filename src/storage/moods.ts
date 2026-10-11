import AsyncStorage from '@react-native-async-storage/async-storage';

export type MoodEntry = {
    id: string;
    mood: string;
    moodLabel: string;
    note: string;
    audioUri: string | null;
    date: string;
    createdAt: number;
};

const KEY = '@mental_pulse_moods';

// Барлық жазбаларды алу
export async function getAllMoods(): Promise<MoodEntry[]> {
    try {
        const data = await AsyncStorage.getItem(KEY);
        if (!data) return [];
        const list: MoodEntry[] = JSON.parse(data);
        return list.sort((a, b) => b.createdAt - a.createdAt);
    } catch (e) {
        console.error('getAllMoods error:', e);
        return [];
    }
}

// Жаңа жазба қосу
export async function addMood(entry: MoodEntry): Promise<void> {
    try {
        const list = await getAllMoods();
        list.unshift(entry);
        await AsyncStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {
        console.error('addMood error:', e);
    }
}

// Жазбаны жою
export async function deleteMood(id: string): Promise<void> {
    try {
        const list = await getAllMoods();
        const filtered = list.filter((m) => m.id !== id);
        await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
    } catch (e) {
        console.error('deleteMood error:', e);
    }
}

// Барлығын жою
export async function clearAll(): Promise<void> {
    try {
        await AsyncStorage.removeItem(KEY);
    } catch (e) {
        console.error('clearAll error:', e);
    }
}

// Бүгінгі күнді форматтау
export function formatDate(timestamp: number): string {
    const d = new Date(timestamp);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}