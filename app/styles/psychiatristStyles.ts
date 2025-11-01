import { StyleSheet } from "react-native";

export const psychiatristStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f7f8fa",
    },
    innerContainer: {
      flex: 1,
      padding: 16,
    },
    header: {
      textAlign: "center",
      fontSize: 24,
      fontWeight: "600",
      color: "#333",
      marginBottom: 16,
    },
    chatContainer: {
      flex: 1,
      marginBottom: 16,
    },
    chatContent: {
      paddingVertical: 10,
    },
    messageRow: {
      marginBottom: 12,
      flexDirection: "row",
    },
    userMessageRow: {
      justifyContent: "flex-end",
    },
    aiMessageRow: {
      justifyContent: "flex-start",
    },
    messageBubble: {
      maxWidth: "75%",
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 16,
    },
    userBubble: {
      backgroundColor: "#4f9cf9",
      borderBottomRightRadius: 0,
    },
    aiBubble: {
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderBottomLeftRadius: 0,
    },
    messageText: {
      fontSize: 16,
    },
    userText: {
      color: "#fff",
    },
    aiText: {
      color: "#444",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 9999,
      paddingHorizontal: 12,
      paddingVertical: 6,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: "#333",
      paddingHorizontal: 8,
    },
  });