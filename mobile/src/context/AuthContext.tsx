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
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
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
    const getRefreshToken = () => SecureStore.getItemAsync("refresh_token");

    const clearTokens = async () => {
        await SecureStore.deleteItemAsync("access_token");
        await SecureStore.deleteItemAsync("refresh_token");
    };

    const refreshTokens = async () => {
        try {
            const refreshToken = await getRefreshToken();
            if (!refreshToken) throw new Error("Aucun refresh token");

            const { data } = await api.post("/auth/refresh", {
                refresh_token: refreshToken,
            });

            await storeTokens(data.accessToken, data.refreshToken);

            return data.accessToken;
        } catch (err) {
            await logout();
            throw err;
        }
    };

    // Auto-attach access token + handle refresh logic
    useEffect(() => {
        const setupInterceptors = () => {
            api.interceptors.response.use(
                (response) => response,
                async (error) => {
                    const originalRequest = error.config;
                    const status = error.response?.status;

                    if (
                        status === 401 &&
                        !originalRequest._retry &&
                        !(originalRequest.url || "").includes("/auth/refresh")
                    ) {
                        originalRequest._retry = true;

                        try {
                            const newAccessToken = await refreshTokens();
                            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                            return api(originalRequest);
                        } catch (refreshErr) {
                            return Promise.reject(refreshErr);
                        }
                    }

                    return Promise.reject(error);
                },
            );
        };

        setupInterceptors();
    }, []);

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
            console.warn("Auth check failed", err);
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
        try {
            const { data } = await api.post("/auth/login", { email, password });
            await storeTokens(data.accessToken, data.refreshToken);

            const { data: userData } = await api.get("/auth/me");
            setUser(userData.user);
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await api.post("/auth/register", { email, password });
            await login(email, password);
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed");
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
            console.warn("Logout error:", err);
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
