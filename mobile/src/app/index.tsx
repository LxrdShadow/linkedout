import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";

const Index = () => {
    const { user, isLoading } = useAuth();

    if ((!user || !user.is_verified) && !isLoading) {
        return <Redirect href="/login" />;
    } else if (!user?.username && !isLoading) {
        return <Redirect href="/setUsername" />;
    } else if (!isLoading) {
        return <Redirect href="/(tabs)" />;
    } else {
        return null;
    }
};

export default Index;
