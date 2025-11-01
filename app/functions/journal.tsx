import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Journal() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="journal" size={80} color="#34C759" />
        <Text style={styles.title}>Journal</Text>
        <Text style={styles.description}>
          Write down your thoughts, feelings, and experiences in your personal journal
        </Text>
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12,
    color: "#1A1A1A",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  comingSoonBadge: {
    backgroundColor: "#34C759",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  comingSoonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

