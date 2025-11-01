import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  onNavigate?: (screen: "login" | "signup" | "home" | "emergency" | "addContact") => void;
  onAddContact?: (contact: { id: string; name: string; phone: string; relationship?: string }) => void;
};

export default function AddContact({ onNavigate, onAddContact }: Props) {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");

  function handleAdd() {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Missing info", "Please enter name and phone.");
      return;
    }
    const contact = { id: Date.now().toString(), name: name.trim(), phone: phone.trim(), relationship: relationship.trim() || undefined };
    if (onAddContact) onAddContact(contact);
    Alert.alert("Contacts added!", undefined, [
      { text: "OK", onPress: () => onNavigate && onNavigate("emergency") },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Contact</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Relationship" value={relationship} onChangeText={setRelationship} />
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TouchableOpacity style={styles.btn} onPress={handleAdd} accessibilityLabel="Add contact">
        <Text style={styles.btnText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={() => onNavigate && onNavigate("emergency")}>
        <Text style={styles.btnText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFE9EB" },
  title: { fontSize: 22, fontWeight: "700", color: "#DB7C87", marginBottom: 12 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 10 },
  btn: { backgroundColor: "#DB7C87", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 8 },
  btnText: { color: "#fff", fontWeight: "700" },
  cancel: { backgroundColor: "#EFB0B7" },
});
