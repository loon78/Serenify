import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { homeStyles } from "../styles/homeStyles";

export default function Home() {
  return (
    <SafeAreaView style={homeStyles.container}>
      <View>
        <Text style={homeStyles.title}>Home</Text>
      </View>
    </SafeAreaView>
  );
}