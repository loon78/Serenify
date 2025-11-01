import React from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onNavigate?: (screen: "login" | "signup" | "home" | "emergency") => void;
};

export default function Home({ onNavigate }: Props) {
  const callEmergencyNumber = async () => {
    const number = "999";
    const url = `tel:${number}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert("Error", `Can't open dialer for ${number}`);
        return;
      }
      // Confirm before dialing
      Alert.alert("Call Emergency", `Call ${number}?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Call", style: "destructive", onPress: () => Linking.openURL(url) },
      ]);
    } catch (e) {
      Alert.alert("Error", "Unable to open dialer");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Serenify</Text>
      <Text style={styles.subtitle}>Your dashboard for wellbeing</Text>

      <View style={styles.centerRow}>
        <Pressable
          accessibilityLabel="Hold 3 seconds to call emergency"
          style={({ pressed }) => [
            styles.emergencyButton,
            pressed && styles.emergencyButtonPressed,
          ]}
          onLongPress={callEmergencyNumber}
          delayLongPress={3000}
        >
          <Text style={styles.emergencyText}>Hold 3s to call 999</Text>
        </Pressable>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => onNavigate && onNavigate("emergency")}>
        <Text style={styles.buttonText}>Emergency Contacts</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => onNavigate && onNavigate("login")}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFE9EB",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#DB7C87",
    marginBottom: 8,
  },
  subtitle: {
    color: "#EFB0B7",
    marginBottom: 20,
  },
  centerRow: {
    marginVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#DB7C87",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyButtonPressed: {
    backgroundColor: "#b24f57",
    transform: [{ scale: 0.98 }],
  },
  emergencyText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
  button: {
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: "#DB7C87",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
