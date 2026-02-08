import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';

type TabKey = 'terms' | 'privacy';

const TERMS_SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: 'By downloading, installing, or using the Tap Yard app, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
  },
  {
    title: '2. Account Registration',
    content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.',
  },
  {
    title: '3. Loyalty Programme',
    content: 'Points are earned based on qualifying purchases and may vary by tier status. Points have no cash value and cannot be transferred. We reserve the right to modify the loyalty programme terms at any time with 30 days notice.',
  },
  {
    title: '4. Bookings & Orders',
    content: 'Table reservations are subject to availability. Cancellations must be made at least 2 hours before the reserved time. Orders placed through the app are binding once confirmed.',
  },
  {
    title: '5. Payment',
    content: 'All prices are in GBP and include applicable VAT. Payment is processed securely through our payment partners. We do not store your full card details on our servers.',
  },
  {
    title: '6. Limitation of Liability',
    content: 'Tap Yard shall not be liable for any indirect, incidental, or consequential damages arising from your use of the app or services.',
  },
];

const PRIVACY_SECTIONS = [
  {
    title: 'Information We Collect',
    content: 'We collect information you provide directly: name, email, phone number, and payment details. We also collect usage data including order history, booking patterns, and app interactions to improve our services.',
  },
  {
    title: 'How We Use Your Data',
    content: 'Your data is used to process orders and bookings, manage your loyalty account, send relevant notifications and offers, and improve our services. We never sell your personal information to third parties.',
  },
  {
    title: 'Data Storage & Security',
    content: 'All personal data is encrypted at rest and in transit. We use industry-standard security measures including SSL/TLS encryption, secure data centres, and regular security audits.',
  },
  {
    title: 'Cookies & Analytics',
    content: 'We use analytics to understand how you interact with the app. This helps us improve features and personalise your experience. You can opt out of analytics in your profile settings.',
  },
  {
    title: 'Your Rights',
    content: 'Under GDPR, you have the right to access, rectify, or delete your personal data. You can request a copy of your data or ask us to delete your account at any time by contacting our support team.',
  },
  {
    title: 'Data Retention',
    content: 'We retain your data for as long as your account is active. After account deletion, we keep anonymised transaction records for up to 7 years for legal and accounting purposes.',
  },
  {
    title: 'Contact Us',
    content: 'For any privacy-related queries, contact our Data Protection Officer at privacy@dine-earn.com. We aim to respond to all requests within 30 days.',
  },
];

export default function TermsPrivacyScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const [activeTab, setActiveTab] = useState<TabKey>('terms');

  const sections = activeTab === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Terms & Privacy</Text>
        <View style={{ width: 24 }} />
      </View>

      <Animated.View entering={FadeInDown.duration(300)} style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === 'terms' && styles.tabActive]}
          onPress={() => setActiveTab('terms')}
        >
          <Ionicons name="document-text-outline" size={16} color={activeTab === 'terms' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'terms' && styles.tabTextActive]}>Terms of Service</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'privacy' && styles.tabActive]}
          onPress={() => setActiveTab('privacy')}
        >
          <Ionicons name="shield-checkmark-outline" size={16} color={activeTab === 'privacy' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'privacy' && styles.tabTextActive]}>Privacy Policy</Text>
        </Pressable>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.lastUpdated}>
          <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.lastUpdatedText}>Last updated: 1 February 2026</Text>
        </Animated.View>

        {sections.map((section, index) => (
          <Animated.View
            key={`${activeTab}-${index}`}
            entering={FadeInDown.delay(120 + index * 50).duration(400)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.footer}>
          <Text style={styles.footerText}>
            If you have any questions about these {activeTab === 'terms' ? 'terms' : 'policies'}, please contact us at support@dine-earn.com
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 16,
  },
  headerTitle: { fontSize: 20, fontFamily: 'Poppins_700Bold', color: Colors.text },

  tabBar: {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 16,
    backgroundColor: '#FFF', borderRadius: 14, padding: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: 11,
  },
  tabActive: { backgroundColor: Colors.primary + '10' },
  tabText: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary, fontFamily: 'Poppins_600SemiBold' },

  lastUpdated: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginHorizontal: 20, marginBottom: 16,
  },
  lastUpdatedText: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },

  section: {
    marginHorizontal: 20, marginBottom: 12, backgroundColor: '#FFF', borderRadius: 16,
    padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  sectionTitle: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.text, marginBottom: 8 },
  sectionContent: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, lineHeight: 20 },

  footer: {
    marginHorizontal: 20, marginTop: 12, paddingVertical: 16, paddingHorizontal: 20,
    backgroundColor: Colors.surface, borderRadius: 14,
  },
  footerText: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, textAlign: 'center', lineHeight: 18 },
});
