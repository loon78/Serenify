import { addDays, differenceInCalendarDays, format, subDays } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Polyline, Rect, Line as SvgLine, Text as SvgText } from 'react-native-svg';
import { journalStorage } from '../services/journalStorage';
import { moodStorage } from '../services/moodStorage';

// Reuse color palette from Login.tsx
const COLORS = {
  light1: "#FFE9EB",
  light2: "#FCD9DC",
  mid: "#F5C1C5",
  accent: "#EFB0B7",
  strong: "#DB7C87",
};

export default function Home() {
  const userName = "Guest"; // placeholder — replace with auth state when available
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  const onRefresh = () => {
    setRefreshing(true);
    // bump the key so child charts re-run their effects
    setRefreshKey(k => k + 1);
    // turn off the spinner after a short delay — charts will reload independently
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome back</Text>
            <Text style={styles.user}>{userName}</Text>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/Login')} accessibilityLabel="Go to login">
            <Text style={styles.loginLabel}>Log in</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Insights</Text>

          <View style={styles.insightCard}>
            <Text style={styles.insightHeading}>Mood trend</Text>
            <Text style={styles.insightText}>Based on recent 30 mood check-ins</Text>
            {/* Mood line chart for current month (1-10) */}
            <View style={styles.chartContainer}>
              <MoodLineChart refreshKey={refreshKey} />
            </View>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightHeading}>Weekly Journal Mood</Text>
            <Text style={styles.insightText}>Counts of journal mood scores over the past 7 days</Text>
            <View style={[styles.chartContainer, { height: 120 }]}> 
              <MoodBarChart refreshKey={refreshKey} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations for you</Text>

          <TouchableOpacity style={styles.recoCard} activeOpacity={0.8} onPress={() => router.push('/functions/therapy')}>
            <Text style={styles.recoTitle}>Breathing exercise</Text>
            <Text style={styles.recoText}>Quick exercise to reduce stress.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.recoCard} activeOpacity={0.8} onPress={() => router.push('/functions/journalDashboard')}>
            <Text style={styles.recoTitle}>Audio journal</Text>
            <Text style={styles.recoText}>Note about one positive moment today.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Inline MoodLineChart component
 * - Loads mood entries for the current month via moodStorage
 * - Renders a simple SVG line chart (scale 1-10)
 */
function MoodLineChart({ refreshKey }: { refreshKey?: number }) {
  const [points, setPoints] = useState<string>('');
  const [dots, setDots] = useState<Array<{ x: number; y: number }>>([]);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
  const end = new Date();
  const start = subDays(end, 30); // start 30 days before today
  const startKey = format(start, 'yyyy-MM-dd');
  const endKey = format(end, 'yyyy-MM-dd');
  const entries = await moodStorage.getEntriesByDateRange(startKey, endKey);
        const { width } = Dimensions.get('window');
        const padding = 12;
        const chartW = Math.max(240, width - 96);
        const chartH = 140;

        // number of days in the requested window (inclusive)
        const daysInRange = differenceInCalendarDays(end, start) + 1;

        // build a lookup for entries by ISO date key (yyyy-MM-dd)
        const dayMap = new Map<string, number>();
        entries.forEach((e) => {
          const key = format(new Date(e.date), 'yyyy-MM-dd');
          const score = typeof (e as any).moodScore === 'number' ? (e as any).moodScore : NaN;
          if (!isNaN(score)) dayMap.set(key, score);
        });

        if (dayMap.size === 0) {
          if (mounted) setHasData(false);
          return;
        }

        // compute evenly spaced X positions for each day slot
        const plotWidth = chartW - padding * 2;
        const step = daysInRange > 1 ? plotWidth / (daysInRange - 1) : plotWidth;

        const pts: Array<{ x: number; y: number; dayIndex: number; date: Date }> = [];
        for (let i = 0; i < daysInRange; i++) {
          const d = addDays(start, i);
          const key = format(d, 'yyyy-MM-dd');
          const score = dayMap.get(key);
          if (typeof score === 'number') {
            const x = padding + i * step;
            // map score 0..10 to y (0 bottom, 10 top)
            const y = padding + (1 - (score / 10)) * (chartH - padding * 2);
            pts.push({ x, y, dayIndex: i, date: d });
          }
        }

        if (pts.length === 0) {
          if (mounted) setHasData(false);
          return;
        }

  pts.sort((a, b) => a.dayIndex - b.dayIndex);
        const poly = pts.map(p => `${p.x},${p.y}`).join(' ');
        if (mounted) {
          setPoints(poly);
          setDots(pts.map(p => ({ x: p.x, y: p.y })));
          setHasData(true);
        }
      } catch (error) {
        console.error('MoodLineChart load error', error);
      }
    })();

    return () => { mounted = false; };
  }, [refreshKey]);

  const { width } = Dimensions.get('window');
  const padding = 12;
  const chartW = Math.max(240, width - 96);
  const chartH = 140;

  return (
    <View style={{ alignItems: 'center' }}>
      {hasData ? (
        <Svg width={chartW} height={chartH}>
          {/* Y grid lines and labels 0..10 */}
          {Array.from({ length: 6 }).map((_, i) => {
            const val = 10 - 2 * i; // top to bottom 10..0
            const y = padding + (1 - val / 10) * (chartH - padding * 2);
            return (
              <React.Fragment key={`grid-${val}`}>
                <SvgLine x1={padding} y1={y} x2={chartW - padding} y2={y} stroke="#eee" strokeWidth={1} />
                <SvgText x={4} y={y + 4} fill="#666" fontSize={10}>{String(val)}</SvgText>
              </React.Fragment>
            );
          })}

          {/* polyline */}
          <Polyline points={points} fill="none" stroke="#DB7C87" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {/* dots */}
          {dots.map((d, idx) => (
            <Circle key={`dot-${idx}`} cx={d.x} cy={d.y} r={3.5} fill="#DB7C87" />
          ))}
        </Svg>
      ) : (
        <Text style={{ color: '#666', fontSize: 12 }}>No mood data for this month</Text>
      )}
    </View>
  );
}

