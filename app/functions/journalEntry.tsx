import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import styles from "../styles/journalStyles";

export default function JournalEntry() {
  const { date, text } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Journal Entry</Text>

      <View style={styles.journalDetailCard}>
        <Text style={styles.journalDate}>{date}</Text>
        <Text style={styles.journalText}>{text}</Text>
      </View>
    </View>
  );
}
