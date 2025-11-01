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

const COLORS = {
  light1: "#FFE9EB",
  light2: "#FCD9DC",
  mid: "#F5C1C5",
  accent: "#EFB0B7",
  strong: "#DB7C87",
};

type Props = {
  onNavigate?: (screen: "signup" | "login") => void;
};

export default function Login({ onNavigate }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    // Replace with real auth logic; for now show an alert
    Alert.alert("Logged in", `Welcome, ${email}`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.topSection}>
        <View style={styles.logoWrap} accessible accessibilityLabel="Serenify logo">
          {/* Replace emoji with vector logo component */}
          {/* Lazy import to avoid runtime errors if library isn't installed */}
          {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
          {(() => {
            try {
              // require at runtime so app doesn't crash if dependency missing
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              const Logo = require("./components/Logo").default;
              return <Logo size={72} />;
            } catch (e) {
              // fallback to heart emoji
              return <Text style={styles.logo}>❤️</Text>;
            }
          })()}
        </View>
        <Text style={styles.welcome}>Welcome back to Serenify</Text>
        <Text style={styles.caption}>Your journey to wellness continues here</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.fieldLabel}>Email</Text>
        <TextInput
          placeholder="you@example.com"
          placeholderTextColor="#8b5b60"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          accessibilityLabel="email input"
        />

        <Text style={styles.fieldLabel}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#8b5b60"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          accessibilityLabel="password input"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin} accessibilityLabel="login button">
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <View style={styles.rowCenter}>
          <Text style={styles.smallText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => onNavigate && onNavigate("signup")} accessibilityLabel="sign up">
            <Text style={styles.linkText}>Sign up</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.tos}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: COLORS.strong,
  },
  subtitle: {
    marginTop: 6,
    color: COLORS.accent,
    fontSize: 14,
  },
  topSection: {
    alignItems: "center",
    marginBottom: 18,
  },
  logoWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.light2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logo: {
    fontSize: 44,
    color: COLORS.strong,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.strong,
  },
  caption: {
    marginTop: 6,
    color: COLORS.accent,
    fontSize: 13,
  },
  fieldLabel: {
    marginBottom: 6,
    color: "#6b4146",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: COLORS.mid,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    height: 48,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.accent,
    color: "#222",
  },
  button: {
    backgroundColor: COLORS.strong,
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
  error: {
    color: "#7a1420",
    marginBottom: 8,
    textAlign: "center",
  },
  smallText: {
    marginTop: 0,
    textAlign: "center",
    color: "#6b4146",
    fontSize: 14,
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  linkText: {
    color: COLORS.strong,
    fontWeight: "700",
    fontSize: 14,
  },
  tos: {
    marginTop: 12,
    color: "#6b4146",
    fontSize: 11,
    textAlign: "center",
  },
});
