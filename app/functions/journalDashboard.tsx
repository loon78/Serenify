import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import styles from "../styles/journalStyles";
import { journalStorage, JournalEntry } from "@/app/services";
import { format } from "date-fns";

export default function JournalDashboard() {
  const router = useRouter();
  const [journals, setJournals] = useState<JournalEntry[]>([]);

  const loadJournals = async () => {
    try {
      const entries = await journalStorage.getRecentEntries(50);
      setJournals(entries);
    } catch (error) {
      console.error("Error loading journals:", error);
    }
  };

  // Load journals when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadJournals();
    }, [])
  );

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Journal",
      "Are you sure you want to delete this journal entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await journalStorage.deleteEntry(id);
              await loadJournals();
            } catch (error) {
              console.error("Error deleting journal:", error);
              Alert.alert("Error", "Failed to delete journal entry");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

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
            <View style={styles.journalCard}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "../functions/journalEntry",
                    params: { 
                      id: item.id, 
                      date: formatDate(item.createdAt), 
                      text: item.text || "",
                      moodScore: item.moodScore?.toString() || "",
                    },
                  })
                }
              >
                <View style={styles.journalCardHeader}>
                  <Text style={styles.journalDate}>{formatDate(item.createdAt)}</Text>
                  {item.moodScore && (
                    <View style={styles.moodScoreBadge}>
                      <Text style={styles.moodScoreBadgeText}>{item.moodScore}/10</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.journalText} numberOfLines={2}>
                  {item.text || "No text"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#e76f51" />
              </TouchableOpacity>
            </View>
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
