import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  // Declarative redirect so navigation occurs once router is ready
  // Declarative redirect to Login (file-system route)
  return <Redirect href="/Login" />;
}
