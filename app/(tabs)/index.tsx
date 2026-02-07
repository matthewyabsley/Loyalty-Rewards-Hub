import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import { useData } from '@/lib/data-context';
import Colors from '@/constants/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { rewards, bookings } = useData();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const unclaimedRewards = rewards.filter(r => !r.claimed).length;
  const greeting = getGreeting();

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight, Colors.primaryDark]}
          style={[styles.header, { paddingTop: insets.top + webTopInset + 16 }]}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
            </View>
            <Pressable
              style={styles.avatarButton}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Text style={styles.avatarText}>{user?.avatar || 'G'}</Text>
            </Pressable>
          </View>

          <View style={styles.pointsCard}>
            <View style={styles.pointsLeft}>
              <Text style={styles.pointsLabel}>Total Points</Text>
              <Text style={styles.pointsValue}>{user?.totalPoints || 0}</Text>
              <View style={styles.tierBadge}>
                <Ionicons name="shield-checkmark" size={14} color={Colors.accent} />
                <Text style={styles.tierText}>{user?.tier || 'Bronze'} Member</Text>
              </View>
            </View>
            <View style={styles.pointsDivider} />
            <View style={styles.pointsRight}>
              <Text style={styles.pointsLabel}>Credits</Text>
              <Text style={styles.creditsValue}>{user?.availableCredits || 0}</Text>
              <Text style={styles.creditsSubtext}>available</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <ActionCard
                icon="restaurant-outline"
                label="Book Table"
                color="#E8735A"
                onPress={() => router.push('/book-table')}
              />
              <ActionCard
                icon="fast-food-outline"
                label="Order Food"
                color="#5A9AE8"
                onPress={() => router.push('/menu')}
              />
              <ActionCard
                icon="calendar-outline"
                label="Events"
                color="#8B5AE8"
                onPress={() => router.push('/events')}
              />
              <ActionCard
                icon="gift-outline"
                label="Rewards"
                badge={unclaimedRewards}
                color={Colors.accent}
                onPress={() => router.push('/(tabs)/rewards')}
              />
            </View>
          </Animated.View>

          {bookings.length > 0 && (
            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
              {bookings.slice(0, 2).map(booking => (
                <View key={booking.id} style={styles.bookingCard}>
                  <View style={styles.bookingIcon}>
                    <Ionicons name="calendar" size={22} color={Colors.primary} />
                  </View>
                  <View style={styles.bookingInfo}>
                    <Text style={styles.bookingDate}>
                      {new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </Text>
                    <Text style={styles.bookingDetails}>
                      {booking.time} - {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, booking.status === 'confirmed' && styles.statusConfirmed]}>
                    <Text style={[styles.statusText, booking.status === 'confirmed' && styles.statusTextConfirmed]}>
                      {booking.status}
                    </Text>
                  </View>
                </View>
              ))}
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(300).duration(600)}>
            <Text style={styles.sectionTitle}>Active Rewards</Text>
            {rewards.filter(r => !r.claimed).length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="gift-outline" size={40} color="#CCC" />
                <Text style={styles.emptyText}>No active rewards yet</Text>
                <Text style={styles.emptySubtext}>Keep dining to earn rewards</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rewardScroll}>
                {rewards.filter(r => !r.claimed).slice(0, 3).map(reward => (
                  <Pressable
                    key={reward.id}
                    style={styles.rewardMini}
                    onPress={() => router.push('/(tabs)/rewards')}
                  >
                    <View style={[styles.rewardBadge, reward.type === 'discount' ? styles.rewardDiscount : reward.type === 'credit' ? styles.rewardCredit : styles.rewardOffer]}>
                      <Ionicons
                        name={reward.type === 'discount' ? 'pricetag' : reward.type === 'credit' ? 'wallet' : 'star'}
                        size={16}
                        color="#FFF"
                      />
                    </View>
                    <Text style={styles.rewardMiniTitle} numberOfLines={1}>{reward.title}</Text>
                    <Text style={styles.rewardMiniValue}>{reward.value}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

function ActionCard({ icon, label, color, badge, onPress }: {
  icon: string; label: string; color: string; badge?: number; onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.actionCard, pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 }]}
      onPress={onPress}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={26} color={color} />
        {badge && badge > 0 ? (
          <View style={styles.actionBadge}>
            <Text style={styles.actionBadgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerLeft: {},
  greeting: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.7)' },
  userName: { fontSize: 24, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  avatarButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
  pointsCard: {
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center',
  },
  pointsLeft: { flex: 1 },
  pointsLabel: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1 },
  pointsValue: { fontSize: 36, fontFamily: 'Poppins_700Bold', color: '#FFF', marginVertical: 2 },
  tierBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tierText: { fontSize: 12, fontFamily: 'Poppins_500Medium', color: Colors.accentLight },
  pointsDivider: { width: 1, height: 60, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 20 },
  pointsRight: { alignItems: 'center' },
  creditsValue: { fontSize: 28, fontFamily: 'Poppins_700Bold', color: Colors.accent, marginVertical: 2 },
  creditsSubtext: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.5)' },
  body: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text, marginBottom: 14 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  actionCard: {
    width: (width - 52) / 2, backgroundColor: '#FFF', borderRadius: 16, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  actionIconContainer: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionBadge: {
    position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.error, justifyContent: 'center', alignItems: 'center',
  },
  actionBadgeText: { fontSize: 11, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
  actionLabel: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text },
  bookingCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14,
    padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  bookingIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.primary + '10',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  bookingInfo: { flex: 1 },
  bookingDate: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  bookingDetails: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: Colors.warning + '20',
  },
  statusConfirmed: { backgroundColor: Colors.success + '20' },
  statusText: { fontSize: 11, fontFamily: 'Poppins_500Medium', color: Colors.warning, textTransform: 'capitalize' },
  statusTextConfirmed: { color: Colors.success },
  emptyState: { alignItems: 'center', paddingVertical: 30, gap: 8 },
  emptyText: { fontSize: 15, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  emptySubtext: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: '#BBB' },
  rewardScroll: { marginBottom: 20 },
  rewardMini: {
    width: 140, backgroundColor: '#FFF', borderRadius: 14, padding: 14, marginRight: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  rewardBadge: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  rewardDiscount: { backgroundColor: '#E8735A' },
  rewardCredit: { backgroundColor: Colors.success },
  rewardOffer: { backgroundColor: Colors.accent },
  rewardMiniTitle: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.text, marginBottom: 4 },
  rewardMiniValue: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: Colors.primary },
});
