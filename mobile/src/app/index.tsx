import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const Index = () => {
    const { user, login } = useAuth();
    useEffect(() => {
        // login("test@gmail.com");
    }, []);

    if (!user) {
        return <Redirect href="/login" />;
    }
};

export default Index;
