// styles.ts
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");
const numColumns = 7;
const cellWidth = width / numColumns;
const cellHeight = height / numColumns;

export const moodCheckStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE9EB", // emergency background
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
    color: "#6b4146", // emergency text tone
  },
  weekRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F5C1C5", // emergency soft border
    paddingBottom: 6,
  },
  weekDayText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
    color: "#6b4146", // emergency text tone
  },
  dayBox: {
    width: cellWidth,
    height: cellHeight / 1.2,
    borderWidth: 0.5,
    borderColor: "#F5C1C5", // emergency soft border
    alignItems: "center",
  },
  dayText: {
    fontSize: 16,
    color: "#6b4146", // emergency text tone
  },
  outsideMonth: {
    backgroundColor: "#FFF5F6", // subtle emergency-tinted background
  },
  outsideMonthText: {
    color: "#A67A7E", // muted emergency text
  },
  todayBox: {
    backgroundColor: "#FFF0F1", // pale emergency highlight
    borderWidth: 2,
    borderColor: "#DB7C87",
  },
  todayText: {
    color: "#DB7C87", // emergency accent
    fontWeight: "700",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#DB7C87", // emergency accent
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});
