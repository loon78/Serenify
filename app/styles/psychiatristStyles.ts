import { StyleSheet } from "react-native";

export const psychiatristStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE9EB", // match emergency background
  },
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#6b4146", // match emergency text tone
    marginBottom: 16,
  },

  chatContainer: {
    flex: 1,
    marginBottom: 16,
    padding: 12,
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#DB7C87", // primary emergency color
    borderBottomRightRadius: 0,
  },
  aiBubble: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F5C1C5", // soft border similar to emergency palette
    borderBottomLeftRadius: 0,
  },

  messageText: {
    fontSize: 16,
  },
  userText: {
    color: "#fff",
  },
  aiText: {
    color: "#6b4146",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 8,
  },

  // helpers for small UI bits to match emergency theme
  placeholderText: {
    color: "#6b4146",
  },
});