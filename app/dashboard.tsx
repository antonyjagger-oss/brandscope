import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react-native';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { mockResults } from '@/constants/mockData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  background: '#0A0E1A',
  surface: '#111827',
  surfaceSecondary: '#1C2333',
  text: '#F0F4FF',
  textSecondary: '#8B9CC8',
  textTertiary: '#4A5578',
  primary: '#4F8EF7',
  primaryMuted: 'rgba(79,142,247,0.12)',
  accent: '#34D399',
  accentMuted: 'rgba(52,211,153,0.12)',
  warning: '#FBBF24',
  warningMuted: 'rgba(251,191,36,0.12)',
  danger: '#F87171',
  dangerMuted: 'rgba(248,113,113,0.12)',
  border: 'rgba(79,142,247,0.12)',
  divider: 'rgba(240,244,255,0.06)',
};

function getScoreColor(score: number) {
  if (score >= 80) return COLORS.accent;
  if (score >= 50) return COLORS.warning;
  return COLORS.danger;
}

function StaggeredItem({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, index]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    console.log('[BrandScope] Dashboard: back pressed');
    router.back();
  };

  const handleViewGaps = () => {
    console.log('[BrandScope] Dashboard: View Gap Analysis pressed');
    router.push('/gaps');
  };

  const handleExportPDF = () => {
    console.log('[BrandScope] Dashboard: Export PDF pressed');
    Alert.alert('Coming Soon', 'PDF export coming soon');
  };

  const handleCopyPrompt = () => {
    console.log('[BrandScope] Dashboard: Copy Correction Prompt pressed');
  };

  const scoreColor = getScoreColor(mockResults.score);
  const scoreText = String(mockResults.score);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Custom Header */}
      <View style={styles.header}>
        <AnimatedPressable onPress={handleBack} style={styles.headerBack}>
          <ChevronLeft size={24} color={COLORS.textSecondary} />
        </AnimatedPressable>
        <Text style={styles.headerTitle}>BrandScope</Text>
        <Text style={styles.headerRight}>Results</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Score Card */}
        <StaggeredItem index={0}>
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>AI VISIBILITY SCORE</Text>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreNumber, { color: scoreColor }]}>{scoreText}</Text>
              <Text style={styles.scoreOutOf}>/100</Text>
            </View>
            <View style={styles.changeBadge}>
              <TrendingUp size={14} color={COLORS.accent} />
              <Text style={styles.changeBadgeText}>{mockResults.scoreChange}</Text>
            </View>
          </View>
        </StaggeredItem>

        {/* Engine Breakdown */}
        {mockResults.engines.map((engine, i) => {
          const borderColor = engine.sentimentWarning ? COLORS.warningMuted : COLORS.accentMuted;
          const sentimentBg = engine.sentimentWarning ? COLORS.warningMuted : COLORS.accentMuted;
          const sentimentColor = engine.sentimentWarning ? COLORS.warning : COLORS.accent;
          const engineScoreColor = getScoreColor(engine.score);
          const engineScoreText = String(engine.score);

          return (
            <StaggeredItem key={engine.name} index={i + 1}>
              <View style={[styles.card, { borderColor }]}>
                <View style={styles.engineHeader}>
                  <Text style={styles.engineName}>{engine.name}</Text>
                  <Text style={[styles.engineScore, { color: engineScoreColor }]}>
                    {engineScoreText}
                  </Text>
                </View>
                <View style={[styles.sentimentBadge, { backgroundColor: sentimentBg }]}>
                  <Text style={[styles.sentimentText, { color: sentimentColor }]}>
                    {engine.sentiment}
                  </Text>
                </View>
                <Text style={styles.snippet} numberOfLines={3}>
                  {engine.snippet}
                </Text>
              </View>
            </StaggeredItem>
          );
        })}

        {/* Sentiment Mix */}
        <StaggeredItem index={4}>
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>SENTIMENT MIX</Text>
            <View style={styles.sentimentBar}>
              <View
                style={[
                  styles.sentimentSegment,
                  {
                    flex: mockResults.sentimentMix.positive,
                    backgroundColor: COLORS.accent,
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                  },
                ]}
              />
              <View
                style={[
                  styles.sentimentSegment,
                  {
                    flex: mockResults.sentimentMix.neutral,
                    backgroundColor: COLORS.warning,
                  },
                ]}
              />
              <View
                style={[
                  styles.sentimentSegment,
                  {
                    flex: mockResults.sentimentMix.negative,
                    backgroundColor: COLORS.danger,
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                  },
                ]}
              />
            </View>
            <View style={styles.sentimentLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.accent }]} />
                <Text style={styles.legendText}>
                  {mockResults.sentimentMix.positive}% Positive
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
                <Text style={styles.legendText}>
                  {mockResults.sentimentMix.neutral}% Neutral
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.danger }]} />
                <Text style={styles.legendText}>
                  {mockResults.sentimentMix.negative}% Negative
                </Text>
              </View>
            </View>
          </View>
        </StaggeredItem>

        {/* Primary Gap */}
        <StaggeredItem index={5}>
          <View style={[styles.card, { borderColor: COLORS.dangerMuted }]}>
            <Text style={styles.gapLabel}>PRIMARY GAP DETECTED</Text>
            <View style={styles.gapTitleRow}>
              <AlertTriangle size={16} color={COLORS.warning} />
              <Text style={styles.gapTitle}>{mockResults.primaryGap.title}</Text>
            </View>
            <Text style={styles.gapDescription}>{mockResults.primaryGap.description}</Text>
          </View>
        </StaggeredItem>

        {/* Action Buttons */}
        <StaggeredItem index={6}>
          <View style={styles.actionsContainer}>
            <AnimatedPressable onPress={handleViewGaps} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>View Gap Analysis</Text>
            </AnimatedPressable>
            <AnimatedPressable onPress={handleExportPDF} style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>Export PDF</Text>
            </AnimatedPressable>
            <AnimatedPressable onPress={handleCopyPrompt} style={styles.textButton}>
              <Text style={styles.textButtonText}>Copy Correction Prompt</Text>
            </AnimatedPressable>
          </View>
        </StaggeredItem>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerBack: {
    padding: 4,
    width: 60,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  headerRight: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    width: 60,
    textAlign: 'right',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  scoreNumber: {
    fontSize: 72,
    fontWeight: '700',
    lineHeight: 80,
  },
  scoreOutOf: {
    fontSize: 24,
    color: COLORS.textSecondary,
    fontWeight: '400',
    marginBottom: 10,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accentMuted,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'center',
  },
  changeBadgeText: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '500',
  },
  engineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  engineName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  engineScore: {
    fontSize: 28,
    fontWeight: '700',
  },
  sentimentBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  sentimentText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  snippet: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  sentimentBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sentimentSegment: {
    height: '100%',
  },
  sentimentLegend: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  gapLabel: {
    fontSize: 11,
    color: COLORS.danger,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  gapTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  gapDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  actionsContainer: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  outlineButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  textButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '500',
  },
});
