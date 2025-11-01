// styles/MoodStyles.ts
import { StyleSheet } from "react-native";

export const moodStyles = StyleSheet.create({
  // General screen layout
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#111827", // gray-900
  },

  // Log button
  logButton: {
    backgroundColor: "#3B82F6", // blue-500
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  logButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  // Modal background
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB", // gray-300
    borderRadius: 10,
    padding: 12,
    textAlign: "center",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#E5E7EB", // gray-200
    paddingVertical: 12,
    borderRadius: 10,
  },
  cancelButtonText: {
    textAlign: "center",
    color: "#374151", // gray-700
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#3B82F6", // blue-500
    paddingVertical: 12,
    borderRadius: 10,
  },
  saveButtonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
