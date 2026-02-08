import React, { useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, Dimensions, Platform, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import Colors from '@/constants/colors';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { user, isLoading, signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [signing, setSigning] = useState(false);

  if (isLoading || user) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: Colors.primary }]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  async function handleSocialSignIn(provider: string) {
    setSigning(true);
    const names: Record<string, string> = {
      google: 'Guest User',
      apple: 'Guest User',
      facebook: 'Guest User',
    };
    await signIn(provider, names[provider] || 'Guest', `guest@${provider}.com`);
    setSigning(false);
    router.replace('/(tabs)');
  }

  async function handleEmailSignIn() {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Missing Info', 'Please enter your name and email.');
      return;
    }
    setSigning(true);
    await signIn('email', name.trim(), email.trim());
    setSigning(false);
    router.replace('/(tabs)');
  }

  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  return (
    <LinearGradient
      colors={[Colors.primaryDark, Colors.primary, '#3D0A14']}
      style={styles.container}
    >
      <View style={[styles.content, { paddingTop: insets.top + webTopInset + 60, paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 20 }]}>
        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="restaurant" size={44} color={Colors.accent} />
          </View>
          <Text style={styles.title}>Tap Yard</Text>
          <Text style={styles.subtitle}>Your loyalty, rewarded</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(800)} style={styles.featureList}>
          <FeatureItem icon="gift-outline" text="Exclusive rewards & offers" />
          <FeatureItem icon="calendar-outline" text="Book tables & events" />
          <FeatureItem icon="qr-code-outline" text="Swipe to claim QR rewards" />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).duration(800)} style={styles.authSection}>
          {!showEmailForm ? (
            <>
              <SocialButton
                icon={<Ionicons name="logo-google" size={20} color="#DB4437" />}
                label="Continue with Google"
                onPress={() => handleSocialSignIn('google')}
                disabled={signing}
              />
              <SocialButton
                icon={<Ionicons name="logo-apple" size={20} color="#FFF" />}
                label="Continue with Apple"
                onPress={() => handleSocialSignIn('apple')}
                disabled={signing}
                dark
              />
              <SocialButton
                icon={<FontAwesome name="facebook" size={20} color="#1877F2" />}
                label="Continue with Facebook"
                onPress={() => handleSocialSignIn('facebook')}
                disabled={signing}
              />
              <Pressable
                style={styles.emailToggle}
                onPress={() => setShowEmailForm(true)}
              >
                <Text style={styles.emailToggleText}>or sign up with email</Text>
              </Pressable>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Pressable
                style={({ pressed }) => [styles.emailButton, pressed && { opacity: 0.8 }]}
                onPress={handleEmailSignIn}
                disabled={signing}
              >
                {signing ? (
                  <ActivityIndicator color={Colors.primaryDark} />
                ) : (
                  <Text style={styles.emailButtonText}>Get Started</Text>
                )}
              </Pressable>
              <Pressable
                style={styles.emailToggle}
                onPress={() => setShowEmailForm(false)}
              >
                <Text style={styles.emailToggleText}>back to social login</Text>
              </Pressable>
            </>
          )}
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon as any} size={20} color={Colors.accent} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function SocialButton({ icon, label, onPress, disabled, dark }: {
  icon: React.ReactNode; label: string; onPress: () => void; disabled: boolean; dark?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.socialButton,
        dark && styles.socialButtonDark,
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon}
      <Text style={[styles.socialButtonText, dark && styles.socialButtonTextDark]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, paddingHorizontal: 28, justifyContent: 'space-between' },
  brandSection: { alignItems: 'center', gap: 12 },
  logoContainer: {
    width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(212,168,83,0.15)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  title: {
    fontSize: 36, fontFamily: 'Poppins_700Bold', color: '#FFF', letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.6)', marginTop: -4,
  },
  featureList: { gap: 16, paddingVertical: 20 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 8 },
  featureText: { fontSize: 15, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.85)' },
  authSection: { gap: 12 },
  socialButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    backgroundColor: '#FFF', borderRadius: 14, paddingVertical: 15,
  },
  socialButtonDark: { backgroundColor: '#1A1A1A' },
  socialButtonText: {
    fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: '#1A1A1A',
  },
  socialButtonTextDark: { color: '#FFF' },
  emailToggle: { alignItems: 'center', paddingVertical: 10 },
  emailToggleText: {
    fontSize: 14, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.5)',
    textDecorationLine: 'underline',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingVertical: 15,
    paddingHorizontal: 18, fontSize: 15, fontFamily: 'Poppins_400Regular', color: '#FFF',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  emailButton: {
    backgroundColor: Colors.accent, borderRadius: 14, paddingVertical: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  emailButtonText: {
    fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: Colors.primaryDark,
  },
});
