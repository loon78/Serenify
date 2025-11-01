import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Reuse color palette from Login.tsx
const COLORS = {
  light1: "#FFE9EB",
  light2: "#FCD9DC",
  mid: "#F5C1C5",
  accent: "#EFB0B7",
  strong: "#DB7C87",
};

export default function Home() {
  const userName = "Guest"; // placeholder — replace with auth state when available

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.user}>{userName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Insights</Text>

          <View style={styles.insightCard}>
            <Text style={styles.insightHeading}>Mood Summary</Text>
            <Text style={styles.insightText}>You've logged your mood 3 times today. Average: Stable</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '60%' }]} />
            </View>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightHeading}>Sleep</Text>
            <Text style={styles.insightText}>Last night: 7 hrs — Good</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations for you</Text>

          <TouchableOpacity style={styles.recoCard} activeOpacity={0.8}>
            <Text style={styles.recoTitle}>5‑minute breathing</Text>
            <Text style={styles.recoText}>Quick exercise to reduce stress.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.recoCard} activeOpacity={0.8}>
            <Text style={styles.recoTitle}>Reflective journal</Text>
            <Text style={styles.recoText}>Write about one positive moment today.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.light1 },
  container: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 18 },
  welcome: { fontSize: 18, color: COLORS.strong },
  user: { fontSize: 28, fontWeight: '700', color: COLORS.strong, marginTop: 4 },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#333' },
  insightCard: { backgroundColor: COLORS.mid, padding: 12, borderRadius: 12, marginBottom: 10 },
  insightHeading: { fontSize: 14, fontWeight: '700', color: '#4a2a2c' },
  insightText: { fontSize: 13, color: '#5b3b3d', marginTop: 6 },
  progressBarBackground: { height: 8, backgroundColor: '#ffeefe', borderRadius: 8, marginTop: 10, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.strong },
  recoCard: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  recoTitle: { fontSize: 14, fontWeight: '700', color: '#222' },
  recoText: { fontSize: 13, color: '#555', marginTop: 6 },
});