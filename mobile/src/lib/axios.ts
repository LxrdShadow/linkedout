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
    (error) => {
        const status = error.response?.status;
        const getToLogin = () => {
            router.dismissAll();
            router.replace("/login");
        };

        if (status === 401) {
            Alert.alert("Unauthorized", "Please log in again.");
            getToLogin();
        } else if (status === 500) {
            Alert.alert("Server error", "Something broke on the backend.");
            getToLogin();
        }

        return Promise.reject(error);
    },
);

export default api;
