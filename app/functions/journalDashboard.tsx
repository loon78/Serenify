import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import styles from "../styles/journalStyles";

export default function JournalDashboard() {
  const router = useRouter();
  const [journals, setJournals] = useState([
    { id: "1", date: "Oct 25, 2025", text: "Felt anxious but managed through breathing exercises." },
    { id: "2", date: "Oct 26, 2025", text: "Had a good day meeting old friends." },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Journals</Text>

      {journals.length === 0 ? (
        <Text style={styles.emptyText}>No journals yet. Start recording your thoughts!</Text>
      ) : (
        <FlatList
          data={journals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.journalCard}
              onPress={() =>
                router.push({
                  pathname: "../functions/journalEntry",
                  params: { id: item.id, date: item.date, text: item.text },
                })
              }
            >
              <Text style={styles.journalDate}>{item.date}</Text>
              <Text style={styles.journalText} numberOfLines={2}>{item.text}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => router.push("../functions/newJournal")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
