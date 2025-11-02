import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/therapyStyles";

export default function Therapy() {
  const [breathOpen, setBreathOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  // timings (seconds)
  const inhaleSeconds = 4;
  const holdSeconds = 2;
  const exhaleSeconds = 6;
  const targetCycles = 4;

  const intervalRef = useRef<number | null>(null);
  const anim = useRef(new Animated.Value(1)).current;

  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // animate circle size per phase
    const toValue = phase === "inhale" ? 1.0 : phase === "hold" ? 0.8 : 0.7;
    Animated.spring(anim, {
      toValue,
      useNativeDriver: true,
      mass: 0.8,
      stiffness: 120,
      damping: 12,
    }).start();
  }, [phase]);

  const startBreathing = () => {
    if (running) return;
    setRunning(true);
    setPhase("inhale");
    setSecondsLeft(inhaleSeconds);
    setCycleCount(0);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;

        const currentPhase = phaseRef.current;

        if (currentPhase === "inhale") {
          setPhase("hold");
          setSecondsLeft(holdSeconds);
          return holdSeconds;
        } else if (currentPhase === "hold") {
          setPhase("exhale");
          setSecondsLeft(exhaleSeconds);
          return exhaleSeconds;
        } else {
          setCycleCount((c) => {
            const next = c + 1;
            if (next >= targetCycles) {
              stopBreathing();
            } else {
              setPhase("inhale");
              setSecondsLeft(inhaleSeconds);
            }
            return next;
          });
          return inhaleSeconds;
        }
      });
    }, 1000);
  };

  const stopBreathing = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
    setPhase("inhale");
    setSecondsLeft(inhaleSeconds);
  };

  const resetBreathing = () => {
    stopBreathing();
    setCycleCount(0);
    setSecondsLeft(inhaleSeconds);
  };

  const openPlaceholder = (title: string) => {
    // simple placeholder behavior
    setTimeout(() => {}, 0);
    alert(`${title} — coming soon`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Therapy Activities</Text>
        <Ionicons name="medical" size={28} color="#5856D6" />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Deep Breathing Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => setBreathOpen(true)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Deep Breathing</Text>
            <Text style={styles.cardSubtitle}>
              Reduce stress with paced breathing
            </Text>
          </View>
          <View style={styles.cardIcon}>
            <Ionicons name="water" size={28} color="#4f9cf9" />
          </View>
        </TouchableOpacity>

        {/* Placeholder activity cards */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => openPlaceholder("Progressive Muscle Relaxation")}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Progressive Muscle Relaxation</Text>
            <Text style={styles.cardSubtitle}>
              Tense and relax muscle groups
            </Text>
          </View>
          <View style={styles.cardIcon}>
            <Ionicons name="body" size={28} color="#34C759" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => openPlaceholder("Mindfulness Body Scan")}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Mindfulness Body Scan</Text>
            <Text style={styles.cardSubtitle}>
              Bring attention to bodily sensations
            </Text>
          </View>
          <View style={styles.cardIcon}>
            <Ionicons name="eye" size={28} color="#FF9500" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => openPlaceholder("Guided Imagery")}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Guided Imagery</Text>
            <Text style={styles.cardSubtitle}>Visualize calming scenes</Text>
          </View>
          <View style={styles.cardIcon}>
            <Ionicons name="film" size={28} color="#5856D6" />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Deep Breathing Modal */}
      <Modal
        visible={breathOpen}
        animationType="slide"
        onRequestClose={() => {
          setBreathOpen(false);
          resetBreathing();
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Deep Breathing</Text>
            <TouchableOpacity
              onPress={() => {
                setBreathOpen(false);
                resetBreathing();
              }}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.breathArea}>
            <Animated.View
              style={[
                styles.circle,
                {
                  transform: [{ scale: anim }],
                  backgroundColor:
                    phase === "inhale"
                      ? "#4f9cf9"
                      : phase === "hold"
                      ? "#9aaedc"
                      : "#7fc7b8",
                },
              ]}
            />
            <Text style={styles.phaseText}>
              {phase === "inhale"
                ? "Inhale"
                : phase === "hold"
                ? "Hold"
                : "Exhale"}
            </Text>
            <Text style={styles.timerText}>{secondsLeft}s</Text>
            <Text style={styles.cycleText}>
              Cycle {cycleCount}/{targetCycles}
            </Text>

            <View style={styles.controls}>
              {!running ? (
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={startBreathing}
                >
                  <Text style={styles.controlText}>Start</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: "#e76f51" }]}
                  onPress={stopBreathing}
                >
                  <Text style={styles.controlText}>Stop</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: "#888" }]}
                onPress={resetBreathing}
              >
                <Text style={styles.controlText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.legend}>
              <Text style={styles.legendText}>
                Tip: Breathe slowly. Follow the circle expansion and prompts.
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

