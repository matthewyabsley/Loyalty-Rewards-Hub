import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '@/lib/data-context';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

const CAT_GRADIENTS: Record<string, string[]> = {
  'Tasting': ['#8B5AE8', '#7042D0'],
  'Dining': ['#E8735A', '#D45A42'],
  'Entertainment': ['#5A9AE8', '#4280D0'],
  'Workshop': [Colors.accent, Colors.accentDark],
};

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const { events } = useData();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Events</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Upcoming experiences</Text>
        {events.map((event, i) => (
          <Animated.View key={event.id} entering={FadeInDown.delay(i * 60).duration(450)}>
            <EventCard event={event} />
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

function EventCard({ event }: { event: any }) {
  const gradient = CAT_GRADIENTS[event.category] || [Colors.primary, Colors.primaryLight];
  const eventDate = new Date(event.date);

  return (
    <Pressable
      style={({ pressed }) => [styles.eventCard, pressed && { transform: [{ scale: 0.98 }] }]}
      onPress={() => router.push({ pathname: '/event-detail', params: { id: event.id } })}
    >
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.eventDateBlock}>
        <Text style={styles.eventDay}>{eventDate.getDate()}</Text>
        <Text style={styles.eventMonth}>{eventDate.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}</Text>
      </LinearGradient>
      <View style={styles.eventInfo}>
        <View style={styles.eventTagRow}>
          <View style={[styles.eventTag, { backgroundColor: gradient[0] + '14' }]}>
            <Text style={[styles.eventTagText, { color: gradient[0] }]}>{event.category}</Text>
          </View>
        </View>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.eventMeta}>
          <Ionicons name="time" size={13} color={Colors.textSecondary} />
          <Text style={styles.eventMetaText}>{event.time}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.eventPrice}>{'\u00A3'}{event.price}</Text>
          <View style={styles.metaDot} />
          <Text style={styles.eventSpots}>{event.spotsLeft} left</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.border} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 14,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  content: { padding: 20, paddingBottom: 40, gap: 12 },
  subtitle: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginBottom: 4 },

  eventCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20,
    padding: 16, gap: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  eventDateBlock: {
    width: 62, height: 70, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },
  eventDay: { fontSize: 26, fontFamily: 'Poppins_700Bold', color: '#FFF', lineHeight: 30 },
  eventMonth: { fontSize: 10, fontFamily: 'Poppins_600SemiBold', color: 'rgba(255,255,255,0.8)', letterSpacing: 1 },
  eventInfo: { flex: 1, gap: 6 },
  eventTagRow: { flexDirection: 'row' },
  eventTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  eventTagText: { fontSize: 11, fontFamily: 'Poppins_600SemiBold' },
  eventTitle: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: Colors.text },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  eventMetaText: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.border },
  eventPrice: { fontSize: 13, fontFamily: 'Poppins_700Bold', color: Colors.text },
  eventSpots: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
});
