import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";
import styles from "../styles/journalStyles";

export default function JournalEntry() {
  const { date, text, moodScore: rawMood } = useLocalSearchParams();
  const entryText = String(text ?? "");
  const entryDate = String(date ?? "");
  const moodScore = rawMood ? parseInt(String(rawMood), 10) : undefined;

  const [aiReply, setAiReply] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildPrompt = () => {
    if (moodScore != null && !Number.isNaN(moodScore)) {
      return `User journal entry (${entryDate}):
${entryText}

Mood score: ${moodScore}/10.

If the mood score is less than 5, respond with a short, empathetic, non-judgmental supportive message: acknowledge feelings, offer 3 simple coping steps the user can do right now, and ask one open question to encourage reflection. If the mood score is 8 or higher, respond with a short congratulatory message and 2 suggestions to maintain wellbeing. Keep the response under ~120 words.`;
    }

    return `User journal entry (${entryDate}):
${entryText}

Provide a short empathetic reflection and one practical suggestion for the user. Keep it brief.`;
  };

  const fetchAiReply = async () => {
    setLoadingAi(true);
    setError(null);
    setAiReply(null);
    try {
      const prompt = buildPrompt();
      const res = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Status ${res.status}`);
      }
      const json = await res.json();
      const msg = json?.message ?? json?.error ?? null;
      setAiReply(typeof msg === "string" ? msg : JSON.stringify(msg));
    } catch (err: any) {
      console.error("AI request failed:", err);
      setError("Could not get AI advice. Try again.");
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    // auto-run AI helper when page loads if there is text
    if (entryText.trim().length > 0) {
      fetchAiReply();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Journal Entry</Text>

      <View style={styles.journalDetailCard}>
        <View style={styles.journalCardHeader}>
          <Text style={styles.journalDate}>{entryDate}</Text>

          {moodScore != null && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.moodScoreBadge}>
                <Text style={styles.moodScoreBadgeText}>{moodScore}/10</Text>
              </View>
            </View>
          )}
        </View>

        <ScrollView style={{ maxHeight: 360 }}>
          <Text style={styles.journalText}>{entryText}</Text>
        </ScrollView>

        {moodScore != null && (
          <View style={styles.moodScoreContainer}>
            <Text style={styles.moodScoreLabel}>Mood Score:</Text>
            <Text style={styles.moodScoreValue}>{moodScore}/10</Text>
          </View>
        )}

        {/* AI response shown directly in the journal container */}
        <View style={{ marginTop: 14 }}>
          {loadingAi && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator size="small" color="#DB7C87" />
              <Text style={{ marginLeft: 8, color: "#6b4146" }}>Generating advice...</Text>
            </View>
          )}

          {error && <Text style={{ color: "#b22222", marginTop: 8 }}>{error}</Text>}

          {aiReply && (
            <View
              style={{
                marginTop: 12,
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 14,
                borderWidth: 1,
                borderColor: "#F5C1C5",
              }}
            >
              <Text style={{ color: "#6b4146", fontSize: 14, marginBottom: 8, fontWeight: "bold" }}>from serenify</Text>
              <Text style={{ color: "#6b4146", fontSize: 16 }}>{aiReply}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
