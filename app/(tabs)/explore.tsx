import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { exploreStyles } from "../styles/exploreStyles";

const functionsData = [
  {
    id: "1",
    name: "Mood Check-In",
    color: "#FF9500",
    route: "/functions/mood-check",
    icon: "happy",
    image: require("../../assets/images/moodcheckin.png"),
  },
  {
    id: "2",
    name: "AI Psychiatrist",
    color: "#007AFF",
    route: "/functions/psychiatrist",
    icon: "chatbubble-ellipses",
    image: require("../../assets/images/aipsychiatrist.png"),
  },
  {
    id: "3",
    name: "Therapy",
    color: "#5856D6",
    route: "/functions/therapy",
    icon: "medical",
    image: require("../../assets/images/meditate.jpeg"),
  },
  {
    id: "4",
    name: "Journal",
    color: "#34C759",
    route: "/functions/journalDashboard",
    icon: "journal",
    image: require("../../assets/images/journal.png"),
  },
  {
    id: "5",
    name: "Emergency & Support",
    color: "#FF3B30",
    route: "/functions/EmergencyContact",
    icon: "call",
    image: require("../../assets/images/emergencyandsupport.png"),
  },
];

export default function Explore() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredData =
    search.trim().length === 0
      ? functionsData
      : functionsData.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <SafeAreaView style={exploreStyles.container}>
      {/* Header */}
      <Text style={exploreStyles.header}>Explore</Text>

      {/* Search Bar */}
      <TextInput
        style={exploreStyles.searchInput}
        placeholder="Search features..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
      />

      {/* Cards */}
      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={exploreStyles.cardContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={exploreStyles.card}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={item.image}
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
                imageStyle={{ borderRadius: 16, resizeMode: "cover" }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0,0.35)",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[
                      exploreStyles.cardText,
                      { color: "#fff", fontSize: 16, fontWeight: "700" },
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={exploreStyles.emptyContainer}>
          <Text style={exploreStyles.emptyText}>No results found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}