import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import styles from "../styles/journalStyles";

export default function JournalEntry() {
  const { date, text, moodScore } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Journal Entry</Text>

      <View style={styles.journalDetailCard}>
        <View style={styles.journalCardHeader}>
          <Text style={styles.journalDate}>{date}</Text>
          {moodScore && (
            <View style={styles.moodScoreBadge}>
              <Text style={styles.moodScoreBadgeText}>{moodScore}/10</Text>
            </View>
          )}
        </View>
        <Text style={styles.journalText}>{text}</Text>
        {moodScore && (
          <View style={styles.moodScoreContainer}>
            <Text style={styles.moodScoreLabel}>Mood Score:</Text>
            <Text style={styles.moodScoreValue}>{moodScore}/10</Text>
          </View>
        )}
      </View>
    </View>
  );
}
