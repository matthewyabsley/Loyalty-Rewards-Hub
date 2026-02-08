import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import { useData } from '@/lib/data-context';
import Colors from '@/constants/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_GAP = 14;
const ACTION_SIZE = (width - 48 - CARD_GAP) / 2;

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
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View style={[styles.headerWrap, { paddingTop: insets.top + webTopInset + 20 }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
            </View>
            <Pressable
              style={styles.avatarButton}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.avatarGradient}>
                <Text style={styles.avatarText}>{user?.avatar || 'G'}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(80).duration(500)} style={styles.balanceCard}>
          <LinearGradient
            colors={['#1A1A1A', '#2D2D2D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceGradient}
          >
            <View style={styles.balanceTop}>
              <View>
                <Text style={styles.balanceLabel}>POINTS BALANCE</Text>
                <Text style={styles.balanceValue}>{(user?.totalPoints || 0).toLocaleString()}</Text>
              </View>
              <View style={styles.tierPill}>
                <Ionicons name="diamond" size={13} color={Colors.accent} />
                <Text style={styles.tierPillText}>{user?.tier || 'Bronze'}</Text>
              </View>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceBottom}>
              <View style={styles.balanceStat}>
                <Text style={styles.balanceStatLabel}>Credits</Text>
                <Text style={styles.balanceStatValue}>{user?.availableCredits || 0}</Text>
              </View>
              <View style={styles.balanceStat}>
                <Text style={styles.balanceStatLabel}>Rewards</Text>
                <Text style={styles.balanceStatValue}>{unclaimedRewards}</Text>
              </View>
              <View style={styles.balanceStat}>
                <Text style={styles.balanceStatLabel}>Bookings</Text>
                <Text style={styles.balanceStatValue}>{bookings.length}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(500)} style={styles.section}>
          <View style={styles.actionsGrid}>
            <ActionCard
              icon="calendar"
              iconPack="ionicons"
              label="Book Table"
              subtitle="Reserve a spot"
              gradient={['#E8735A', '#D45A42']}
              onPress={() => router.push('/book-table')}
            />
            <ActionCard
              icon="restaurant"
              iconPack="ionicons"
              label="Order Food"
              subtitle="At your table"
              gradient={['#5A9AE8', '#4280D0']}
              onPress={() => router.push('/menu')}
            />
            <ActionCard
              icon="sparkles"
              iconPack="ionicons"
              label="Events"
              subtitle="Experiences"
              gradient={['#8B5AE8', '#7042D0']}
              onPress={() => router.push('/events')}
            />
            <ActionCard
              icon="gift"
              iconPack="ionicons"
              label="Rewards"
              subtitle={`${unclaimedRewards} active`}
              gradient={[Colors.accent, Colors.accentDark]}
              onPress={() => router.push('/(tabs)/rewards')}
              badge={unclaimedRewards}
            />
          </View>
        </Animated.View>

        {bookings.length > 0 && (
          <Animated.View entering={FadeInDown.delay(240).duration(500)} style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            {bookings.slice(0, 2).map(booking => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingDateBlock}>
                  <Text style={styles.bookingDayNum}>
                    {new Date(booking.date).getDate()}
                  </Text>
                  <Text style={styles.bookingMonth}>
                    {new Date(booking.date).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.bookingDetails}>
                  <Text style={styles.bookingTime}>{booking.time}</Text>
                  <Text style={styles.bookingGuests}>
                    {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={[
                  styles.statusChip,
                  booking.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending,
                ]}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: booking.status === 'confirmed' ? Colors.success : Colors.warning },
                  ]} />
                  <Text style={[
                    styles.statusLabel,
                    { color: booking.status === 'confirmed' ? Colors.success : Colors.warning },
                  ]}>
                    {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </Text>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(320).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Rewards</Text>
            {unclaimedRewards > 0 && (
              <Pressable onPress={() => router.push('/(tabs)/rewards')}>
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            )}
          </View>
          {unclaimedRewards === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="gift-outline" size={36} color={Colors.border} />
              <Text style={styles.emptyTitle}>No active rewards</Text>
              <Text style={styles.emptySubtext}>Keep dining to unlock rewards</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {rewards.filter(r => !r.claimed).slice(0, 4).map(reward => (
                <Pressable
                  key={reward.id}
                  style={({ pressed }) => [styles.rewardPill, pressed && { opacity: 0.85 }]}
                  onPress={() => router.push('/(tabs)/rewards')}
                >
                  <View style={[
                    styles.rewardIconWrap,
                    {
                      backgroundColor: reward.type === 'discount' ? '#E8735A' : reward.type === 'credit' ? Colors.success : Colors.accent,
                    },
                  ]}>
                    <Ionicons
                      name={reward.type === 'discount' ? 'pricetag' : reward.type === 'credit' ? 'wallet' : 'star'}
                      size={15}
                      color="#FFF"
                    />
                  </View>
                  <View style={styles.rewardPillInfo}>
                    <Text style={styles.rewardPillTitle} numberOfLines={1}>{reward.title}</Text>
                    <Text style={styles.rewardPillValue}>{reward.value}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function ActionCard({ icon, iconPack, label, subtitle, gradient, onPress, badge }: {
  icon: string; iconPack: string; label: string; subtitle: string;
  gradient: string[]; onPress: () => void; badge?: number;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.actionCard, pressed && { transform: [{ scale: 0.96 }] }]}
      onPress={onPress}
    >
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionGradient}>
        <View style={styles.actionTop}>
          <Ionicons name={icon as any} size={26} color="#FFF" />
          {badge && badge > 0 ? (
            <View style={styles.actionBadge}>
              <Text style={styles.actionBadgeText}>{badge}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.actionBottom}>
          <Text style={styles.actionLabel}>{label}</Text>
          <Text style={styles.actionSub}>{subtitle}</Text>
        </View>
      </LinearGradient>
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
  headerWrap: { paddingHorizontal: 24, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: {},
  greeting: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, letterSpacing: 0.3 },
  userName: { fontSize: 26, fontFamily: 'Poppins_700Bold', color: Colors.text, marginTop: -2 },
  avatarButton: {},
  avatarGradient: {
    width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 20, fontFamily: 'Poppins_700Bold', color: '#FFF' },

  balanceCard: { marginHorizontal: 20, marginBottom: 24 },
  balanceGradient: { borderRadius: 22, padding: 22 },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  balanceLabel: {
    fontSize: 11, fontFamily: 'Poppins_500Medium', color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1.5, marginBottom: 4,
  },
  balanceValue: { fontSize: 38, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  tierPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(212,168,83,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  tierPillText: { fontSize: 12, fontFamily: 'Poppins_600SemiBold', color: Colors.accent },
  balanceDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 18 },
  balanceBottom: { flexDirection: 'row', justifyContent: 'space-around' },
  balanceStat: { alignItems: 'center' },
  balanceStatLabel: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.4)', marginBottom: 2 },
  balanceStatValue: { fontSize: 20, fontFamily: 'Poppins_700Bold', color: '#FFF' },

  section: { paddingHorizontal: 20, marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 19, fontFamily: 'Poppins_700Bold', color: Colors.text, marginBottom: 14 },
  seeAll: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: Colors.primary, marginBottom: 14 },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP },
  actionCard: { width: ACTION_SIZE },
  actionGradient: {
    borderRadius: 20, padding: 18, height: ACTION_SIZE * 0.85,
    justifyContent: 'space-between',
  },
  actionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  actionBadge: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
  },
  actionBadgeText: { fontSize: 11, fontFamily: 'Poppins_700Bold', color: Colors.text },
  actionBottom: {},
  actionLabel: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  actionSub: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.7)', marginTop: 1 },

  bookingCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 18,
    padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  bookingDateBlock: {
    width: 54, height: 58, borderRadius: 14, backgroundColor: Colors.primary + '0C',
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  bookingDayNum: { fontSize: 22, fontFamily: 'Poppins_700Bold', color: Colors.primary, lineHeight: 26 },
  bookingMonth: { fontSize: 10, fontFamily: 'Poppins_600SemiBold', color: Colors.primary, letterSpacing: 1 },
  bookingDetails: { flex: 1 },
  bookingTime: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  bookingGuests: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 2 },
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  statusConfirmed: { backgroundColor: Colors.success + '12' },
  statusPending: { backgroundColor: Colors.warning + '12' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusLabel: { fontSize: 11, fontFamily: 'Poppins_600SemiBold' },

  emptyState: { alignItems: 'center', paddingVertical: 36, gap: 8 },
  emptyTitle: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.textSecondary },
  emptySubtext: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: '#B5B5B5' },

  rewardPill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16,
    padding: 14, paddingRight: 20, marginRight: 12, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    minWidth: 180,
  },
  rewardIconWrap: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rewardPillInfo: { flex: 1 },
  rewardPillTitle: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.text },
  rewardPillValue: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: Colors.primary, marginTop: 1 },
});
