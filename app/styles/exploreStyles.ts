import { StyleSheet } from "react-native";

export const exploreStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE9EB", // emergency background
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#DB7C87", // emergency primary
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    borderColor: "#F5C1C5",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContainer: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    padding: 8,
    minHeight: 140,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6d1d1ff",
    borderWidth: 1,
    borderColor: "#F5C1C5", // soft emergency border
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardText: {
    color: "#fbfbfbff", // emergency text tone
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
    color: "#6b4146",
  },
});
