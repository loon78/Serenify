import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { exploreStyles } from "../../styles/exploreStyles";

export default function Explore() {
  return (
    <SafeAreaView style={exploreStyles.container}>
      <View>
        <Text style={exploreStyles.title}>Explore</Text>
      </View>
    </SafeAreaView>
  );
}