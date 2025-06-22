import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../lib/axios";
import { Alert } from "react-native";

type User = {
    id: string;
    email: string;
    username?: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<object>;
    register: (
        email: string,
        password: string,
        confirmPassword: string,
    ) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            setUser(data.user);
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
        setError(null);
        let tokens = {};
        try {
            const { data } = await api.post(
                "/auth/login",
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
            tokens = await data;

            const { data: userData } = await api.get("/auth/me");
            setUser(userData.user);
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Erreur lors de la connexion",
            );
            setUser(null);
        } finally {
            setIsLoading(false);
            return tokens;
        }
    };

    const register = async (
        email: string,
        password: string,
        confirmPassword: string,
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            await api.post("/auth/register", {
                email,
                password,
                confirmPassword,
            });
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Erreur lors de l'inscription",
            );
        } finally {
            setIsLoading(false);
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
                error,
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
