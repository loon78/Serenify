import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { contactsStorage } from "../services/contactsStorage";
import { styles } from "../styles/emergencyStyles";

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

  // load contacts from storage on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const contacts = await contactsStorage.getAllContacts();
        if (mounted) setSupportContacts(contacts);
      } catch (err) {
        console.error('Failed to load emergency contacts', err);
      }
    })();

    return () => { mounted = false; };
  }, []);

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

  async function handleAddContact() {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert("Missing fields", "Please enter a name and phone number.");
      return;
    }

    try {
      const toSave = { name: newName.trim(), relationship: newRelationship.trim(), phone: newPhone.trim() };
      const saved = await contactsStorage.addContact(toSave);
      // prepend to local state
      setSupportContacts((s) => [saved, ...s]);
      setNewName("");
      setNewRelationship("");
      setNewPhone("");
      setAdding(false);
    } catch (err) {
      console.error('Failed to save contact', err);
      Alert.alert('Save failed', 'Unable to save contact to local storage.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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
    </ScrollView>
  );
}


