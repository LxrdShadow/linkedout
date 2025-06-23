import { Tabs } from "expo-router";
import FeatherIcon from "@react-native-vector-icons/feather";
import LucideIcon from "@react-native-vector-icons/lucide";

const RootLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarItemStyle: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 5,
                },
                tabBarStyle: {
                    backgroundColor: "#FFF",
                    borderRadius: 50,
                    marginHorizontal: 20,
                    marginBottom: 10,
                    height: 52,
                    position: "absolute",
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#FFF",
                    shadowColor: "#555F",
                    shadowOpacity: 0,
                },
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Accueil",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <FeatherIcon
                            name="home"
                            size={25}
                            color={focused ? "#1F2C47" : "#22222277"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Dashboard",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <LucideIcon
                            name="layout-dashboard"
                            size={25}
                            color={focused ? "#1F2C47" : "#22222277"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="interview"
                options={{
                    title: "Interview",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <LucideIcon
                            name="square-play"
                            size={25}
                            color={focused ? "#1F2C47" : "#22222277"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <LucideIcon
                            name="circle-user"
                            size={27}
                            color={focused ? "#1F2C47" : "#22222277"}
                        />
                    ),
                }}
            />
        </Tabs>
    );
};

export default RootLayout;
