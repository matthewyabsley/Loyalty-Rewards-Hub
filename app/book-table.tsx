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

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedGuests, setSelectedGuests] = useState<number>(2);
  const [notes, setNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const dates = getNext14Days();

  async function handleBook() {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Info', 'Please select a date and time for your booking.');
      return;
    }
    setIsBooking(true);
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    await addBooking({
      date: selectedDate,
      time: selectedTime,
      guests: selectedGuests,
      status: 'confirmed',
      notes,
    });
    await updatePoints(20);
    setIsBooking(false);
    Alert.alert(
      'Booking Confirmed',
      `Table for ${selectedGuests} on ${new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at ${selectedTime}. You earned 20 points!`,
      [{ text: 'Great!', onPress: () => router.back() }]
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topBarTitle}>Book a Table</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100).duration(600)}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            {dates.map(d => {
              const isSelected = selectedDate === d.value;
              const dayName = d.day;
              const dayNum = d.num;
              const month = d.month;
              return (
                <Pressable
                  key={d.value}
                  style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                  onPress={() => setSelectedDate(d.value)}
                >
                  <Text style={[styles.dateDayName, isSelected && styles.dateTextSelected]}>{dayName}</Text>
                  <Text style={[styles.dateDayNum, isSelected && styles.dateTextSelected]}>{dayNum}</Text>
                  <Text style={[styles.dateMonth, isSelected && styles.dateTextSelected]}>{month}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map(time => {
              const isSelected = selectedTime === time;
              return (
                <Pressable
                  key={time}
                  style={[styles.timeChip, isSelected && styles.timeChipSelected]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>{time}</Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Text style={styles.sectionTitle}>Number of Guests</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.guestRow}>
              {GUEST_OPTIONS.map(g => {
                const isSelected = selectedGuests === g;
                return (
                  <Pressable
                    key={g}
                    style={[styles.guestChip, isSelected && styles.guestChipSelected]}
                    onPress={() => setSelectedGuests(g)}
                  >
                    <Ionicons name="person" size={14} color={isSelected ? '#FFF' : Colors.textSecondary} />
                    <Text style={[styles.guestText, isSelected && styles.guestTextSelected]}>{g}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.summaryText}>
              {selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Select a date'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="time-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.summaryText}>{selectedTime || 'Select a time'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="people-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.summaryText}>{selectedGuests} guest{selectedGuests > 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.pointsEarn}>
            <Ionicons name="star" size={14} color={Colors.accent} />
            <Text style={styles.pointsEarnText}>Earn 20 points with this booking</Text>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 12 }]}>
        <Pressable
          style={({ pressed }) => [
            styles.bookButton,
            (!selectedDate || !selectedTime) && styles.bookButtonDisabled,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleBook}
          disabled={isBooking || !selectedDate || !selectedTime}
        >
          <Text style={styles.bookButtonText}>{isBooking ? 'Booking...' : 'Confirm Booking'}</Text>
        </Pressable>
      </View>
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
    paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topBarTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  scrollContent: { padding: 20, paddingBottom: 120 },
  sectionTitle: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: Colors.text, marginBottom: 12, marginTop: 8 },
  dateScroll: { marginBottom: 20 },
  dateCard: {
    width: 72, height: 90, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  dateCardSelected: { backgroundColor: Colors.primary },
  dateDayName: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  dateDayNum: { fontSize: 22, fontFamily: 'Poppins_700Bold', color: Colors.text, marginVertical: 2 },
  dateMonth: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  dateTextSelected: { color: '#FFF' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  timeChip: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
  },
  timeChipSelected: { backgroundColor: Colors.primary },
  timeText: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text },
  timeTextSelected: { color: '#FFF' },
  guestRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  guestChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
  },
  guestChipSelected: { backgroundColor: Colors.primary },
  guestText: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text },
  guestTextSelected: { color: '#FFF' },
  summaryCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 18, gap: 14, marginTop: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  summaryText: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.text },
  pointsEarn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.accent + '15',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginTop: 4,
  },
  pointsEarnText: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.accentDark },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingTop: 12, backgroundColor: '#FFF',
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  bookButton: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  bookButtonDisabled: { opacity: 0.4 },
  bookButtonText: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
});
