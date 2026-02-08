import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '@/lib/data-context';
import { useAuth } from '@/lib/auth-context';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

const TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
];
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function BookTableScreen() {
  const insets = useSafeAreaInsets();
  const { addBooking } = useData();
  const { updatePoints } = useAuth();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedGuests, setSelectedGuests] = useState(2);
  const [isBooking, setIsBooking] = useState(false);

  const dates = getNext14Days();

  async function handleBook() {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Info', 'Please select a date and time.');
      return;
    }
    setIsBooking(true);
    try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    await addBooking({ date: selectedDate, time: selectedTime, guests: selectedGuests, status: 'confirmed', notes: '' });
    await updatePoints(20);
    setIsBooking(false);
    Alert.alert(
      'Booking Confirmed',
      `Table for ${selectedGuests} on ${new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at ${selectedTime}.\n\nYou earned 20 points!`,
      [{ text: 'Done', onPress: () => router.back() }]
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Book a Table</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <Text style={styles.label}>Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateRow}>
            {dates.map(d => {
              const active = selectedDate === d.value;
              return (
                <Pressable key={d.value} onPress={() => setSelectedDate(d.value)}>
                  {active ? (
                    <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.dateCard}>
                      <Text style={[styles.dateDayName, { color: 'rgba(255,255,255,0.7)' }]}>{d.day}</Text>
                      <Text style={[styles.dateDayNum, { color: '#FFF' }]}>{d.num}</Text>
                      <Text style={[styles.dateMonth, { color: 'rgba(255,255,255,0.7)' }]}>{d.month}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.dateCard}>
                      <Text style={styles.dateDayName}>{d.day}</Text>
                      <Text style={styles.dateDayNum}>{d.num}</Text>
                      <Text style={styles.dateMonth}>{d.month}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(500)}>
          <Text style={styles.label}>Time</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map(time => {
              const active = selectedTime === time;
              return (
                <Pressable key={time} onPress={() => setSelectedTime(time)}>
                  {active ? (
                    <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.timeChip}>
                      <Text style={[styles.timeText, { color: '#FFF' }]}>{time}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.timeChip}>
                      <Text style={styles.timeText}>{time}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(500)}>
          <Text style={styles.label}>Guests</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.guestRow}>
              {GUEST_OPTIONS.map(g => {
                const active = selectedGuests === g;
                return (
                  <Pressable key={g} onPress={() => setSelectedGuests(g)}>
                    {active ? (
                      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.guestChip}>
                        <Ionicons name="person" size={13} color="#FFF" />
                        <Text style={[styles.guestText, { color: '#FFF' }]}>{g}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.guestChip}>
                        <Ionicons name="person-outline" size={13} color={Colors.textSecondary} />
                        <Text style={styles.guestText}>{g}</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(320).duration(500)} style={styles.summaryCard}>
          <SummaryRow icon="calendar" value={selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Select date'} />
          <SummaryRow icon="time" value={selectedTime || 'Select time'} />
          <SummaryRow icon="people" value={`${selectedGuests} guest${selectedGuests > 1 ? 's' : ''}`} />
          <View style={styles.pointsPill}>
            <Ionicons name="star" size={14} color={Colors.accent} />
            <Text style={styles.pointsPillText}>Earn 20 points</Text>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 14 }]}>
        <Pressable
          style={({ pressed }) => [pressed && { transform: [{ scale: 0.98 }] }]}
          onPress={handleBook}
          disabled={isBooking || !selectedDate || !selectedTime}
        >
          <LinearGradient
            colors={(!selectedDate || !selectedTime) ? ['#CCC', '#BBB'] : [Colors.primary, Colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bookBtn}
          >
            <Text style={styles.bookBtnText}>{isBooking ? 'Booking...' : 'Confirm Booking'}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function SummaryRow({ icon, value }: { icon: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Ionicons name={icon as any} size={18} color={Colors.textSecondary} />
      <Text style={styles.summaryText}>{value}</Text>
    </View>
  );
}

function getNext14Days() {
  const days = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      value: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-GB', { weekday: 'short' }),
      num: date.getDate().toString(),
      month: date.toLocaleDateString('en-GB', { month: 'short' }),
    });
  }
  return days;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 14,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  scroll: { padding: 20, paddingBottom: 140 },
  label: { fontSize: 17, fontFamily: 'Poppins_700Bold', color: Colors.text, marginBottom: 14, marginTop: 8 },
  dateRow: { marginBottom: 4 },
  dateCard: {
    width: 72, height: 92, borderRadius: 18, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  dateDayName: { fontSize: 11, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  dateDayNum: { fontSize: 24, fontFamily: 'Poppins_700Bold', color: Colors.text, marginVertical: 2 },
  dateMonth: { fontSize: 10, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  timeChip: {
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, backgroundColor: '#FFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  timeText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  guestRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  guestChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, backgroundColor: '#FFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  guestText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  summaryCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 20, gap: 16, marginTop: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  summaryText: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text },
  pointsPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.accent + '12',
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginTop: 2,
  },
  pointsPillText: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: Colors.accentDark },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingTop: 14, backgroundColor: Colors.background,
  },
  bookBtn: { borderRadius: 18, paddingVertical: 18, alignItems: 'center' },
  bookBtnText: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#FFF' },
});