/**
 * MoodBarChart - shows counts of journal moodScore in last 7 days
 * Categories: Bad(1-3), Neutral(4-6), Good(7-10)
 */
function MoodBarChart({ refreshKey }: { refreshKey?: number }) {
  const [counts, setCounts] = useState<{ bad: number; neutral: number; good: number }>({ bad: 0, neutral: 0, good: 0 });
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const entries = await journalStorage.getRecentEntries(7);
        let bad = 0, neutral = 0, good = 0;
        entries.forEach(e => {
          const s = (e as any).moodScore;
          if (typeof s === 'number') {
            if (s >= 1 && s <= 3) bad++;
            else if (s >= 4 && s <= 6) neutral++;
            else if (s >= 7 && s <= 10) good++;
          }
        });
        if (mounted) {
          setCounts({ bad, neutral, good });
          setHasData(bad + neutral + good > 0);
        }
      } catch (err) {
        console.error('MoodBarChart load error', err);
      }
    })();

    return () => { mounted = false; };
  }, [refreshKey]);

  const { width } = Dimensions.get('window');
  const chartW = Math.max(240, width - 96);
  const chartH = 72;
  const padding = 12;

  const total = counts.bad + counts.neutral + counts.good;
  const innerW = Math.max(80, chartW - padding * 2);

  // proportional widths
  const badW = total > 0 ? (counts.bad / total) * innerW : 0;
  const neutralW = total > 0 ? (counts.neutral / total) * innerW : 0;
  const goodW = innerW - badW - neutralW;

  const cx = padding;

  return (
    <View style={{ alignItems: 'center', marginTop: 8 }}>
      {hasData ? (
        <Svg width={chartW} height={chartH}>
          {/* background bar */}
          <Rect x={padding} y={padding} width={innerW} height={chartH - padding * 2} fill="#f3f4f6" rx={0} />

          {/* bad segment */}
          {badW > 0 && <Rect x={padding} y={padding} width={badW} height={chartH - padding * 2} fill="#F87171" rx={0} />}

          {/* neutral segment */}
          {neutralW > 0 && <Rect x={padding + badW} y={padding} width={neutralW} height={chartH - padding * 2} fill="#FBBF24" rx={0} />}

          {/* good segment */}
          {goodW > 0 && <Rect x={padding + badW + neutralW} y={padding} width={goodW} height={chartH - padding * 2} fill="#34D399" rx={0} />}

          {/* counts inside segments if there's space */}
          {badW > 28 && (
            <SvgText x={padding + badW / 2} y={chartH / 2 + 4} fill="#fff" fontSize={12} textAnchor="middle">{String(counts.bad)}</SvgText>
          )}
          {neutralW > 28 && (
            <SvgText x={padding + badW + neutralW / 2} y={chartH / 2 + 4} fill="#222" fontSize={12} textAnchor="middle">{String(counts.neutral)}</SvgText>
          )}
          {goodW > 28 && (
            <SvgText x={padding + badW + neutralW + goodW / 2} y={chartH / 2 + 4} fill="#fff" fontSize={12} textAnchor="middle">{String(counts.good)}</SvgText>
          )}

          {/* labels/legend below */}
          <SvgText x={padding} y={chartH - 2} fill="#666" fontSize={11}>Bad</SvgText>
          <SvgText x={chartW / 2} y={chartH - 2} fill="#666" fontSize={11} textAnchor="middle">Neutral</SvgText>
          <SvgText x={chartW - padding} y={chartH - 2} fill="#666" fontSize={11} textAnchor="end">Good</SvgText>
        </Svg>
      ) : (
        <Text style={{ color: '#666', fontSize: 12 }}>No journal mood data for the last 7 days</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.light1 },
  container: { padding: 20, paddingBottom: 40 },
  // header layout: left (welcome) and right (login)
  header: { marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcome: { fontSize: 18, color: COLORS.strong },
  user: { fontSize: 28, fontWeight: '700', color: COLORS.strong, marginTop: 4 },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#333' },
  insightCard: { backgroundColor: COLORS.mid, padding: 12, borderRadius: 12, marginBottom: 10 },
  insightHeading: { fontSize: 14, fontWeight: '700', color: '#4a2a2c' },
  insightText: { fontSize: 13, color: '#5b3b3d', marginTop: 6 },
  chartContainer: { marginTop: 10, height: 140, justifyContent: 'center' },
  progressBarBackground: { height: 8, backgroundColor: '#ffeefe', borderRadius: 8, marginTop: 10, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.strong },
  recoCard: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  recoTitle: { fontSize: 14, fontWeight: '700', color: '#222' },
  recoText: { fontSize: 13, color: '#555', marginTop: 6 },
  loginButton: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'transparent' },
  loginLabel: { color: COLORS.strong, fontWeight: '700' },
});