import React, { useState } from "react";
import { View } from "react-native";
import Login from "./Login";
import Signup from "./Signup";

export default function Index() {
  const [screen, setScreen] = useState<"login" | "signup">("login");

  return (
    <View style={{ flex: 1 }}>
      {screen === "login" ? <Login onNavigate={(s) => setScreen(s)} /> : <Signup onNavigate={(s) => setScreen(s)} />}
    </View>
  );
}
