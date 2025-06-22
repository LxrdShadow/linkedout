import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../lib/axios";
import { Alert } from "react-native";
import { handleApiError } from "../lib/errors";

type User = {
    id: string;
    email: string;
    username?: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (
        email: string,
        password: string,
        confirmPassword: string,
    ) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const storeTokens = async (access: string, refresh: string) => {
        await SecureStore.setItemAsync("access_token", access);
        await SecureStore.setItemAsync("refresh_token", refresh);
    };

    const getAccessToken = () => SecureStore.getItemAsync("access_token");

    const clearTokens = async () => {
        await SecureStore.deleteItemAsync("access_token");
        await SecureStore.deleteItemAsync("refresh_token");
    };

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const token = await getAccessToken();
            if (!token) {
                setUser(null);
                return;
            }

            const { data } = await api.get("/auth/me");
            setUser(data);
        } catch (err) {
            console.warn(
                "Erreur lors de la vérification de l'utilisateur",
                err,
            );
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { data } = await api.post(
                `/auth/login`,
                {
                    username: email,
                    password,
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );
            await storeTokens(data.access_token, data.refresh_token);

            const { data: userData } = await api.get("/auth/me");
            setUser(userData.user);

            setIsLoading(false);
            return true;
        } catch (err: any) {
            setUser(null);
            const newErr = handleApiError(err);
            Alert.alert(String(newErr));
            console.log(newErr);
            return false;
        }
    };

    const register = async (
        email: string,
        password: string,
        confirmPassword: string,
    ) => {
        setIsLoading(true);
        try {
            await api.post("/auth/register", {
                email,
                password,
                confirmPassword,
            });
            setIsLoading(false);
            return true;
        } catch (err: any) {
            const newErr = handleApiError(err);
            Alert.alert(String(newErr));
            console.log(newErr);
            return false;
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await clearTokens();
            setUser(null);
        } catch (err) {
            console.warn("Erreur lors de la déconnexion", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used in AuthProvider");
    return context;
};
