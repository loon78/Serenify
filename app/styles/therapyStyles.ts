import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFE9EB", padding: 16 }, // emergency bg
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#DB7C87" }, // emergency primary

  // layout
  scroll: { paddingBottom: 32, paddingTop: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    minHeight: 140, // larger cards to fill space
    borderWidth: 1,
    borderColor: "#F5C1C5", // soft emergency border
  },
  cardHeader: { flex: 1, paddingRight: 12 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#6b4146", // emergency text tone
  },
  cardSubtitle: { color: "#6b4146", fontSize: 14 },

  // icon area using emergency accent
  cardIcon: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: "#F5C1C5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  modalContainer: { flex: 1, backgroundColor: "#fff", padding: 16 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#6b4146" },

  breathArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  circle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    marginBottom: 25,
    borderWidth: 10,
    borderColor: "rgba(219,124,135,0.12)",
  },
  phaseText: { fontSize: 20, fontWeight: "700", marginTop: 8, color: "#6b4146" },
  timerText: { fontSize: 36, fontWeight: "800", marginTop: 6, color: "#3b2a2b" },
  cycleText: { fontSize: 13, color: "#6b4146", marginTop: 6 },

  controls: { flexDirection: "row", marginTop: 20 },
  controlButton: {
    backgroundColor: "#DB7C87",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  controlText: { color: "#fff", fontWeight: "700" },

  legend: { marginTop: 24, paddingHorizontal: 20 },
  legendText: { color: "#6b4146", textAlign: "center" },
});
