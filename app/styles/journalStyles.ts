import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: "#FFE9EB", // emergency background
    padding: 20,
    paddingBottom: 28,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#DB7C87", // emergency primary
    textAlign: "center",
    marginVertical: 14,
  },
  emptyText: {
    color: "#6b4146",
    textAlign: "center",
    marginTop: 24,
    fontSize: 16,
    fontStyle: "italic",
  },

  /* Journal list cards - larger and more prominent */
  journalCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#F5C1C5", // soft emergency border
    minHeight: 120,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  journalCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  journalDate: {
    color: "#DB7C87",
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 14,
  },
  journalText: {
    color: "#6b4146",
    fontSize: 16,
    lineHeight: 22,
  },

  /* Mood score visuals */
  moodScoreBadge: {
    backgroundColor: "#F5C1C5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  moodScoreBadgeText: {
    color: "#6b4146",
    fontSize: 13,
    fontWeight: "700",
  },
  moodScoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5C1C5",
  },
  moodScoreLabel: {
    fontSize: 15,
    color: "#6b4146",
    fontWeight: "600",
  },
  moodScoreValue: {
    fontSize: 18,
    color: "#DB7C87",
    fontWeight: "800",
  },

  /* Record / audio UI - bigger and centered */
  recordSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18,
    width: "100%",
    flex: 1,
    justifyContent: "center",
    paddingTop: 8,
    paddingBottom: 8,
  },
  recordButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 6,
    borderColor: "rgba(219,124,135,0.08)",
  },
  recordStatus: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b4146",
  },

  transcriptBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    maxHeight: 220,
    width: "100%",
    borderWidth: 1,
    borderColor: "#F5C1C5",
  },
  transcriptText: {
    color: "#6b4146",
    fontSize: 16,
  },

  /* Buttons */
  saveButton: {
    backgroundColor: "#DB7C87",
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  /* Detail card */
  journalDetailCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F5C1C5",
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  /* Floating action button (create new) */
  fabButton: {
    position: "absolute",
    bottom: 28,
    right: 24,
    backgroundColor: "#DB7C87",
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },

  deleteButton: {
    position: "absolute",
    top: 14,
    right: 65,
    padding: 8,
  },
});
