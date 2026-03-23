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
import * as Clipboard from 'expo-clipboard';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { mockResults } from '@/constants/mockData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DS } from '@/constants/Colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const leftBorderColor = isCritical ? DS.critical : DS.warning;
  const severityColor = isCritical ? DS.tertiary : DS.warning;
  const severityLabel = isCritical ? 'Critical' : 'Warning';
  const scoreText = gap.score.toFixed(2);

  return (
    <StaggeredItem index={index}>
      <View style={[styles.gapCard, { borderLeftColor: leftBorderColor }]}>
        <View style={styles.gapBadgeRow}>
          <Text style={[styles.severityLabel, { color: severityColor }]}>{severityLabel}</Text>
          <View style={styles.engineBadge}>
            <Text style={styles.engineBadgeText}>{gap.engine}</Text>
          </View>
        </View>
        <Text style={styles.gapTitle}>{gap.title}</Text>
        <Text style={styles.gapDescription}>{gap.description}</Text>
        <View style={styles.gapFooter}>
          <Text style={styles.gapId}>ID: {gap.id}</Text>
          <Text style={styles.gapSep}>•</Text>
          <Text style={styles.gapScore}>Score: {scoreText}</Text>
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

  const activeGaps =
    activeTab === 'critical' ? mockResults.gaps.critical : mockResults.gaps.warnings;
  const activeType = activeTab === 'critical' ? 'critical' : 'warning';

  const copyButtonText = copied ? 'Copied!' : 'Copy AI Correction Prompt';

  const isCriticalTab = activeTab === 'critical';
  const isWarningsTab = activeTab === 'warnings';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <AnimatedPressable onPress={handleBack} style={styles.headerBack}>
          <Text style={styles.headerBackIcon}>←</Text>
        </AnimatedPressable>
        <Text style={styles.headerTitle}>Gap Analysis</Text>
        <AnimatedPressable onPress={handleHome} style={styles.headerRight}>
          <Text style={styles.headerRightIcon}>⬡</Text>
        </AnimatedPressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <AnimatedPressable
            onPress={() => handleTabSwitch('critical')}
            style={[styles.tab, isCriticalTab && styles.tabActive]}
          >
            <Text style={[styles.tabText, isCriticalTab && styles.tabTextActive]}>
              Critical
            </Text>
            <View style={[styles.tabCount, isCriticalTab && styles.tabCountActive]}>
              <Text style={[styles.tabCountText, isCriticalTab && styles.tabCountTextActive]}>
                {criticalCount}
              </Text>
            </View>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => handleTabSwitch('warnings')}
            style={[styles.tab, isWarningsTab && styles.tabActive]}
          >
            <Text style={[styles.tabText, isWarningsTab && styles.tabTextActive]}>
              Warnings
            </Text>
            <View style={[styles.tabCount, isWarningsTab && styles.tabCountActive]}>
              <Text style={[styles.tabCountText, isWarningsTab && styles.tabCountTextActive]}>
                {warningsCount}
              </Text>
            </View>
          </AnimatedPressable>
        </View>

        {/* Gap Cards */}
        <View style={styles.gapsList}>
          {activeGaps.map((gap, i) => (
            <GapCard key={gap.id} gap={gap} type={activeType as 'critical' | 'warning'} index={i} />
          ))}
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.bottomBarHint}>
          Optimize analysis with refined AI parameters
        </Text>
        <AnimatedPressable
          onPress={handleCopyPrompt}
          style={[styles.copyButton, copied && styles.copyButtonCopied]}
        >
          <Text style={[styles.copyButtonText, copied && styles.copyButtonTextCopied]}>
            {copyButtonText}
          </Text>
        </AnimatedPressable>
      </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DS.primary,
    letterSpacing: -0.3,
  },
  headerRight: {
    width: 44,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerRightIcon: {
    fontSize: 20,
    color: DS.primary,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    height: 48,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 10,
    backgroundColor: DS.surfaceContainer,
  },
  tabActive: {
    backgroundColor: DS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: DS.outline,
  },
  tabTextActive: {
    color: DS.onPrimary,
  },
  tabCount: {
    backgroundColor: DS.surfaceContainerHigh,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tabCountActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: DS.outline,
  },
  tabCountTextActive: {
    color: DS.onPrimary,
  },
  gapsList: {
    gap: 12,
  },
  gapCard: {
    backgroundColor: DS.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: DS.outlineVariant + '33',
    borderLeftWidth: 4,
    gap: 8,
    shadowColor: DS.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 1,
  },
  gapBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  severityLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  engineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: DS.surfaceContainerLow,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: DS.outlineVariant + '33',
  },
  engineBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: DS.onSurfaceVariant,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  gapTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: DS.onSurface,
    lineHeight: 21,
  },
  gapDescription: {
    fontSize: 13,
    color: DS.onSurfaceVariant,
    lineHeight: 19,
  },
  gapFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  gapId: {
    fontSize: 11,
    color: DS.outlineVariant,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  gapSep: {
    fontSize: 11,
    color: DS.outlineVariant,
  },
  gapScore: {
    fontSize: 11,
    color: DS.outlineVariant,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: DS.surfaceContainerLowest + 'F0',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: DS.outlineVariant + '33',
    gap: 10,
  },
  bottomBarHint: {
    fontSize: 10,
    color: DS.outline,
    textAlign: 'center',
    letterSpacing: 1.2,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  copyButton: {
    height: 52,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: DS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonCopied: {
    borderColor: DS.secondary,
    backgroundColor: DS.secondaryContainer + '20',
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: DS.primary,
    letterSpacing: 0.3,
  },
  copyButtonTextCopied: {
    color: DS.secondary,
  },
});
