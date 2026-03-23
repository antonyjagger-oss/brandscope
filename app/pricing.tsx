import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/AnimatedPressable';
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

const FREE_FEATURES = [
  '3 scans per month',
  'Basic visibility score',
  'Perplexity only',
];

const PRO_FEATURES = [
  'Unlimited scans',
  'Full PDF reports',
  'All 3 AI engines',
  'Competitor comparisons',
  'Weekly alerts',
  '6 months history',
];

const AGENCY_FEATURES = [
  'Everything in Pro',
  'White-label reports',
  'API access',
  'Bulk CSV uploads',
  'Priority support',
];

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'Can I cancel anytime?',
    answer: 'Yes, cancel anytime. No long-term contracts or commitments.',
  },
  {
    id: 'faq-2',
    question: 'What counts as a scan?',
    answer: 'Each URL scanned against all 3 AI engines counts as 1 scan.',
  },
  {
    id: 'faq-3',
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 14-day money-back guarantee, no questions asked.',
  },
];

function FeatureRow({ text }: { text: string }) {
  return (
    <View style={styles.featureRow}>
      <CheckCircle size={15} color={COLORS.accent} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    console.log('[BrandScope] Pricing: FAQ toggled:', question);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  }, [question]);

  return (
    <View style={styles.faqItem}>
      <AnimatedPressable onPress={toggle} style={styles.faqQuestion}>
        <Text style={styles.faqQuestionText}>{question}</Text>
        {open ? (
          <ChevronUp size={18} color={COLORS.textSecondary} />
        ) : (
          <ChevronDown size={18} color={COLORS.textSecondary} />
        )}
      </AnimatedPressable>
      {open && <Text style={styles.faqAnswer}>{answer}</Text>}
    </View>
  );
}

export default function PricingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = useCallback(() => {
    console.log('[BrandScope] Pricing: back pressed');
    router.back();
  }, [router]);

  const handleGetFree = useCallback(() => {
    console.log('[BrandScope] Pricing: Get started free pressed');
    router.push('/');
  }, [router]);

  const handleStartPro = useCallback(() => {
    console.log('[BrandScope] Pricing: Start Pro trial pressed');
  }, []);

  const handleContactSales = useCallback(() => {
    console.log('[BrandScope] Pricing: Contact sales pressed');
  }, []);

  const handleEnterprise = useCallback(() => {
    console.log('[BrandScope] Pricing: Enterprise link pressed');
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <AnimatedPressable onPress={handleBack} style={styles.headerBack}>
          <ChevronLeft size={24} color={COLORS.textSecondary} />
        </AnimatedPressable>
        <Text style={styles.headerTitle}>Pricing</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Simple pricing for AI visibility</Text>
          <Text style={styles.heroSubtitle}>Start free, upgrade when you're ready</Text>
        </View>

        {/* Free Tier */}
        <View style={styles.card}>
          <View style={[styles.tierBadge, { backgroundColor: COLORS.primaryMuted }]}>
            <Text style={[styles.tierBadgeText, { color: COLORS.primary }]}>Start here</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceAmount}>$0</Text>
            <Text style={styles.pricePeriod}>/month</Text>
          </View>
          <Text style={styles.tierName}>Free</Text>
          <View style={styles.featuresList}>
            {FREE_FEATURES.map((f) => (
              <FeatureRow key={f} text={f} />
            ))}
          </View>
          <AnimatedPressable onPress={handleGetFree} style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Get started free</Text>
          </AnimatedPressable>
        </View>

        {/* Pro Tier — Featured */}
        <View style={[styles.card, styles.proCard]}>
          <View style={[styles.tierBadge, { backgroundColor: COLORS.primary }]}>
            <Text style={[styles.tierBadgeText, { color: '#FFFFFF' }]}>Most popular</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceAmount}>$29</Text>
            <Text style={styles.pricePeriod}>/month</Text>
          </View>
          <Text style={styles.tierName}>Pro</Text>
          <View style={styles.featuresList}>
            {PRO_FEATURES.map((f) => (
              <FeatureRow key={f} text={f} />
            ))}
          </View>
          <AnimatedPressable onPress={handleStartPro} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Start Pro trial</Text>
          </AnimatedPressable>
        </View>

        {/* Agency Tier */}
        <View style={styles.card}>
          <View style={[styles.tierBadge, { backgroundColor: COLORS.warningMuted }]}>
            <Text style={[styles.tierBadgeText, { color: COLORS.warning }]}>For teams</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceAmount}>$99</Text>
            <Text style={styles.pricePeriod}>/month</Text>
          </View>
          <Text style={styles.tierName}>Agency</Text>
          <View style={styles.featuresList}>
            {AGENCY_FEATURES.map((f) => (
              <FeatureRow key={f} text={f} />
            ))}
          </View>
          <AnimatedPressable onPress={handleContactSales} style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Contact sales</Text>
          </AnimatedPressable>
        </View>

        {/* Enterprise Note */}
        <AnimatedPressable onPress={handleEnterprise} style={styles.enterpriseLink}>
          <Text style={styles.enterpriseLinkText}>Need a custom plan? Talk to our team →</Text>
        </AnimatedPressable>

        {/* FAQ */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {FAQ_ITEMS.map((item, i) => (
              <View key={item.id}>
                <FaqItem question={item.question} answer={item.answer} />
                {i < FAQ_ITEMS.length - 1 && <View style={styles.faqDivider} />}
              </View>
            ))}
          </View>
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
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 44,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  proCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  tierBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  tierBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  priceAmount: {
    fontSize: 42,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 48,
  },
  pricePeriod: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  tierName: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: -8,
  },
  featuresList: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  outlineButton: {
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginTop: 4,
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  enterpriseLink: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  enterpriseLinkText: {
    fontSize: 14,
    color: COLORS.primary,
    textAlign: 'center',
  },
  faqSection: {
    gap: 12,
    marginTop: 8,
  },
  faqTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  faqList: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  faqItem: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 12,
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    paddingBottom: 14,
  },
  faqDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: 16,
  },
});
