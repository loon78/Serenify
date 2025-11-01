import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  size?: number;
};

// A simple heart-shaped logo with subtle "brain" strokes inside to hint mental health.
// If `react-native-svg` isn't installed this component will gracefully fall back to an emoji.
export default function Logo({ size = 84 }: Props) {
  let Svg: any = null;
  let Path: any = null;

  try {
    // dynamic require so the app won't crash at import time if the dependency is missing
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const RN_SVG = require("react-native-svg");
    // react-native-svg may export default or named exports depending on bundler
    Svg = RN_SVG.default ?? RN_SVG.Svg ?? RN_SVG;
    Path = RN_SVG.Path;
  } catch (e) {
    Svg = null;
  }

  if (!Svg || !Path) {
    // fallback: emoji heart
    return (
      <View style={[styles.wrap, { width: size, height: size }]} accessible accessibilityLabel="Serenify logo">
        <Text style={[styles.emoji, { fontSize: Math.round(size * 0.5) }]}>❤️</Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { width: size, height: size }]} accessible accessibilityLabel="Serenify logo">
      <Svg width={size} height={size} viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet">
        {/* heart base */}
        <Path
          d="M32 58s-26-16-26-34a14 14 0 0128-6 14 14 0 0128 6c0 18-26 34-26 34z"
          fill="#F5C1C5"
          stroke="#DB7C87"
          strokeWidth={1.8}
        />

        {/* subtle brain lines */}
        <Path d="M20 30c2-3 6-4 12-4s10 1 12 4" stroke="#EFB0B7" strokeWidth={1.6} strokeLinecap="round" fill="none" />
        <Path d="M24 36c1.8-2 5-3 8-3s6 1 8 3" stroke="#DB7C87" strokeWidth={1.4} strokeLinecap="round" fill="none" />
        <Path d="M28 40c1.2-1.2 3-1.8 4-1.8s2.8.6 4 1.8" stroke="#EFB0B7" strokeWidth={1.2} strokeLinecap="round" fill="none" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    textAlign: "center",
  },
});
