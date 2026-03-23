import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DS } from '@/constants/Colors';

export default function StartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [url, setUrl] = useState('');
  const [focused, setFocused] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleScan = useCallback(() => {
    const trimmed = url.trim() || 'https://yourbrand.com';
    console.log('[BrandScope] Scan Now pressed, url:', trimmed);
    router.push({ pathname: '/analysis', params: { url: trimmed } });
  }, [url, router]);

  const handlePricing = useCallback(() => {
    console.log('[BrandScope] View Pricing pressed');
    router.push('/pricing');
  }, [router]);

  const inputBorderColor = focused ? DS.primary : DS.outlineVariant;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Top header bar */}
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>⬡</Text>
          </View>
          <Text style={styles.headerBrandText}>BrandScope</Text>
        </View>
        <Text style={styles.headerMode}>AI Visibility</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 48 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.container,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Hero */}
          <View style={styles.heroSection}>
            <Text style={styles.headline}>
              What do AI engines know about your brand?
            </Text>
            <Text style={styles.subtext}>
              Scan Perplexity, ChatGPT, and Bing in one click. Get your AI Visibility Score in 30 seconds.
            </Text>
          </View>

          {/* URL Input Card */}
          <View style={styles.card}>
            <Text style={styles.inputLabel}>YOUR WEBSITE URL</Text>
            <TextInput
              style={[styles.input, { borderColor: inputBorderColor }]}
              value={url}
              onChangeText={setUrl}
              placeholder="https://yourbrand.com"
              placeholderTextColor={DS.outline}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <AnimatedPressable onPress={handleScan}>
              <LinearGradient
                colors={[DS.gradientStart, DS.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.scanButton}
              >
                <Text style={styles.scanButtonText}>Scan Now</Text>
              </LinearGradient>
            </AnimatedPressable>
          </View>

          {/* Trust Badges */}
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Free scan</Text>
            </View>
            <View style={styles.badgeSep} />
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>No signup</Text>
            </View>
            <View style={styles.badgeSep} />
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>30 seconds</Text>
            </View>
          </View>

          {/* Engine chips */}
          <View style={styles.enginesRow}>
            <View style={styles.engineChip}>
              <Text style={styles.engineChipText}>Perplexity</Text>
            </View>
            <View style={styles.engineChip}>
              <Text style={styles.engineChipText}>ChatGPT</Text>
            </View>
            <View style={styles.engineChip}>
              <Text style={styles.engineChipText}>Bing</Text>
            </View>
          </View>

          {/* Pricing Link */}
          <AnimatedPressable onPress={handlePricing} style={styles.pricingLink}>
            <Text style={styles.pricingLinkText}>View Pricing →</Text>
          </AnimatedPressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  headerMode: {
    fontSize: 13,
    fontWeight: '500',
    color: DS.outline,
    letterSpacing: 0.2,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  container: {
    alignItems: 'center',
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    gap: 24,
  },
  heroSection: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  headline: {
    fontSize: 30,
    fontWeight: '700',
    color: DS.onSurface,
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 38,
  },
  subtext: {
    fontSize: 15,
    color: DS.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 23,
  },
  card: {
    width: '100%',
    backgroundColor: DS.surfaceContainerLowest,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: DS.outlineVariant + '33',
    gap: 14,
    shadowColor: DS.onSurface,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 32,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 10,
    color: DS.outline,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: DS.surfaceContainerLow,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    color: DS.onSurface,
    fontSize: 15,
  },
  scanButton: {
    borderRadius: 10,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  scanButtonText: {
    color: DS.onPrimary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DS.secondary,
  },
  badgeText: {
    fontSize: 13,
    color: DS.onSurfaceVariant,
    fontWeight: '500',
  },
  badgeSep: {
    width: 1,
    height: 12,
    backgroundColor: DS.outlineVariant,
  },
  enginesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  engineChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: DS.surfaceContainerLow,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DS.outlineVariant + '40',
  },
  engineChipText: {
    fontSize: 12,
    color: DS.onSurfaceVariant,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  pricingLink: {
    paddingVertical: 8,
  },
  pricingLinkText: {
    fontSize: 14,
    color: DS.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
