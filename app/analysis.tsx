import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Radar, CheckCircle } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const COLORS = {
  background: '#0A0E1A',
  surface: '#111827',
  surfaceSecondary: '#1C2333',
  text: '#F0F4FF',
  textSecondary: '#8B9CC8',
  textTertiary: '#4A5578',
  primary: '#4F8EF7',
  accent: '#34D399',
  border: 'rgba(79,142,247,0.12)',
  divider: 'rgba(240,244,255,0.06)',
};

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

const RING_SIZE = 160;
const STROKE_WIDTH = 6;
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
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  // Pulse animation for pending dots
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  // Progress timer
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

  // Animate ring
  useEffect(() => {
    const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;
    Animated.timing(dashOffset, {
      toValue: offset,
      duration: 80,
      useNativeDriver: true,
    }).start();
  }, [progress, dashOffset]);

  // Message fade transition
  useEffect(() => {
    Animated.sequence([
      Animated.timing(msgOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(msgOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [msgIndex, msgOpacity]);

  // Auto-navigate when done
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
        <View style={styles.logoRow}>
          <Radar size={22} color={COLORS.primary} />
          <Text style={styles.logoText}>BrandScope</Text>
        </View>
        <Text style={styles.modeLabel}>ANALYSIS MODE</Text>
      </View>

      {/* Progress Ring */}
      <View style={styles.ringContainer}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke={COLORS.surfaceSecondary}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <AnimatedCircle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke={COLORS.primary}
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
          <Text style={styles.scanningText}>Scanning...</Text>
        </View>
      </View>

      {/* Status Message */}
      <Animated.Text style={[styles.statusMessage, { opacity: msgOpacity }]}>
        {currentMessage}
      </Animated.Text>

      {/* Scan Stages Card */}
      <View style={styles.stagesCard}>
        {STAGES.map((stage) => {
          const isComplete = progress >= stage.threshold;
          return (
            <View key={stage.key} style={styles.stageRow}>
              <Text style={styles.stageKey}>{stage.key}</Text>
              {isComplete ? (
                <CheckCircle size={16} color={COLORS.accent} />
              ) : (
                <Animated.View style={[styles.pendingDot, { opacity: pulseAnim }]} />
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
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 28,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  modeLabel: {
    fontSize: 11,
    color: COLORS.primary,
    letterSpacing: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
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
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  scanningText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusMessage: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  stagesCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stageKey: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textTertiary,
  },
});
