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
import { Radar, CheckCircle } from 'lucide-react-native';
import { AnimatedPressable } from '@/components/AnimatedPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  background: '#0A0E1A',
  surface: '#111827',
  surfaceSecondary: '#1C2333',
  surfaceTertiary: '#242D40',
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

export default function StartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [url, setUrl] = useState('');
  const [focused, setFocused] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
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

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.container,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Logo */}
          <View style={styles.logoArea}>
            <Radar size={28} color={COLORS.primary} />
            <Text style={styles.logoText}>BrandScope</Text>
            <Text style={styles.logoSubtitle}>AI Visibility Intelligence</Text>
          </View>

          {/* Hero */}
          <View style={styles.heroSection}>
            <Text style={styles.headline}>
              What do AI search engines know about your brand?
            </Text>
            <Text style={styles.subtext}>
              Scan Perplexity, ChatGPT, and Bing in one click
            </Text>
          </View>

          {/* URL Input Card */}
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Your website URL</Text>
            <TextInput
              style={[
                styles.input,
                focused && { borderColor: COLORS.primary },
              ]}
              value={url}
              onChangeText={setUrl}
              placeholder="https://yourbrand.com"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <AnimatedPressable onPress={handleScan} style={styles.scanButton}>
              <Text style={styles.scanButtonText}>Scan Now</Text>
            </AnimatedPressable>
          </View>

          {/* Trust Badges */}
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <CheckCircle size={14} color={COLORS.accent} />
              <Text style={styles.badgeText}>Free scan</Text>
            </View>
            <Text style={styles.badgeDot}>·</Text>
            <View style={styles.badge}>
              <CheckCircle size={14} color={COLORS.accent} />
              <Text style={styles.badgeText}>No signup</Text>
            </View>
            <Text style={styles.badgeDot}>·</Text>
            <View style={styles.badge}>
              <CheckCircle size={14} color={COLORS.accent} />
              <Text style={styles.badgeText}>30 seconds</Text>
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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  container: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    gap: 28,
  },
  logoArea: {
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  logoSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  heroSection: {
    alignItems: 'center',
    gap: 10,
  },
  headline: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 38,
  },
  subtext: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  inputLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: 15,
  },
  scanButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  badgeDot: {
    fontSize: 16,
    color: COLORS.textTertiary,
  },
  pricingLink: {
    paddingVertical: 8,
  },
  pricingLinkText: {
    fontSize: 14,
    color: COLORS.primary,
    textAlign: 'center',
  },
});
