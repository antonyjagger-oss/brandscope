import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Radar } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { mockResults } from '@/constants/mockData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

type GapItem = {
  id: string;
  title: string;
  description: string;
  engine: string;
  score: number;
};

function StaggeredItem({ children, index }: { children: React.ReactNode; index: number }) {
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

function GapCard({ gap, type, index }: { gap: GapItem; type: 'critical' | 'warning'; index: number }) {
  const isCritical = type === 'critical';
  const leftBorderColor = isCritical ? COLORS.danger : COLORS.warning;
  const severityBg = isCritical ? COLORS.dangerMuted : COLORS.warningMuted;
  const severityColor = isCritical ? COLORS.danger : COLORS.warning;
  const severityLabel = isCritical ? 'CRITICAL' : 'WARNING';
  const scoreText = gap.score.toFixed(2);

  return (
    <StaggeredItem index={index}>
      <View style={[styles.gapCard, { borderLeftColor: leftBorderColor }]}>
        <View style={styles.gapBadgeRow}>
          <View style={[styles.badge, { backgroundColor: severityBg }]}>
            <Text style={[styles.badgeText, { color: severityColor }]}>{severityLabel}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: COLORS.primaryMuted }]}>
            <Text style={[styles.badgeText, { color: COLORS.primary }]}>{gap.engine}</Text>
          </View>
        </View>
        <Text style={styles.gapTitle}>{gap.title}</Text>
        <Text style={styles.gapDescription}>{gap.description}</Text>
        <View style={styles.gapFooter}>
          <Text style={styles.gapId}>{gap.id}</Text>
          <Text style={[styles.gapScore, { color: severityColor }]}>
            {scoreText}
          </Text>
        </View>
      </View>
    </StaggeredItem>
  );
}

export default function GapsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'critical' | 'warnings'>('critical');
  const [copied, setCopied] = useState(false);

  const handleBack = useCallback(() => {
    console.log('[BrandScope] Gaps: back pressed');
    router.back();
  }, [router]);

  const handleHome = useCallback(() => {
    console.log('[BrandScope] Gaps: home pressed');
    router.push('/');
  }, [router]);

  const handleTabSwitch = useCallback((tab: 'critical' | 'warnings') => {
    console.log('[BrandScope] Gaps: tab switched to', tab);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  }, []);

  const handleCopyPrompt = useCallback(async () => {
    const allGaps = [...mockResults.gaps.critical, ...mockResults.gaps.warnings];
    const prompt = `Please update your knowledge about our brand. The following gaps have been identified:\n\n${allGaps
      .map((g) => `- ${g.title}: ${g.description}`)
      .join('\n')}`;
    console.log('[BrandScope] Gaps: Copy AI Correction Prompt pressed');
    await Clipboard.setStringAsync(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const criticalCount = mockResults.gaps.critical.length;
  const warningsCount = mockResults.gaps.warnings.length;
  const criticalLabel = `Critical (${criticalCount})`;
  const warningsLabel = `Warnings (${warningsCount})`;

  const activeGaps =
    activeTab === 'critical' ? mockResults.gaps.critical : mockResults.gaps.warnings;
  const activeType = activeTab === 'critical' ? 'critical' : 'warning';

  const copyButtonText = copied ? 'Copied! ✓' : 'Copy AI Correction Prompt';
  const copyButtonColor = copied ? COLORS.accent : '#FFFFFF';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <AnimatedPressable onPress={handleBack} style={styles.headerBack}>
          <ChevronLeft size={24} color={COLORS.textSecondary} />
        </AnimatedPressable>
        <Text style={styles.headerTitle}>Gap Analysis</Text>
        <AnimatedPressable onPress={handleHome} style={styles.headerRight}>
          <Radar size={20} color={COLORS.primary} />
        </AnimatedPressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <AnimatedPressable
            onPress={() => handleTabSwitch('critical')}
            style={[
              styles.tab,
              activeTab === 'critical' && styles.tabActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'critical' && styles.tabTextActive,
              ]}
            >
              {criticalLabel}
            </Text>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => handleTabSwitch('warnings')}
            style={[
              styles.tab,
              activeTab === 'warnings' && styles.tabActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'warnings' && styles.tabTextActive,
              ]}
            >
              {warningsLabel}
            </Text>
          </AnimatedPressable>
        </View>

        {/* Gap Cards */}
        <View style={styles.gapsList}>
          {activeGaps.map((gap, i) => (
            <GapCard key={gap.id} gap={gap} type={activeType as 'critical' | 'warning'} index={i} />
          ))}
        </View>

        {/* Copy Prompt Button */}
        <AnimatedPressable
          onPress={handleCopyPrompt}
          style={[styles.copyButton, copied && { backgroundColor: COLORS.accentMuted }]}
        >
          <Text style={[styles.copyButtonText, { color: copyButtonColor }]}>
            {copyButtonText}
          </Text>
        </AnimatedPressable>

        {/* Info Note */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Optimize your AI presence by addressing critical gaps first. Share the correction prompt with your content team.
          </Text>
        </View>
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
    width: 44,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerRight: {
    padding: 4,
    width: 44,
    alignItems: 'flex-end',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  gapsList: {
    gap: 12,
  },
  gapCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
    gap: 10,
  },
  gapBadgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  gapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  gapDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  gapFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  gapId: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontVariant: ['tabular-nums'],
  },
  gapScore: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    fontWeight: '600',
  },
  copyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});
