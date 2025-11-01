import { StyleSheet } from "react-native";

// Login palette (kept in sync with app/Login.tsx)
const COLORS = {
  light1: "#FFE9EB",
  light2: "#FCD9DC",
  mid: "#F5C1C5",
  accent: "#EFB0B7",
  strong: "#DB7C87",
};

export const exploreStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light1,
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.strong,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: COLORS.mid,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.accent,
    color: "#222",
  },
  cardContainer: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 24,
    borderRadius: 16,
    minHeight: 140,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.accent,
  },
});
