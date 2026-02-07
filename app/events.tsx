import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '@/lib/data-context';
import Colors from '@/constants/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';

const CATEGORY_COLORS: Record<string, string> = {
  'Tasting': '#8B5AE8',
  'Dining': '#E8735A',
  'Entertainment': '#5A9AE8',
  'Workshop': Colors.accent,
};

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const { events } = useData();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topBarTitle}>Events</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Upcoming experiences at our restaurant</Text>

        {events.map((event, i) => (
          <Animated.View key={event.id} entering={FadeInDown.delay(i * 80).duration(500)}>
            <EventCard event={event} />
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

function EventCard({ event }: { event: any }) {
  const catColor = CATEGORY_COLORS[event.category] || Colors.primary;
  const eventDate = new Date(event.date);

  return (
    <Pressable
      style={({ pressed }) => [styles.eventCard, pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 }]}
      onPress={() => router.push({ pathname: '/event-detail', params: { id: event.id } })}
    >
      <View style={[styles.eventDateBadge, { backgroundColor: catColor + '12' }]}>
        <Text style={[styles.eventDateDay, { color: catColor }]}>{eventDate.getDate()}</Text>
        <Text style={[styles.eventDateMonth, { color: catColor }]}>
          {eventDate.toLocaleDateString('en-GB', { month: 'short' })}
        </Text>
      </View>
      <View style={styles.eventInfo}>
        <View style={styles.eventHeaderRow}>
          <View style={[styles.categoryTag, { backgroundColor: catColor + '18' }]}>
            <Text style={[styles.categoryTagText, { color: catColor }]}>{event.category}</Text>
          </View>
          <Text style={styles.eventSpots}>{event.spotsLeft} spots left</Text>
        </View>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.eventMeta}>
          <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.eventMetaText}>{event.time}</Text>
          <Text style={styles.eventPrice}>{'\u00A3'}{event.price}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </Pressable>
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
  content: { padding: 20, paddingBottom: 40, gap: 14 },
  subtitle: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginBottom: 4 },
  eventCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16,
    padding: 16, gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  eventDateBadge: {
    width: 60, height: 68, borderRadius: 14, justifyContent: 'center', alignItems: 'center',
  },
  eventDateDay: { fontSize: 24, fontFamily: 'Poppins_700Bold' },
  eventDateMonth: { fontSize: 12, fontFamily: 'Poppins_500Medium', textTransform: 'uppercase' },
  eventInfo: { flex: 1, gap: 6 },
  eventHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categoryTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  categoryTagText: { fontSize: 11, fontFamily: 'Poppins_600SemiBold' },
  eventSpots: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  eventTitle: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  eventMetaText: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginRight: 8 },
  eventPrice: { fontSize: 15, fontFamily: 'Poppins_700Bold', color: Colors.primary },
});
