import { useState, useEffect } from "react";
import { View, StyleSheet, Button, Alert, Text } from "react-native";
import { useAudioRecorder, AudioModule, RecordingPresets } from "expo-audio";

export default function App() {
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const [isRecording, setIsRecording] = useState(false);
    const [uri, setUri] = useState("");

    const record = async () => {
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
        setIsRecording(true);
    };

    const stopRecording = async () => {
        // The recording will be available on `audioRecorder.uri`.
        await audioRecorder.stop();
        setIsRecording(false);
    };

    const showUri = () => {
        setUri(String(audioRecorder.uri));
    };

    useEffect(() => {
        (async () => {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
                Alert.alert("Permission to access microphone was denied");
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Button
                title={isRecording ? "Stop Recording" : "Start Recording"}
                onPress={isRecording ? stopRecording : record}
            />
            <Button title="Show uri" onPress={showUri} />
            <Text>{uri}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#ecf0f1",
        padding: 10,
    },
});
