import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";

const Index = () => {
    const { user, isLoading } = useAuth();

    if (!user && !isLoading) {
        return <Redirect href="/login" />;
    } else if (!isLoading) {
        return <Redirect href="/dashboard" />;
    } else {
        return null;
    }
};

export default Index;
