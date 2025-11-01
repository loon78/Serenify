import { JournalEntry, journalStorage, processAudioJournal, voiceRecording } from "@/app/services";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../styles/journalStyles";

export default function NewJournal() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const router = useRouter();

  // Track recording duration
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (recording) {
      interval = setInterval(async () => {
        const status = await voiceRecording.getStatus();
        if (status) {
          setDuration(Math.floor(status.durationMillis / 1000));
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recording]);

  const handleRecord = async () => {
    try {
      if (!recording) {
        // Start recording
        await voiceRecording.startRecording();
        setRecording(true);
        setTranscript("");
        setMoodScore(null);
        setDuration(0);
      } else {
        // Stop recording and process
        const result = await voiceRecording.stopRecording();
        setRecording(false);
        
        if (result) {
          setRecordingUri(result.uri);
          setIsProcessing(true);
          
          // Process audio with Gemini
          const response = await processAudioJournal(result.uri);
          
          if (response.success && response.transcript && response.moodScore) {
            setTranscript(response.transcript);
            setMoodScore(response.moodScore);
          } else {
            Alert.alert("Error", response.error || "Failed to process audio");
          }
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error("Recording error:", error);
      setRecording(false);
      Alert.alert("Error", "Failed to record audio. Please check permissions.");
    }
  };

  const handleSave = async () => {
    if (!transcript.trim()) return;
    
    try {
      const newEntry: Partial<JournalEntry> = {
        text: transcript,
        voiceUri: recordingUri || undefined,
        moodScore: moodScore || undefined,
      };
      
      await journalStorage.createEntry(newEntry);
      router.back();
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to save journal entry");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Journal</Text>

      <View style={styles.recordSection}>
        <TouchableOpacity
          onPress={handleRecord}
          disabled={isProcessing}
          style={[
            styles.recordButton,
            { backgroundColor: recording ? "#e76f51" : "#4f9cf9" },
          ]}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons
              name={recording ? "stop" : "mic"}
              size={28}
              color="#fff"
            />
          )}
        </TouchableOpacity>
        <Text style={styles.recordStatus}>
          {isProcessing
            ? "Processing..."
            : recording
            ? `Recording... ${voiceRecording.formatDuration(duration)}`
            : "Tap to Record"}
        </Text>

        {transcript ? (
          <ScrollView style={styles.transcriptBox}>
            <Text style={styles.transcriptText}>{transcript}</Text>
            {moodScore && (
              <View style={styles.moodScoreContainer}>
                <Text style={styles.moodScoreLabel}>Mood Score:</Text>
                <Text style={styles.moodScoreValue}>{moodScore}/10</Text>
              </View>
            )}
          </ScrollView>
        ) : null}
      </View>

      {transcript && !isProcessing ? (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Journal</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
