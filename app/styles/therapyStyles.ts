import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#1A1A1A" },

  // increased vertical padding so cards fill more space
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
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // ensure cards occupy more vertical space on larger screens
    minHeight: 120,
  },
  cardHeader: { flex: 1, paddingRight: 12 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111",
  },
  cardSubtitle: { color: "#666", fontSize: 14 },

  // larger icon area to better balance the bigger cards
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#f1f5fb",
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
  modalTitle: { fontSize: 20, fontWeight: "700" },

  breathArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  circle: { width: 260, height: 260, borderRadius: 130, marginBottom: 20 },
  phaseText: { fontSize: 20, fontWeight: "700", marginTop: 8 },
  timerText: { fontSize: 36, fontWeight: "800", marginTop: 6, color: "#333" },
  cycleText: { fontSize: 13, color: "#666", marginTop: 6 },

  controls: { flexDirection: "row", marginTop: 20 },
  controlButton: {
    backgroundColor: "#4f9cf9",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  controlText: { color: "#fff", fontWeight: "700" },

  legend: { marginTop: 24, paddingHorizontal: 20 },
  legendText: { color: "#666", textAlign: "center" },
});
