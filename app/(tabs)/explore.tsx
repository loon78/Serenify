import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { exploreStyles } from "../styles/exploreStyles";

const functionsData = [
  { id: "1", name: "Mood Check Aid", color: "#FF9500", route: "/functions/mood-check", icon: "happy" },
  { id: "2", name: "AI Psychiatrist", color: "#007AFF", route: "/functions/psychiatrist", icon: "chatbubble-ellipses" },
  { id: "3", name: "Therapy", color: "#5856D6", route: "/functions/therapy", icon: "medical" },
  { id: "4", name: "Journal", color: "#34C759", route: "/functions/journal", icon: "journal" },
  { id: "5", name: "Emergency & Support", color: "#FF3B30", route: "/functions/contacts", icon: "call" },
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
              style={[exploreStyles.card, { backgroundColor: item.color }]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.8}
            >
              <Text style={exploreStyles.cardText}>{item.name}</Text>
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