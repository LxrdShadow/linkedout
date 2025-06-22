import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

const api = axios.create({
    baseURL: "http://localhost:8000/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

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
                const refreshToken =
                    await SecureStore.getItemAsync("refresh_token");
                if (!refreshToken) throw new Error("Aucun refresh token");

                const { data } = await api.post("/auth/refresh", {
                    refresh_token: refreshToken,
                });
                const newAccessToken = data.access_token;
                const newRefreshToken = data.refresh_token;

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                await SecureStore.setItemAsync("access_token", newAccessToken);
                await SecureStore.setItemAsync(
                    "refresh_token",
                    newRefreshToken,
                );
                return api(originalRequest);
            } catch (refreshErr) {
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    },
);
export default api;
