export type RootStackParamList = {
    Login: undefined;
    Main: undefined;
    Details: { moodId: string; title: string; date: string; note: string };
};

export type MainTabParamList = {
    Home: undefined;
    AddMood: undefined;
    Stats: undefined;
    Profile: undefined;
};