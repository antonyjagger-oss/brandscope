import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { mockResults } from '@/constants/mockData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DS } from '@/constants/Colors';

function getScoreColor(score: number) {
  if (score >= 80) return DS.scoreGreen;
  if (score >= 50) return DS.warning;
  return DS.critical;
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
        delay: index * 70,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        delay: index * 70,
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
      {/* Header */}
      <View style={styles.header}>
        <AnimatedPressable onPress={handleBack} style={styles.headerBack}>
          <Text style={styles.headerBackIcon}>←</Text>
        </AnimatedPressable>
        <View style={styles.headerCenter}>
          <Image
            source={require('../brandscope_logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.headerRight}>Results</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Score Card */}
        <StaggeredItem index={0}>
          <View style={styles.scoreCard}>
            <Text style={styles.sectionLabel}>AI VISIBILITY SCORE</Text>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreNumber, { color: scoreColor }]}>{scoreText}</Text>
              <Text style={styles.scoreOutOf}>/100</Text>
            </View>
            <View style={styles.changeBadge}>
              <Text style={styles.changeBadgeArrow}>↑</Text>
              <Text style={styles.changeBadgeText}>{mockResults.scoreChange}</Text>
            </View>
          </View>
        </StaggeredItem>

        {/* Engine Breakdown label */}
        <StaggeredItem index={1}>
          <Text style={styles.groupLabel}>ENGINE BREAKDOWN</Text>
        </StaggeredItem>

        {/* Engine Cards */}
        {mockResults.engines.map((engine, i) => {
          const isWarning = engine.sentimentWarning;
          const sentimentBg = isWarning ? '#FEF3C7' : DS.secondaryContainer + '40';
          const sentimentColor = isWarning ? DS.warning : DS.onSecondaryContainer;
          const engineScoreColor = getScoreColor(engine.score);
          const engineScoreText = String(engine.score);
          const leftBorderColor = isWarning ? DS.warning : DS.secondary;

          return (
            <StaggeredItem key={engine.name} index={i + 2}>
              <View style={[styles.engineCard, { borderLeftColor: leftBorderColor }]}>
                <View style={styles.engineHeader}>
                  <View style={styles.engineIconBox}>
                    <Text style={styles.engineIconText}>
                      {engine.name === 'Perplexity' ? '⚡' : engine.name === 'ChatGPT' ? '💬' : '🔍'}
                    </Text>
                  </View>
                  <View style={styles.engineInfo}>
                    <Text style={styles.engineName}>{engine.name}</Text>
                    <Text style={styles.engineSnippet} numberOfLines={2}>
                      {engine.snippet}
                    </Text>
                    <View style={[styles.sentimentBadge, { backgroundColor: sentimentBg }]}>
                      <Text style={[styles.sentimentText, { color: sentimentColor }]}>
                        {engine.sentiment}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.engineScoreCol}>
                    <Text style={[styles.engineScore, { color: engineScoreColor }]}>
                      {engineScoreText}
                    </Text>
                    <Text style={styles.engineScoreLabel}>SCORE</Text>
                  </View>
                </View>
              </View>
            </StaggeredItem>
          );
        })}

        {/* Insights Grid */}
        <StaggeredItem index={5}>
          <View style={styles.insightsGrid}>
            {/* Sentiment Mix */}
            <View style={styles.insightCard}>
              <Text style={styles.sectionLabel}>SENTIMENT MIX</Text>
              <View style={styles.sentimentBar}>
                <View
                  style={[
                    styles.sentimentSegment,
                    {
                      flex: mockResults.sentimentMix.positive,
                      backgroundColor: DS.secondary,
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
                      backgroundColor: DS.warning,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.sentimentSegment,
                    {
                      flex: mockResults.sentimentMix.negative,
                      backgroundColor: DS.tertiary,
                      borderTopRightRadius: 4,
                      borderBottomRightRadius: 4,
                    },
                  ]}
                />
              </View>
              <View style={styles.sentimentLegend}>
                <Text style={[styles.legendText, { color: DS.secondary }]}>
                  {mockResults.sentimentMix.positive}% POS
                </Text>
                <Text style={[styles.legendText, { color: DS.warning }]}>
                  {mockResults.sentimentMix.neutral}% NEU
                </Text>
                <Text style={[styles.legendText, { color: DS.tertiary }]}>
                  {mockResults.sentimentMix.negative}% NEG
                </Text>
              </View>
            </View>

            {/* Primary Gap */}
            <View style={styles.insightCard}>
              <Text style={styles.sectionLabel}>PRIMARY GAP</Text>
              <Text style={styles.gapTitle}>{mockResults.primaryGap.title}</Text>
              <Text style={styles.gapDescription} numberOfLines={3}>
                {mockResults.primaryGap.description}
              </Text>
            </View>
          </View>
        </StaggeredItem>

        {/* Action Buttons */}
        <StaggeredItem index={6}>
          <View style={styles.actionsContainer}>
            <AnimatedPressable onPress={handleViewGaps}>
              <LinearGradient
                colors={[DS.gradientStart, DS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>View Gap Analysis</Text>
              </LinearGradient>
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
    backgroundColor: DS.background,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: DS.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: DS.outlineVariant + '33',
  },
  headerBack: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerBackIcon: {
    fontSize: 22,
    color: DS.primary,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerLogo: {
    width: 160,
    height: 40,
  },
  headerRight: {
    fontSize: 13,
    color: DS.outline,
    fontWeight: '500',
    width: 44,
    textAlign: 'right',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  groupLabel: {
    fontSize: 10,
    color: DS.outline,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  scoreCard: {
    backgroundColor: DS.surfaceContainerLowest,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: DS.outlineVariant + '33',
    alignItems: 'center',
    gap: 8,
    shadowColor: DS.onSurface,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 10,
    color: DS.outline,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  scoreNumber: {
    fontSize: 80,
    fontWeight: '700',
    lineHeight: 88,
    letterSpacing: -2,
  },
  scoreOutOf: {
    fontSize: 22,
    color: DS.outlineVariant,
    fontWeight: '400',
    marginBottom: 12,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: DS.secondaryContainer + '40',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  changeBadgeArrow: {
    fontSize: 13,
    color: DS.secondary,
    fontWeight: '700',
  },
  changeBadgeText: {
    fontSize: 11,
    color: DS.onSecondaryContainer,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  engineCard: {
    backgroundColor: DS.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: DS.outlineVariant + '33',
    borderLeftWidth: 4,
    shadowColor: DS.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 1,
  },
  engineHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  engineIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: DS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  engineIconText: {
    fontSize: 20,
  },
  engineInfo: {
    flex: 1,
    gap: 6,
  },
  engineName: {
    fontSize: 15,
    fontWeight: '600',
    color: DS.onSurface,
  },
  engineSnippet: {
    fontSize: 13,
    color: DS.onSurfaceVariant,
    lineHeight: 19,
  },
  sentimentBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  sentimentText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  engineScoreCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  engineScore: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  engineScoreLabel: {
    fontSize: 10,
    color: DS.outline,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  insightsGrid: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: DS.surfaceContainerLow,
    borderRadius: 12,
    padding: 20,
    gap: 10,
  },
  sentimentBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: DS.surfaceContainerHigh,
  },
  sentimentSegment: {
    height: '100%',
  },
  sentimentLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  gapTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: DS.onSurface,
  },
  gapDescription: {
    fontSize: 12,
    color: DS.onSurfaceVariant,
    lineHeight: 18,
  },
  actionsContainer: {
    gap: 10,
    marginTop: 4,
  },
  primaryButton: {
    borderRadius: 10,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    color: DS.onPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  outlineButton: {
    borderRadius: 10,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DS.outlineVariant,
    flexDirection: 'row',
    gap: 8,
  },
  outlineButtonText: {
    color: DS.onSurface,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  textButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonText: {
    color: DS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
