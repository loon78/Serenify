import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ title: "Home" }} />
        {/* <Stack.Screen name="functions" options={{ headerShown: false }} /> */}
        <Stack.Screen
          name="functions/journalDashboard"
          options={{ title: "My Journals" }}
        />
        <Stack.Screen
          name="functions/journalEntry"
          options={{ title: "Journal Entry" }}
        />
        <Stack.Screen
          name="functions/newJournal"
          options={{ title: "New Journal" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
