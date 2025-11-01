import React from "react";
import {
    Alert,
    Animated,
    Easing,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  onNavigate?: (screen: "login" | "signup" | "home" | "emergency" | "addContact") => void;
  familyContacts?: Contact[];
};

type Contact = {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  note?: string;
};

const COUNSELLING_CONTACTS: Contact[] = [
  { id: "p3", name: "MIASA Crisis Helpline", phone: "1-800-18-0066", note: "Call / WhatsApp — 24/7 (Malaysia)" },
  { id: "p4", name: "Talian Kasih", phone: "15999", note: "Talian Kasih nasional — bantuan sokongan (Malaysia)" },
];

export default function EmergencyContact({ onNavigate, familyContacts = [] }: Props) {
  const waveAnims = React.useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const waveLoops = React.useRef<any[]>([]);

  function startWaves() {
    stopWaves();
    waveLoops.current = [];
    waveAnims.forEach((val, i) => {
      const seq = Animated.sequence([
        Animated.timing(val, { toValue: 1, duration: 1800, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(val, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]);
      const loop = Animated.loop(seq);
      // staggered start
      const timeout = setTimeout(() => loop.start(), i * 500);
      waveLoops.current.push({ loop, timeout });
    });
  }

  function stopWaves() {
    waveLoops.current.forEach((item) => {
      try {
        if (item.loop && item.loop.stop) item.loop.stop();
      } catch (e) {
        /* ignore */
      }
      if (item.timeout) clearTimeout(item.timeout);
    });
    waveLoops.current = [];
    waveAnims.forEach((v) => v.setValue(0));
  }

  React.useEffect(() => {
    return () => {
      stopWaves();
    };
  }, []);
  async function dial(number: string) {
    const formatted = Platform.OS === "android" ? `tel:${number}` : `telprompt:${number}`;
    try {
      const supported = await Linking.canOpenURL(formatted);
      if (supported) {
        Linking.openURL(formatted);
      } else {
        Alert.alert("Cannot make call", `Unable to call ${number} from this device.`);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to start call.");
    }
  }

  // SMS functionality removed per request; only direct calls are provided.

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate && onNavigate("home")}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoEmoji}>❤️</Text>
          </View>
          <Text style={styles.title}>Emergency Support</Text>
          <Text style={styles.subtitle}>You're not alone. We're here for you.</Text>
        </View>

        {/* Notice card */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Crisis Support Available</Text>
          <Text style={styles.noticeText}>
            If you're in immediate danger, call emergency services (999) or go to the nearest emergency room.
          </Text>
        </View>

        {/* Center help button */}
        <View style={styles.centerRow}>
          <Pressable
            accessibilityLabel="Hold 3 seconds to call emergency"
            style={({ pressed }) => [styles.helpButton, pressed && styles.helpButtonPressed]}
            onLongPress={() => {
              stopWaves();
              dial("999");
            }}
            delayLongPress={3000}
            onPressIn={() => startWaves()}
            onPressOut={() => stopWaves()}
          >
            {/* animated waves behind the button */}
            {waveAnims.map((val, idx) => {
              const scale = val.interpolate({ inputRange: [0, 1], outputRange: [0.2, 3.0] });
              const opacity = val.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] });
              return (
                <Animated.View
                  key={`wave-${idx}`}
                  pointerEvents="none"
                  style={[
                    styles.wave,
                    {
                      transform: [{ scale }],
                      opacity,
                    },
                  ]}
                />
              );
            })}

            <Text style={styles.helpTitle}>I Need Help...</Text>
            <Text style={styles.helpCaption}>press for 3 s</Text>
          </Pressable>
        </View>

        {/* Professional Help */}
        <Text style={styles.sectionTitle}>Professional Help</Text>
        {COUNSELLING_CONTACTS.map((c) => (
          <View key={c.id} style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.name}>{c.name}</Text>
              <Text style={styles.phone}>{c.phone}</Text>
              {c.note ? <Text style={styles.note}>{c.note}</Text> : null}
            </View>
            <View style={styles.actionsSingle}>
              <TouchableOpacity accessibilityLabel={`Call ${c.name}`} style={styles.actionBtn} onPress={() => dial(c.phone)}>
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Personal / Family */}
        <Text style={styles.sectionTitle}>Your Support Circle</Text>

        {familyContacts.length === 0 ? (
          <Text style={styles.emptyText}>No contacts yet. Add someone below.</Text>
        ) : (
          familyContacts.map((c: Contact) => (
            <View key={c.id} style={styles.cardAlt}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{c.name.split(" ")[0][0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.name}</Text>
                {c.relationship ? <Text style={styles.note}>{c.relationship}</Text> : null}
                <Text style={styles.phone}>{c.phone}</Text>
              </View>
              <View style={styles.actionsSingle}>
                <TouchableOpacity accessibilityLabel={`Call ${c.name}`} style={styles.actionBtn} onPress={() => dial(c.phone)}>
                  <Text style={styles.actionText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Add contact - navigates to a separate screen */}
        <TouchableOpacity
          style={[styles.addBtn, styles.addBtnFull]}
          onPress={() => onNavigate && onNavigate("addContact")}
          accessibilityLabel="Add contact"
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>

        <Text style={styles.noteFooter}>
          Remember: Reaching out is a sign of strength, not weakness 💗
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFE9EB",
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F5C1C5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoEmoji: { fontSize: 28 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#DB7C87",
    marginBottom: 6,
  },
  subtitle: {
    color: "#EFB0B7",
    marginBottom: 12,
  },
  noticeCard: {
    backgroundColor: "#FCD9DC",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  noticeTitle: { fontWeight: "700", color: "#6b4146", marginBottom: 6 },
  noticeText: { color: "#6b4146" },
  card: {
    backgroundColor: "#F5C1C5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardAlt: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  info: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6b4146",
  },
  phone: {
    marginTop: 4,
    color: "#3b2a2b",
    fontWeight: "600",
  },
  note: { marginTop: 2, color: "#6b4146", fontSize: 12 },
  actions: { marginLeft: 12, flexDirection: "row" },
  actionsSingle: { marginLeft: 12, flexDirection: "row", justifyContent: "flex-end" },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#DB7C87",
    marginLeft: 8,
  },
  actionText: { color: "#fff", fontWeight: "600" },
  msgBtn: { backgroundColor: "#EFB0B7" },
  msgText: { color: "#6b4146" },
  noteFooter: { marginTop: 16, color: "#6b4146", fontSize: 12, textAlign: "center" },
  centerRow: { marginVertical: 18, alignItems: "center", justifyContent: "center" },
  helpButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#DB7C87",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  helpButtonPressed: { backgroundColor: "#b24f57", transform: [{ scale: 0.98 }] },
  helpTitle: { color: "#fff", fontWeight: "700", textAlign: "center", fontSize: 18 },
  helpCaption: { color: "#fff", opacity: 0.95, textAlign: "center", fontSize: 12, marginTop: 6 },
  backBtn: { marginBottom: 8 },
  backText: { color: "#6b4146", fontWeight: "600" },
  sectionTitle: { marginTop: 8, marginBottom: 6, color: "#6b4146", fontWeight: "700", fontSize: 16 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5C1C5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { fontWeight: "700", color: "#6b4146" },
  emptyText: { color: "#6b4146", textAlign: "center", marginVertical: 8 },
  inputBar: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  input: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#f0dfe0",
  },
  addBtn: {
    backgroundColor: "#DB7C87",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 24, lineHeight: 24 },
  addBtnFull: {
    width: "100%",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  wave: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.45)",
    top: 0,
    left: 0,
    backgroundColor: "transparent",
  },
  
});
