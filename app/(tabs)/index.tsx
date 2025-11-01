import React, { useState } from "react";
import { View } from "react-native";
import AddContact from "../functions/AddContact";
import EmergencyContact from "../functions/EmergencyContact";
import Home from "../functions/Home";
import Login from "../functions/Login";
import Signup from "../functions/Signup";

export default function Index() {
  const [screen, setScreen] = useState<"login" | "signup" | "home" | "emergency" | "addContact">("login");
  const [familyContacts, setFamilyContacts] = useState<any[]>([]);

  function handleAddContact(contact: any) {
    setFamilyContacts((s) => [contact, ...s]);
  }

  return (
    <View style={{ flex: 1 }}>
      {screen === "login" && <Login onNavigate={(s: any) => setScreen(s)} />}
      {screen === "signup" && <Signup onNavigate={(s: any) => setScreen(s)} />}
      {screen === "home" && <Home onNavigate={(s: any) => setScreen(s)} />}
      {screen === "emergency" && (
        <EmergencyContact familyContacts={familyContacts} onNavigate={(s: any) => setScreen(s)} />
      )}
      {screen === "addContact" && (
        <AddContact
          onNavigate={(s: any) => setScreen(s)}
          onAddContact={(c: any) => {
            handleAddContact(c);
            setScreen("emergency");
          }}
        />
      )}
    </View>
  );
}