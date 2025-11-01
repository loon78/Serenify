import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  onNavigate?: (screen: "login" | "signup") => void;
};

export default function Signup({ onNavigate }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);

  const COLORS = {
    light1: "#FFE9EB",
    light2: "#FCD9DC",
    mid: "#F5C1C5",
    accent: "#EFB0B7",
    strong: "#DB7C87",
  };

  const handleCreate = () => {
    if (!fullName.trim()) return Alert.alert("Validation", "Please enter your full name");
    if (!email || !email.includes("@")) return Alert.alert("Validation", "Please enter a valid email");
    if (!password || password.length < 6) return Alert.alert("Validation", "Password must be at least 6 characters");
    if (password !== confirm) return Alert.alert("Validation", "Passwords do not match");
    if (!agree) return Alert.alert("Validation", "You must agree to the Terms of Service and Privacy Policy");

    // TODO: wire to real signup backend
    Alert.alert("Account created", "Your account has been created. Please sign in.", [
      { text: "OK", onPress: () => onNavigate && onNavigate("login") },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: COLORS.light1 }]}
    >
      <View style={styles.topSection}>
        <View style={styles.logoWrap} accessible accessibilityLabel="Serenify logo">
          {/* try to load vector Logo, fall back to emoji if missing */}
          {(() => {
            try {
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              const Logo = require("./components/Logo").default;
              return <Logo size={84} />;
            } catch (e) {
              return <Text style={styles.logoEmoji}>❤️</Text>;
            }
          })()}
        </View>

        <Text style={styles.title}>Begin Your Journey Here</Text>
        <Text style={styles.caption}>Create an account to continue your wellness journey</Text>
      </View>

      <View style={[styles.card, { backgroundColor: COLORS.mid }]}>
        <Text style={styles.fieldLabel}>Full name</Text>
        <TextInput value={fullName} onChangeText={setFullName} style={styles.input} placeholder="Jane Doe" />

        <Text style={styles.fieldLabel}>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.fieldLabel}>Password</Text>
        <TextInput value={password} onChangeText={setPassword} style={styles.input} placeholder="Create a password" secureTextEntry />

        <Text style={styles.fieldLabel}>Confirm password</Text>
        <TextInput value={confirm} onChangeText={setConfirm} style={styles.input} placeholder="Repeat password" secureTextEntry />

        <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgree(!agree)}>
          <View style={[styles.checkbox, agree && styles.checkboxChecked]}>{agree ? <Text style={styles.checkMark}>✓</Text> : null}</View>
          <Text style={styles.checkboxText}>I agree to the Terms of Service and Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.strong }]} onPress={handleCreate}>
          <Text style={styles.buttonText}>Create account</Text>
        </TouchableOpacity>

        <View style={styles.rowCenter}>
          <Text style={styles.smallText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => onNavigate && onNavigate("login")}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  topSection: {
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#DB7C87",
    marginBottom: 6,
  },
  caption: {
    color: "#EFB0B7",
    fontSize: 13,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldLabel: {
    marginBottom: 6,
    color: "#6b4146",
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    height: 46,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EFB0B7",
    color: "#222",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#caa",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#DB7C87",
    borderColor: "#DB7C87",
  },
  checkMark: {
    color: "#fff",
    fontSize: 12,
  },
  checkboxText: {
    flex: 1,
    color: "#6b4146",
    fontSize: 13,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  smallText: {
    color: "#6b4146",
    fontSize: 14,
  },
  linkText: {
    color: "#DB7C87",
    fontWeight: "700",
    fontSize: 14,
  },
  logoWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FCD9DC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 44,
    color: "#DB7C87",
  },
});
