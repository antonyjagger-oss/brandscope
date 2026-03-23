import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DS } from '@/constants/Colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const MESSAGES = [
  'Querying Perplexity knowledge graph...',
  'Checking ChatGPT conversational memory...',
  'Scanning Bing Copilot index...',
  'Analyzing sentiment vectors...',
];

const STAGES = [
  { key: 'INITIALIZING_VECTORS', threshold: 25 },
  { key: 'MAPPING_RELATIONS', threshold: 50 },
  { key: 'SYNTHESIZING_INSIGHTS', threshold: 75 },
  { key: 'FINALIZING_REPORT', threshold: 100 },
];

const RING_SIZE = 120;
const STROKE_WIDTH = 5;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function AnalysisScreen() {
  const router = useRouter();
  const { url } = useLocalSearchParams<{ url: string }>();
  const insets = useSafeAreaInsets();

  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  const msgOpacity = useRef(new Animated.Value(1)).current;
  const dashOffset = useRef(new Animated.Value(CIRCUMFERENCE)).current;
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    console.log('[BrandScope] Analysis started for url:', url);
    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return p + 1;
      });
    }, 100);
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % 4);
    }, 2500);
    return () => {
      clearInterval(progressTimer);
      clearInterval(msgTimer);
    };
  }, [url]);

  useEffect(() => {
    const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
    Animated.timing(dashOffset, {
      toValue: offset,
      duration: 80,
      useNativeDriver: true,
    }).start();
  }, [progress, dashOffset]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(msgOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(msgOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [msgIndex, msgOpacity]);

  useEffect(() => {
    if (progress >= 100) {
      console.log('[BrandScope] Analysis complete, navigating to dashboard');
      const t = setTimeout(() => router.replace('/dashboard'), 600);
      return () => clearTimeout(t);
    }
  }, [progress, router]);

  const currentMessage = MESSAGES[msgIndex];
  const progressText = String(progress);

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>⬡</Text>
          </View>
          <Text style={styles.headerBrandText}>BrandScope</Text>
        </View>
        <Text style={styles.modeLabel}>ANALYSIS MODE</Text>
      </View>

      {/* Main card */}
      <View style={styles.mainCard}>
        {/* Progress Ring */}
        <View style={styles.ringContainer}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={DS.outlineVariant}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={DS.primaryContainer}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={styles.progressText}>{progressText}%</Text>
          </View>
        </View>

        {/* Status Message */}
        <Animated.Text style={[styles.statusMessage, { opacity: msgOpacity }]}>
          {currentMessage}
        </Animated.Text>

        {/* Time estimate */}
        <View style={styles.timeRow}>
          <View style={styles.timeDot} />
          <Text style={styles.timeLabel}>ABOUT 10 SECONDS</Text>
        </View>
      </View>

      {/* Data chips */}
      <View style={styles.chipsRow}>
        <View style={styles.chip}>
          <Text style={styles.chipLabel}>DATA SOURCE</Text>
          <View style={styles.chipValueRow}>
            <View style={styles.chipValueDot} />
            <Text style={styles.chipValue}>Neural Engine</Text>
          </View>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipLabel}>COMPLEXITY</Text>
          <Text style={styles.chipValueMono}>L4_DEEP_SCAN</Text>
        </View>
      </View>

      {/* Scan Stages */}
      <View style={styles.stagesCard}>
        {STAGES.map((stage) => {
          const isComplete = progress >= stage.threshold;
          const isActive = !isComplete && progress >= stage.threshold - 25;
          const stageKeyColor = isActive ? DS.primary : isComplete ? DS.secondary : DS.outline;
          return (
            <View key={stage.key} style={styles.stageRow}>
              <Text style={[styles.stageKey, { color: stageKeyColor }]}>{stage.key}</Text>
              {isComplete ? (
                <Text style={styles.stageCheck}>✓</Text>
              ) : (
                <Animated.View
                  style={[
                    styles.pendingDot,
                    isActive && { backgroundColor: DS.primary },
                    { opacity: isActive ? pulseAnim : 0.3 },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: DS.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: DS.outlineVariant + '33',
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: DS.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 14,
    color: DS.primary,
    fontWeight: '700',
  },
  headerBrandText: {
    fontSize: 18,
    fontWeight: '700',
    color: DS.primary,
    letterSpacing: -0.3,
  },
  modeLabel: {
    fontSize: 10,
    color: DS.outline,
    letterSpacing: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  mainCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: DS.surfaceContainerLowest,
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: DS.outlineVariant + '1A',
    alignItems: 'center',
    gap: 16,
    shadowColor: DS.onSurface,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
    elevation: 2,
  },
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 32,
    fontWeight: '600',
    color: DS.onSurface,
    letterSpacing: -1,
  },
  statusMessage: {
    fontSize: 15,
    color: DS.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DS.outline,
  },
  timeLabel: {
    fontSize: 10,
    color: DS.outline,
    letterSpacing: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    maxWidth: 380,
  },
  chip: {
    flex: 1,
    backgroundColor: DS.surfaceContainerLow,
    borderRadius: 8,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: DS.outlineVariant + '0D',
  },
  chipLabel: {
    fontSize: 10,
    color: DS.outline,
    letterSpacing: 1.5,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  chipValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipValueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DS.secondary,
  },
  chipValue: {
    fontSize: 13,
    color: DS.onSurface,
    fontWeight: '500',
  },
  chipValueMono: {
    fontSize: 12,
    color: DS.onSurface,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  stagesCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: DS.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: DS.outlineVariant + '1A',
    gap: 0,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: DS.outlineVariant + '33',
  },
  stageKey: {
    fontSize: 11,
    letterSpacing: 0.8,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  stageCheck: {
    fontSize: 13,
    color: DS.secondary,
    fontWeight: '700',
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DS.outlineVariant,
  },
});
