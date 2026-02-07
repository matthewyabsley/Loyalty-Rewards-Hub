import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '@/lib/data-context';
import { useAuth } from '@/lib/auth-context';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

const CATEGORY_COLORS: Record<string, string> = {
  'Tasting': '#8B5AE8',
  'Dining': '#E8735A',
  'Entertainment': '#5A9AE8',
  'Workshop': Colors.accent,
};

export default function EventDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, bookEvent, addTransaction } = useData();
  const { updatePoints } = useAuth();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.emptyText}>Event not found</Text>
      </View>
    );
  }

  const catColor = CATEGORY_COLORS[event.category] || Colors.primary;
  const eventDate = new Date(event.date);

  async function handleBook() {
    if (event.spotsLeft <= 0) {
      Alert.alert('Sold Out', 'This event is fully booked.');
      return;
    }
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    await bookEvent(event.id);
    await updatePoints(30);
    await addTransaction({
      description: `Booked: ${event.title}`,
      points: 30,
      date: new Date().toISOString().split('T')[0],
      type: 'earned',
    });
    Alert.alert(
      'Event Booked!',
      `You've booked a spot for ${event.title}. You earned 30 points!`,
      [{ text: 'Awesome!', onPress: () => router.back() }]
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topBarTitle}>Event Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.heroSection, { backgroundColor: catColor + '12' }]}>
          <Ionicons name={event.icon as any} size={56} color={catColor} />
          <View style={[styles.categoryTag, { backgroundColor: catColor + '25' }]}>
            <Text style={[styles.categoryTagText, { color: catColor }]}>{event.category}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.description}>{event.description}</Text>

          <View style={styles.infoGrid}>
            <InfoRow icon="calendar-outline" label="Date" value={eventDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
            <InfoRow icon="time-outline" label="Time" value={event.time} />
            <InfoRow icon="people-outline" label="Spots Left" value={`${event.spotsLeft} remaining`} />
            <InfoRow icon="pricetag-outline" label="Price" value={`\u00A3${event.price} per person`} />
          </View>

          <View style={styles.pointsBanner}>
            <Ionicons name="star" size={18} color={Colors.accent} />
            <Text style={styles.pointsBannerText}>Earn 30 loyalty points when you book this event</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 12 }]}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Total</Text>
          <Text style={styles.footerPriceValue}>{'\u00A3'}{event.price}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.bookButton,
            event.spotsLeft <= 0 && styles.bookButtonDisabled,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleBook}
          disabled={event.spotsLeft <= 0}
        >
          <Text style={styles.bookButtonText}>
            {event.spotsLeft <= 0 ? 'Sold Out' : 'Book Now'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon as any} size={20} color={Colors.textSecondary} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topBarTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  content: { paddingBottom: 120 },
  heroSection: {
    height: 180, justifyContent: 'center', alignItems: 'center', gap: 14,
  },
  categoryTag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  categoryTagText: { fontSize: 13, fontFamily: 'Poppins_600SemiBold' },
  details: { padding: 24, gap: 16 },
  title: { fontSize: 24, fontFamily: 'Poppins_700Bold', color: Colors.text },
  description: { fontSize: 15, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, lineHeight: 24 },
  infoGrid: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 4, gap: 0,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  infoValue: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text, marginTop: 1 },
  pointsBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.accent + '15',
    padding: 16, borderRadius: 14,
  },
  pointsBannerText: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.accentDark, flex: 1 },
  emptyText: { fontSize: 16, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 14, backgroundColor: '#FFF',
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  footerPrice: {},
  footerPriceLabel: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  footerPriceValue: { fontSize: 22, fontFamily: 'Poppins_700Bold', color: Colors.text },
  bookButton: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32,
  },
  bookButtonDisabled: { opacity: 0.4 },
  bookButtonText: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
});
