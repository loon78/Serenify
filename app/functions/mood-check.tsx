import { Ionicons } from "@expo/vector-icons";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MoodCard from "../components/moodCard";
import { moodStorage } from "../services/moodStorage";
import { moodCheckStyles } from "../styles/moodCheckStyles";

const { width } = Dimensions.get("window");
const numColumns = 7;
const cellSize = width / numColumns;

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [mood, setMood] = useState("");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Store mood data per date (key = yyyy-MM-dd)
  const [moodData, setMoodData] = useState<Record<string, number>>({});

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const generateDays = () => {
    const startDate = startOfWeek(startOfMonth(currentDate));
    const endDate = endOfWeek(endOfMonth(currentDate));
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const days = generateDays();
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();

  const handleDayPress = (day: Date) => {
    setSelectedDay(day);
    setModalVisible(true);
  };

  // Load persisted moods into the calendar when entering this page
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const entries = await moodStorage.getAllEntries();
        const map: Record<string, number> = {};
        entries.forEach((e) => {
          if (e && typeof e.date === 'string' && typeof (e as any).moodScore === 'number') {
            map[e.date] = (e as any).moodScore;
          }
        });
        if (mounted) setMoodData(map);
      } catch (error) {
        console.error('Failed to load mood entries:', error);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Function to map mood score (1-10) → color (red→green)
  // const getMoodColor = (score: number): string => {
  //   const red = Math.floor(255 - (score - 1) * 20);
  //   const green = Math.floor((score - 1) * 20);
  //   return `rgb(${red}, ${green}, 100)`; // balanced hue
  // };

  const getMoodColor = (score: number): string => {
    // Clamp mood score between 1–10
    const clamped = Math.max(1, Math.min(score, 10));

    // Convert mood to hue (0 = red, 120 = green)
    // mood 1 => 0° (red), mood 5 => 60° (yellow), mood 10 => 120° (green)
    const hue = (clamped - 1) * 12; // total 120° range

    // Higher saturation and lightness for a bright look
    return `hsl(${hue}, 90%, 70%)`;
  };

  const handleSaveMood = () => {
    const moodScore = parseInt(mood, 10);
    if (selectedDay && !isNaN(moodScore) && moodScore >= 1 && moodScore <= 10) {
      const dateKey = format(selectedDay, "yyyy-MM-dd");
      // persist the mood for the selected date and update UI
      (async () => {
        try {
          await moodStorage.setMoodForDate(dateKey, moodScore);
          setMoodData((prev) => ({ ...prev, [dateKey]: moodScore }));
        } catch (error) {
          console.error('Failed to save mood:', error);
        }
      })();
    }
    setModalVisible(false);
    setMood("");
  };

  return (
    <View style={moodCheckStyles.container}>
      {/* ====== HEADER ====== */}
      <View style={moodCheckStyles.header}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Ionicons name="chevron-back" size={24} color="#444" />
        </TouchableOpacity>

        <Text style={moodCheckStyles.headerTitle}>
          {format(currentDate, "MMMM yyyy")}
        </Text>

        <TouchableOpacity onPress={handleNextMonth}>
          <Ionicons name="chevron-forward" size={24} color="#444" />
        </TouchableOpacity>
      </View>

      {/* ====== WEEKDAY ROW ====== */}
      <View style={moodCheckStyles.weekRow}>
        {weekDays.map((day) => (
          <Text key={day} style={moodCheckStyles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>

      {/* ====== CALENDAR GRID ====== */}
      <FlatList
        data={days}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const isCurrentMonth = isSameMonth(item, currentDate);
          const isToday = isSameDay(item, today);
          const dateKey = format(item, "yyyy-MM-dd");
          const moodScore = moodData[dateKey];
          const moodColor = moodScore ? getMoodColor(moodScore) : "#FFFFFF";

          return (
            <TouchableOpacity onPress={() => handleDayPress(item)}>
              <View
                style={[
                  moodCheckStyles.dayBox,
                  !isCurrentMonth && moodCheckStyles.outsideMonth,
                  isToday && moodCheckStyles.todayBox,
                  { backgroundColor: moodColor },
                ]}
              >
                <Text
                  style={[
                    moodCheckStyles.dayText,
                    !isCurrentMonth && moodCheckStyles.outsideMonthText,
                    isToday && moodCheckStyles.todayText,
                  ]}
                >
                  {format(item, "d")}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* ====== MOOD MODAL ====== */}
      <MoodCard
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mood={mood}
        setMood={setMood}
        onSave={handleSaveMood}
      />

      {/* ====== FLOATING ADD BUTTON ====== */}
      <TouchableOpacity style={moodCheckStyles.fab}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
