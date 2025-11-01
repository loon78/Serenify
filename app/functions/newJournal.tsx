import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../styles/journalStyles";

export default function NewJournal() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const router = useRouter();

  const handleRecord = async () => {
    if (!recording) {
      setRecording(true);
      // 🎙️ Placeholder for speech-to-text logic
      setTranscript("");
      setTimeout(() => {
        setTranscript("Today I felt a mix of motivation and tiredness. I want to balance work and rest better.");
        setRecording(false);
      }, 3000);
    } else {
      setRecording(false);
    }
  };

  const handleSave = () => {
    if (!transcript.trim()) return;
    // 💾 Placeholder for saving (AsyncStorage or DB)
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Journal</Text>

      <View style={styles.recordSection}>
        <TouchableOpacity
          onPress={handleRecord}
          style={[
            styles.recordButton,
            { backgroundColor: recording ? "#e76f51" : "#4f9cf9" },
          ]}
        >
          <Ionicons
            name={recording ? "stop" : "mic"}
            size={28}
            color="#fff"
          />
        </TouchableOpacity>
        <Text style={styles.recordStatus}>
          {recording ? "Recording..." : "Tap to Record"}
        </Text>

        {transcript ? (
          <ScrollView style={styles.transcriptBox}>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </ScrollView>
        ) : null}
      </View>

      {transcript ? (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Journal</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
