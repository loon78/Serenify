// styles.ts
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
const numColumns = 7;
const cellWidth = width / numColumns;
const cellHeight = height / numColumns;

export const moodCheckStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },
  weekRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 6,
  },
  weekDayText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
    color: "#555",
  },
  dayBox: {
    width: cellWidth,
    height: cellHeight/1.2,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  dayText: {
    fontSize: 16,
    color: "#222",
  },
  outsideMonth: {
    backgroundColor: "#F8F9FA",
  },
  outsideMonthText: {
    color: "#B0B0B0",
  },
  todayBox: {
    backgroundColor: "#E8F0FE",
    borderWidth: 2,
  },
  todayText: {
    color: "#1A73E8",
    fontWeight: "700",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#1A73E8",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});
