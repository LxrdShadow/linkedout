import { useRouter } from "expo-router";
import { createContext, useContext, useState, ReactNode } from "react";

type User = { id: string; email: string } | null;

type AuthContextType = {
    user: User;
    isLoggedIn: boolean;
    login: (email: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const login = (email: string) => {
        setUser({ id: "1", email });
        setIsLoggedIn(true);
        // router.replace("/home");
    };
    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
