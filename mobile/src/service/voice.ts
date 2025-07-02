import * as FileSystem from "expo-file-system";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import api from "../lib/axios";
import { isAxiosError } from "axios";

const recordingOptions = Audio.RecordingOptionsPresets.HIGH_QUALITY;

export async function startRecording() {
    // Request microphone permission using the non-deprecated method
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== "granted") {
        console.log("Permission to access microphone was denied");
        return;
    }

    try {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
            playThroughEarpieceAndroid: true,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(recordingOptions);
        await recording.startAsync();

        // You can store this recording instance to stop later
        return recording;
    } catch (error) {
        console.error("Failed to start recording", error);
        return null;
    }
}

export async function stopRecording(recording: any) {
    try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Recording stopped and stored at", uri);
        return uri;
    } catch (error) {
        console.error("Failed to stop recording", error);
        return null;
    }
}

interface TranscriptionResponse {
    transcript: string;
}

export async function uploadAudio(uri: string): Promise<string | null> {
    try {
        // 1. Verify file exists
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
            throw new Error("Audio file does not exist");
        }

        // 2. Create FormData with proper typing
        const formData = new FormData();

        // React Native specific file object format
        const file = {
            uri,
            name: "recording.wav",
            type: "audio/wav",
        } as unknown as Blob; // Type assertion needed for React Native

        formData.append("audio", file);

        // 3. Make the request
        const response = await api.post<TranscriptionResponse>(
            "YOUR_API_ENDPOINT",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Accept: "application/json",
                },
                transformRequest: () => formData, // Bypass Axios serialization
            },
        );

        // 4. Return transcript
        return response.data.transcript;
    } catch (error) {
        if (isAxiosError(error)) {
            console.error(
                "Upload failed:",
                error.response?.data?.message || error.message,
            );
        } else {
            console.error("Unexpected error:", error);
        }
        return null;
    }
}
