import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '@/lib/data-context';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const { bookings, cancelBooking } = useData();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  function handleCancel(bookingId: string) {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'Keep It', style: 'cancel' },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: async () => {
            try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } catch {}
            await cancelBooking(bookingId);
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16 }]}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Bookings</Text>
              <Text style={styles.headerCount}>
                {activeBookings.length} active booking{activeBookings.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [pressed && { transform: [{ scale: 0.95 }] }]}
              onPress={() => router.push('/book-table')}
            >
              <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.newBtn}>
                <Ionicons name="add" size={20} color="#FFF" />
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="calendar-outline" size={44} color={Colors.border} />
            </View>
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptySubtitle}>Reserve a table to get started</Text>
            <Pressable onPress={() => router.push('/book-table')}>
              <LinearGradient colors={['#1A1A1A', '#2D2D2D']} style={styles.emptyBtn}>
                <Ionicons name="calendar" size={17} color="#FFF" />
                <Text style={styles.emptyBtnText}>Book a Table</Text>
              </LinearGradient>
            </Pressable>
          </View>
        ) : (
          <>
            {activeBookings.length > 0 && (
              <Animated.View entering={FadeInDown.delay(80).duration(500)} style={styles.section}>
                {activeBookings.map((booking, i) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancel}
                    delay={i * 60}
                  />
                ))}
              </Animated.View>
            )}

            {cancelledBookings.length > 0 && (
              <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
                <Text style={styles.sectionLabel}>Cancelled</Text>
                {cancelledBookings.map((booking, i) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancel}
                    delay={i * 60}
                    isCancelled
                  />
                ))}
              </Animated.View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function BookingCard({ booking, onCancel, delay, isCancelled }: {
  booking: any; onCancel: (id: string) => void; delay: number; isCancelled?: boolean;
}) {
  const bookingDate = new Date(booking.date);
  const isPast = bookingDate < new Date();
  const dayName = bookingDate.toLocaleDateString('en-GB', { weekday: 'short' });
  const dayNum = bookingDate.getDate();
  const monthName = bookingDate.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
  const fullDate = bookingDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const statusColor = isCancelled ? Colors.textSecondary : booking.status === 'confirmed' ? Colors.success : Colors.warning;
  const statusText = isCancelled ? 'Cancelled' : booking.status === 'confirmed' ? 'Confirmed' : 'Pending';

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <View style={[styles.bookingCard, isCancelled && styles.bookingCardCancelled]}>
        <View style={styles.bookingTop}>
          {isCancelled ? (
            <View style={[styles.dateBlock, { backgroundColor: '#F0F0EE' }]}>
              <Text style={[styles.dateNum, { color: Colors.textSecondary }]}>{dayNum}</Text>
              <Text style={[styles.dateMonth, { color: Colors.textSecondary }]}>{monthName}</Text>
            </View>
          ) : (
            <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.dateBlock}>
              <Text style={[styles.dateNum, { color: '#FFF' }]}>{dayNum}</Text>
              <Text style={[styles.dateMonth, { color: 'rgba(255,255,255,0.8)' }]}>{monthName}</Text>
            </LinearGradient>
          )}

          <View style={styles.bookingInfo}>
            <Text style={[styles.bookingDate, isCancelled && { color: Colors.textSecondary }]}>{fullDate}</Text>
            <View style={styles.bookingMeta}>
              <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.bookingMetaText}>{booking.time}</Text>
              <View style={styles.metaDot} />
              <Ionicons name="people-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.bookingMetaText}>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bookingBottom}>
          <View style={[styles.statusChip, { backgroundColor: statusColor + '12' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>

          {!isCancelled && !isPast && (
            <Pressable
              style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.7 }]}
              onPress={() => onCancel(booking.id)}
            >
              <Ionicons name="close-circle-outline" size={17} color={Colors.error} />
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 24, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 30, fontFamily: 'Poppins_700Bold', color: Colors.text },
  headerCount: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: -2 },
  newBtn: { width: 46, height: 46, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },

  emptyState: { alignItems: 'center', paddingTop: 80, gap: 14 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.surface,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  emptyTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  emptySubtitle: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  emptyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, marginTop: 6,
  },
  emptyBtnText: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },

  section: { paddingHorizontal: 20, gap: 12 },
  sectionLabel: {
    fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.textSecondary,
    marginTop: 12, marginBottom: 4,
  },

  bookingCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  bookingCardCancelled: { opacity: 0.6 },

  bookingTop: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  dateBlock: {
    width: 60, height: 66, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },
  dateNum: { fontSize: 24, fontFamily: 'Poppins_700Bold', lineHeight: 28 },
  dateMonth: { fontSize: 10, fontFamily: 'Poppins_600SemiBold', letterSpacing: 1 },

  bookingInfo: { flex: 1, justifyContent: 'center', gap: 6 },
  bookingDate: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  bookingMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  bookingMetaText: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.border },

  bookingBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontFamily: 'Poppins_600SemiBold' },

  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    backgroundColor: Colors.error + '08',
  },
  cancelText: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: Colors.error },
});
