import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { SERVER_URL } from "../constants";

const api = axios.create({
    baseURL: SERVER_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync("access_token");
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
            !["/auth/login", "/auth/register", "/auth/refresh"].some((url) =>
                (originalRequest.url || "").includes(url),
            )
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken =
                    await SecureStore.getItemAsync("refresh_token");
                if (!refreshToken)
                    throw new Error("[hide]Aucun refresh token trouvé");

                const { data } = await api.post("/auth/refresh", {
                    token: refreshToken,
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
                router.replace("/login");
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    },
);
export default api;
