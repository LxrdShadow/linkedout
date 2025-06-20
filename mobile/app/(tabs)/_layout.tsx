import { Tabs } from "expo-router";

const _Layout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{ title: "Home", headerShown: false }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{ title: "Dashboard", headerShown: false }}
            />
            <Tabs.Screen
                name="interview"
                options={{ title: "Interview", headerShown: false }}
            />
            <Tabs.Screen
                name="profile"
                options={{ title: "Profile", headerShown: false }}
            />
        </Tabs>
    );
};

export default _Layout;
