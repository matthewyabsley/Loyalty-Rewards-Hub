import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, Linking, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: 'How do I earn loyalty points?',
    answer: 'You earn points every time you dine with us. For every pound spent, you earn 1 loyalty point. Points are automatically added to your account after your visit.',
  },
  {
    question: 'How do I redeem my rewards?',
    answer: 'Go to the Rewards tab and swipe through your available rewards. Tap "Claim" to generate a QR code, then show it to your server when you visit.',
  },
  {
    question: 'Can I cancel a table booking?',
    answer: 'Yes, you can cancel a booking up to 2 hours before your reservation time. Go to Bookings, find your reservation, and tap the cancel button.',
  },
  {
    question: 'How do I modify my order?',
    answer: 'You can modify your order before it\'s confirmed. Once an order is being prepared, please speak with your server for any changes.',
  },
  {
    question: 'What are the membership tiers?',
    answer: 'We have four tiers: Bronze (0-199 pts), Silver (200-499 pts), Gold (500-999 pts), and Platinum (1000+ pts). Each tier unlocks exclusive perks and rewards.',
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Yes, all payment data is encrypted and we never store your full card number. We use industry-standard security protocols to protect your information.',
  },
];

export default function HelpSupportScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  function handleSendMessage() {
    if (!message.trim()) return;
    Alert.alert('Message Sent', 'Thank you for reaching out. Our team will respond within 24 hours.');
    setMessage('');
  }

  const contactOptions = [
    { icon: 'call-outline', label: 'Call Us', detail: '+44 20 7946 0958', action: () => Linking.openURL('tel:+442079460958') },
    { icon: 'mail-outline', label: 'Email', detail: 'support@dine-earn.com', action: () => Linking.openURL('mailto:support@dine-earn.com') },
    { icon: 'chatbubble-ellipses-outline', label: 'Live Chat', detail: 'Available 9am - 10pm', action: () => Alert.alert('Live Chat', 'Live chat will be available soon.') },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.contactSection}>
          {contactOptions.map((opt, i) => (
            <Pressable
              key={opt.label}
              style={({ pressed }) => [
                styles.contactItem,
                i < contactOptions.length - 1 && styles.contactBorder,
                pressed && { backgroundColor: Colors.surface },
              ]}
              onPress={opt.action}
            >
              <View style={styles.contactIconWrap}>
                <Ionicons name={opt.icon as any} size={20} color={Colors.primary} />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>{opt.label}</Text>
                <Text style={styles.contactDetail}>{opt.detail}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.border} />
            </Pressable>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(140).duration(400)}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        </Animated.View>

        {FAQ_DATA.map((faq, index) => (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(200 + index * 40).duration(400)}
          >
            <Pressable
              style={[
                styles.faqItem,
                expandedFaq === index && styles.faqExpanded,
              ]}
              onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={Colors.textSecondary}
                />
              </View>
              {expandedFaq === index && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </Pressable>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <Text style={styles.sectionTitle}>Send Us a Message</Text>
          <View style={styles.messageCard}>
            <TextInput
              style={styles.messageInput}
              placeholder="Describe your issue or question..."
              placeholderTextColor={Colors.border}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Pressable
              style={({ pressed }) => [
                styles.sendBtn,
                !message.trim() && styles.sendBtnDisabled,
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Ionicons name="send" size={16} color="#FFF" />
              <Text style={styles.sendBtnText}>Send Message</Text>
            </Pressable>
          </View>
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

  contactSection: {
    marginHorizontal: 20, marginBottom: 24, backgroundColor: '#FFF', borderRadius: 18,
    overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  contactItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18,
  },
  contactBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  contactIconWrap: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primary + '10',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  contactDetails: { flex: 1 },
  contactLabel: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  contactDetail: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 1 },

  sectionTitle: {
    fontSize: 17, fontFamily: 'Poppins_700Bold', color: Colors.text,
    marginHorizontal: 20, marginBottom: 12,
  },

  faqItem: {
    marginHorizontal: 20, marginBottom: 8, backgroundColor: '#FFF', borderRadius: 16,
    padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  faqExpanded: { borderWidth: 1.5, borderColor: Colors.primary + '20' },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQuestion: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text, flex: 1, marginRight: 12 },
  faqAnswer: {
    fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary,
    marginTop: 12, lineHeight: 20,
  },

  messageCard: {
    marginHorizontal: 20, backgroundColor: '#FFF', borderRadius: 18, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  messageInput: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, padding: 14,
    fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.text,
    backgroundColor: Colors.surface, minHeight: 100,
  },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, marginTop: 14,
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnText: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
});
