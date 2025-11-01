// app/therapy/_layout.js
import { Slot, useRouter } from "expo-router";
import { Undo2 } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function TherapyLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 ,backgroundColor: '#FFE9EB'}}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Undo2 size={28} />
      </TouchableOpacity>

      {/* Content with paddingTop so it doesn't go under the button */}
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 24,
    left: 16,
    zIndex: 10,
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    paddingTop: 50, // add enough top padding for the back button
  },
});
