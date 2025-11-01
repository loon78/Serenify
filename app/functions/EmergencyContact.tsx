import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  onNavigate?: (page: "home" | "emergency") => void;
};

export default function EmergencyContact({ onNavigate }: Props) {
  async function dialEmergency() {
    const number = "999";
    const url = Platform.OS === "android" ? `tel:${number}` : `telprompt:${number}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Cannot make call", `Unable to call ${number} from this device.`);
      }
    } catch (err) {
      console.warn("Dial failed", err);
      Alert.alert("Error", "Failed to start call.");
    }
  }

  // Local support circle state for this screen (starts empty)
  const [supportContacts, setSupportContacts] = useState<Array<{ id: string; name: string; relationship?: string; phone: string }>>([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRelationship, setNewRelationship] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // Wave animation refs (3 concentric waves)
  const waveAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;
  const waveLoops = useRef<Array<Animated.CompositeAnimation | null>>([null, null, null]).current;

  function startWaves() {
    // reset
    waveAnims.forEach((a) => a.setValue(0));
    waveAnims.forEach((anim, i) => {
      const seq = Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]);
      const loop = Animated.loop(seq);
      waveLoops[i] = loop;
      setTimeout(() => loop.start(), i * 250);
    });
  }

  function stopWaves() {
    waveLoops.forEach((loop, i) => {
      if (loop) {
        loop.stop();
        waveLoops[i] = null;
      }
      waveAnims[i].stopAnimation();
      waveAnims[i].setValue(0);
    });
  }

  useEffect(() => {
    return () => stopWaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAddContact() {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert("Missing fields", "Please enter a name and phone number.");
      return;
    }
    const contact = { id: String(Date.now()), name: newName.trim(), relationship: newRelationship.trim(), phone: newPhone.trim() };
    setSupportContacts((s) => [contact, ...s]);
    setNewName("");
    setNewRelationship("");
    setNewPhone("");
    setAdding(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Support</Text>
        <Text style={styles.subtitle}>You're not alone. We're here for you.</Text>
      </View>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>Crisis Support Available</Text>
        <Text style={styles.noticeText}>
          If you're in immediate danger, please call emergency services (999) or go to the nearest emergency room.
        </Text>
      </View>

      <View style={styles.centerWrap}>
        <View style={styles.centerSpacer} />
        <View style={styles.centerButtonWrap}>
          <View style={styles.wavesContainer} pointerEvents="none">
            {waveAnims.map((a, i) => {
              const scale = a.interpolate({ inputRange: [0, 1], outputRange: [0.3 + i * 0.15, 2.4 + i * 0.6] });
              const opacity = a.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] });
              return <Animated.View key={i} style={[styles.wave, { transform: [{ scale }], opacity }]} />;
            })}
          </View>
          <Pressable
            accessibilityLabel="Hold 3 seconds to call emergency"
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onLongPress={dialEmergency}
            delayLongPress={3000}
            onPressIn={startWaves}
            onPressOut={stopWaves}
          >
            <Text style={styles.buttonText}>I Need Help</Text>
            <Text style={styles.buttonSub}>hold 3s to call 999</Text>
          </Pressable>
        </View>
        <View style={styles.centerSpacer} />
      </View>

      <Text style={styles.sectionTitle}>Professional Help</Text>
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>MIASA Crisis Helpline</Text>
          <Text style={styles.noteSmall}>All topics · Everyone · 24/7 free & confidential</Text>
        </View>
        <View style={styles.actionsSingle}>
          <Text style={styles.callButton} onPress={() => Linking.openURL("tel:1800180066")}>Call 1-800-18-0066</Text>
        </View>
      </View>

      <View style={styles.cardAlt}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Talian Kasih</Text>
          <Text style={styles.noteSmall}>Hotline — open 24/7</Text>
        </View>
        <View style={styles.actionsSingle}>
          <Text style={styles.callButton} onPress={() => Linking.openURL("tel:15999")}>Call 15999</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Support Circle</Text>
      {supportContacts.length === 0 ? (
        <Text style={styles.emptyText}>No contacts yet. Add someone below.</Text>
      ) : (
        supportContacts.map((c) => (
          <View key={c.id} style={styles.contactRow}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{c.name[0] || "?"}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{c.name}</Text>
              {c.relationship ? <Text style={styles.noteSmall}>{c.relationship}</Text> : null}
            </View>
            <View style={styles.actions}>
              <Text style={styles.smallBtn} onPress={() => Linking.openURL(`tel:${c.phone}`)}>Call</Text>
            </View>
          </View>
        ))
      )}

      {/* Add contact bar */}
      {!adding ? (
        <TouchableOpacity style={styles.addBar} onPress={() => setAdding(true)}>
          <Text style={styles.addBarText}>+ Add contact</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.addForm}>
          <TextInput placeholder="Name" value={newName} onChangeText={setNewName} style={styles.input} />
          <TextInput placeholder="Relationship" value={newRelationship} onChangeText={setNewRelationship} style={styles.input} />
          <TextInput placeholder="Phone" value={newPhone} onChangeText={setNewPhone} style={styles.input} keyboardType="phone-pad" />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddContact}><Text style={styles.submitText}>Save</Text></TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setAdding(false)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE9EB",
    padding: 20,
    justifyContent: "space-between",
  },
  header: { marginTop: 12 },
  title: { fontSize: 22, fontWeight: "700", color: "#DB7C87", marginBottom: 6 },
  subtitle: { color: "#6b4146", fontSize: 14 },
  center: { alignItems: "center", justifyContent: "center", flex: 1 },
  centerWrap: { alignItems: "center", marginVertical: 16 },
  centerSpacer: { height: 8 },
  centerButtonWrap: { width: 260, height: 260, alignItems: "center", justifyContent: "center" },
  wavesContainer: { position: "absolute", width: 260, height: 260, alignItems: "center", justifyContent: "center" },
  wave: { position: "absolute", width: 180, height: 180, borderRadius: 90, borderWidth: 2, borderColor: "rgba(219,124,135,0.45)", backgroundColor: "transparent" },
  button: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#DB7C87",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  buttonPressed: { transform: [{ scale: 0.98 }], backgroundColor: "#b24f57" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  buttonSub: { color: "#fff", fontSize: 12, marginTop: 6, opacity: 0.95 },
  footerRow: { paddingVertical: 12 },
  note: { color: "#6b4146", textAlign: "center", marginBottom: 8 },
  link: { color: "#6b4146", textAlign: "center", fontWeight: "700" },
  noticeCard: {
    backgroundColor: "#FCD9DC",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  noticeTitle: { fontWeight: "700", color: "#6b4146", marginBottom: 6 },
  noticeText: { color: "#6b4146" },
  sectionTitle: { marginTop: 8, marginBottom: 6, color: "#6b4146", fontWeight: "700", fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  cardAlt: {
    backgroundColor: "#F5C1C5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  name: { fontSize: 16, fontWeight: "700", color: "#6b4146" },
  noteSmall: { color: "#6b4146", fontSize: 12 },
  phone: { color: "#3b2a2b", fontWeight: "600", marginTop: 4 },
  actionsSingle: { marginLeft: 12, flexDirection: "row", justifyContent: "flex-end" },
  callButton: { color: "#fff", backgroundColor: "#DB7C87", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  contactRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 8 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginRight: 12, backgroundColor: "#F5C1C5" },
  avatarText: { fontSize: 18 },
  actions: { flexDirection: "row" },
  smallBtn: { marginLeft: 8, color: "#DB7C87", fontWeight: "700" },
  emptyText: { color: "#6b4146", fontStyle: "italic", marginBottom: 8 },
  addBar: { backgroundColor: "#fff", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 8 },
  addBarText: { color: "#DB7C87", fontWeight: "700" },
  addForm: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginTop: 8 },
  input: { borderColor: "#f0b3b6", borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 8 },
  submitBtn: { backgroundColor: "#DB7C87", padding: 10, borderRadius: 8, minWidth: 120, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "700" },
  cancelBtn: { backgroundColor: "#eee", padding: 10, borderRadius: 8, minWidth: 120, alignItems: "center" },
  cancelText: { color: "#6b4146", fontWeight: "700" },
});

