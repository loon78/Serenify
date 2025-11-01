import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function MoodCheck() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="happy" size={80} color="#FF9500" />
        <Text style={styles.title}>Mood Check Aid</Text>
        <Text style={styles.description}>
          Track and analyze your mood patterns to better understand your emotional well-being
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
    backgroundColor: "#FF9500",
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

