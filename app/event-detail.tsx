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
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const CAT_GRADIENTS: Record<string, string[]> = {
  'Tasting': ['#8B5AE8', '#7042D0'],
  'Dining': ['#E8735A', '#D45A42'],
  'Entertainment': ['#5A9AE8', '#4280D0'],
  'Workshop': [Colors.accent, Colors.accentDark],
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
        <Ionicons name="alert-circle-outline" size={40} color={Colors.border} />
        <Text style={styles.notFound}>Event not found</Text>
      </View>
    );
  }

  const gradient = CAT_GRADIENTS[event.category] || [Colors.primary, Colors.primaryLight];
  const eventDate = new Date(event.date);

  async function handleBook() {
    if (event.spotsLeft <= 0) { Alert.alert('Sold Out', 'This event is fully booked.'); return; }
    try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    await bookEvent(event.id);
    await updatePoints(30);
    await addTransaction({
      description: `Booked: ${event.title}`,
      points: 30,
      date: new Date().toISOString().split('T')[0],
      type: 'earned',
    });
    Alert.alert('Booked!', `You're going to ${event.title}.\n\nYou earned 30 points!`, [{ text: 'Done', onPress: () => router.back() }]);
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <LinearGradient colors={gradient} style={[styles.hero, { paddingTop: insets.top + webTopInset + 8 }]}>
          <Pressable onPress={() => router.back()} style={styles.heroBack}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </Pressable>
          <View style={styles.heroContent}>
            <Ionicons name={event.icon as any} size={52} color="rgba(255,255,255,0.9)" />
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>{event.category}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.details}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.description}>{event.description}</Text>

          <View style={styles.infoCard}>
            <InfoRow icon="calendar" label="Date" value={eventDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
            <InfoRow icon="time" label="Time" value={event.time} />
            <InfoRow icon="people" label="Availability" value={`${event.spotsLeft} spots remaining`} />
            <InfoRow icon="pricetag" label="Price" value={`\u00A3${event.price} per person`} last />
          </View>

          <View style={styles.pointsBanner}>
            <Ionicons name="star" size={17} color={Colors.accent} />
            <Text style={styles.pointsBannerText}>Earn 30 loyalty points</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 14 }]}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerPriceLabel}>Total</Text>
          <Text style={styles.footerPriceValue}>{'\u00A3'}{event.price}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [pressed && { transform: [{ scale: 0.97 }] }]}
          onPress={handleBook}
          disabled={event.spotsLeft <= 0}
        >
          <LinearGradient
            colors={event.spotsLeft <= 0 ? ['#CCC', '#BBB'] : ['#1A1A1A', '#2D2D2D']}
            style={styles.bookBtn}
          >
            <Text style={styles.bookBtnText}>{event.spotsLeft <= 0 ? 'Sold Out' : 'Book Now'}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function InfoRow({ icon, label, value, last }: { icon: string; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon as any} size={18} color={Colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  notFound: { fontSize: 15, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary, marginTop: 12 },

  hero: { height: 220, justifyContent: 'space-between', paddingBottom: 0 },
  heroBack: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  heroContent: { alignItems: 'center', gap: 14, paddingBottom: 28 },
  heroTag: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20,
  },
  heroTagText: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },

  details: { padding: 24, gap: 18 },
  title: { fontSize: 26, fontFamily: 'Poppins_700Bold', color: Colors.text },
  description: { fontSize: 15, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, lineHeight: 24 },

  infoCard: {
    backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoIconWrap: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.primary + '0C',
    justifyContent: 'center', alignItems: 'center',
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginBottom: 1 },
  infoValue: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: Colors.text },

  pointsBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.accent + '12', padding: 18, borderRadius: 16,
  },
  pointsBannerText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: Colors.accentDark },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 14, backgroundColor: Colors.background,
  },
  footerLeft: {},
  footerPriceLabel: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  footerPriceValue: { fontSize: 24, fontFamily: 'Poppins_700Bold', color: Colors.text },
  bookBtn: { borderRadius: 16, paddingVertical: 16, paddingHorizontal: 36 },
  bookBtnText: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#FFF' },
});
