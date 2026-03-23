import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DS } from '@/constants/Colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
      <View style={styles.featureCheck}>
        <Text style={styles.featureCheckText}>✓</Text>
      </View>
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

  const chevron = open ? '↑' : '↓';

  return (
    <View style={styles.faqItem}>
      <AnimatedPressable onPress={toggle} style={styles.faqQuestion}>
        <Text style={styles.faqQuestionText}>{question}</Text>
        <Text style={styles.faqChevron}>{chevron}</Text>
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
          <Text style={styles.headerBackIcon}>←</Text>
        </AnimatedPressable>
        <Image source={require('../brandscope.png')} style={{ width: 160, height: 40 }} resizeMode="contain" />
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Simple pricing for AI visibility</Text>
          <Text style={styles.heroSubtitle}>Start free, upgrade when you're ready</Text>
        </View>

        {/* Free Tier */}
        <View style={styles.card}>
          <View style={styles.tierHeader}>
            <View style={[styles.tierBadge, { backgroundColor: DS.surfaceContainerHigh }]}>
              <Text style={[styles.tierBadgeText, { color: DS.onSurfaceVariant }]}>Start here</Text>
            </View>
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
          <View style={styles.tierHeader}>
            <View style={[styles.tierBadge, { backgroundColor: DS.primaryFixed }]}>
              <Text style={[styles.tierBadgeText, { color: DS.primary }]}>Most popular</Text>
            </View>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.priceAmount, { color: DS.primary }]}>$29</Text>
            <Text style={styles.pricePeriod}>/month</Text>
          </View>
          <Text style={styles.tierName}>Pro</Text>
          <View style={styles.featuresList}>
            {PRO_FEATURES.map((f) => (
              <FeatureRow key={f} text={f} />
            ))}
          </View>
          <AnimatedPressable onPress={handleStartPro}>
            <LinearGradient
              colors={[DS.gradientStart, DS.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Start Pro trial</Text>
            </LinearGradient>
          </AnimatedPressable>
        </View>

        {/* Agency Tier */}
        <View style={styles.card}>
          <View style={styles.tierHeader}>
            <View style={[styles.tierBadge, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.tierBadgeText, { color: DS.warning }]}>For teams</Text>
            </View>
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
          <Text style={styles.faqSectionLabel}>FREQUENTLY ASKED QUESTIONS</Text>
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
    fontSize: 17,
    fontWeight: '700',
    color: DS.onSurface,
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 44,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: DS.onSurface,
    textAlign: 'center',
    letterSpacing: -0.4,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 15,
    color: DS.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    backgroundColor: DS.surfaceContainerLowest,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: DS.outlineVariant + '33',
    gap: 14,
    shadowColor: DS.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 1,
  },
  proCard: {
    borderColor: DS.primary + '66',
    borderWidth: 2,
  },
  tierHeader: {
    flexDirection: 'row',
  },
  tierBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  tierBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  priceAmount: {
    fontSize: 44,
    fontWeight: '700',
    color: DS.onSurface,
    lineHeight: 50,
    letterSpacing: -1,
  },
  pricePeriod: {
    fontSize: 15,
    color: DS.outline,
    marginBottom: 8,
    fontWeight: '500',
  },
  tierName: {
    fontSize: 16,
    fontWeight: '600',
    color: DS.onSurfaceVariant,
    marginTop: -8,
    letterSpacing: 0.2,
  },
  featuresList: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: DS.secondaryContainer + '60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCheckText: {
    fontSize: 10,
    color: DS.secondary,
    fontWeight: '800',
  },
  featureText: {
    fontSize: 14,
    color: DS.onSurfaceVariant,
    flex: 1,
    lineHeight: 20,
  },
  primaryButton: {
    borderRadius: 10,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
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
    marginTop: 4,
  },
  outlineButtonText: {
    color: DS.onSurface,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  enterpriseLink: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  enterpriseLinkText: {
    fontSize: 14,
    color: DS.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  faqSection: {
    gap: 12,
    marginTop: 8,
  },
  faqSectionLabel: {
    fontSize: 10,
    color: DS.outline,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
  },
  faqList: {
    backgroundColor: DS.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DS.outlineVariant + '33',
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
    color: DS.onSurface,
    flex: 1,
  },
  faqChevron: {
    fontSize: 14,
    color: DS.outline,
    fontWeight: '600',
  },
  faqAnswer: {
    fontSize: 14,
    color: DS.onSurfaceVariant,
    lineHeight: 21,
    paddingBottom: 14,
  },
  faqDivider: {
    height: 1,
    backgroundColor: DS.outlineVariant + '33',
    marginHorizontal: 16,
  },
});
