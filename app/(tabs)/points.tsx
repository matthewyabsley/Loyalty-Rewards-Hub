import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import { useData } from '@/lib/data-context';
import Colors from '@/constants/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';

const TIERS = [
  { name: 'Bronze', min: 0, max: 499, color: '#CD7F32' },
  { name: 'Silver', min: 500, max: 1999, color: '#C0C0C0' },
  { name: 'Gold', min: 2000, max: 4999, color: Colors.accent },
  { name: 'Platinum', min: 5000, max: 99999, color: '#E5E4E2' },
];

export default function PointsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { transactions } = useData();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const points = user?.totalPoints || 0;

  const currentTier = TIERS.find(t => points >= t.min && points <= t.max) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progress = nextTier
    ? (points - currentTier.min) / (nextTier.min - currentTier.min)
    : 1;

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={[styles.header, { paddingTop: insets.top + webTopInset + 12 }]}>
          <Text style={styles.headerTitle}>My Points</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.tierCard}>
          <View style={styles.tierHeader}>
            <View style={[styles.tierIcon, { backgroundColor: currentTier.color + '20' }]}>
              <Ionicons name="shield-checkmark" size={28} color={currentTier.color} />
            </View>
            <View style={styles.tierInfo}>
              <Text style={styles.tierName}>{currentTier.name} Member</Text>
              <Text style={styles.totalPoints}>{points.toLocaleString()} points</Text>
            </View>
          </View>

          {nextTier && (
            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: currentTier.color }]} />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressText}>{points - currentTier.min} / {nextTier.min - currentTier.min}</Text>
                <Text style={styles.nextTierText}>{nextTier.min - points} pts to {nextTier.name}</Text>
              </View>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.statsRow}>
          <StatBox label="This Month" value="+85" icon="trending-up" color={Colors.success} />
          <StatBox label="Lifetime" value={points.toString()} icon="star" color={Colors.accent} />
          <StatBox label="Redeemed" value="40" icon="gift" color={Colors.primary} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={40} color="#DDD" />
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            transactions.map((tx, i) => (
              <TransactionItem key={tx.id} tx={tx} isLast={i === transactions.length - 1} />
            ))
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.tierLevels}>
          <Text style={styles.sectionTitle}>Loyalty Tiers</Text>
          {TIERS.map((tier, i) => (
            <View key={tier.name} style={[styles.tierLevel, i === TIERS.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={[styles.tierDot, { backgroundColor: tier.color }]} />
              <View style={styles.tierLevelInfo}>
                <Text style={[styles.tierLevelName, currentTier.name === tier.name && { color: Colors.primary }]}>
                  {tier.name}
                </Text>
                <Text style={styles.tierLevelRange}>{tier.min.toLocaleString()} - {tier.max === 99999 ? 'unlimited' : tier.max.toLocaleString()} pts</Text>
              </View>
              {currentTier.name === tier.name && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current</Text>
                </View>
              )}
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function StatBox({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <View style={styles.statBox}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TransactionItem({ tx, isLast }: { tx: any; isLast: boolean }) {
  const isEarned = tx.type === 'earned';
  return (
    <View style={[styles.txItem, !isLast && styles.txBorder]}>
      <View style={[styles.txIcon, { backgroundColor: isEarned ? Colors.success + '15' : Colors.error + '15' }]}>
        <Ionicons name={isEarned ? 'arrow-down' : 'arrow-up'} size={18} color={isEarned ? Colors.success : Colors.error} />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txDesc}>{tx.description}</Text>
        <Text style={styles.txDate}>
          {new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </Text>
      </View>
      <Text style={[styles.txPoints, { color: isEarned ? Colors.success : Colors.error }]}>
        {isEarned ? '+' : ''}{tx.points}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 24, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontFamily: 'Poppins_700Bold', color: Colors.text },
  tierCard: {
    marginHorizontal: 20, backgroundColor: '#FFF', borderRadius: 20, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, marginTop: 12,
  },
  tierHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  tierIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  tierInfo: {},
  tierName: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  totalPoints: { fontSize: 24, fontFamily: 'Poppins_700Bold', color: Colors.primary },
  progressSection: { gap: 8 },
  progressBar: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  nextTierText: { fontSize: 12, fontFamily: 'Poppins_500Medium', color: Colors.accent },
  statsRow: {
    flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginTop: 20,
  },
  statBox: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 14, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  statIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 18, fontFamily: 'Poppins_700Bold', color: Colors.text },
  statLabel: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text, marginBottom: 12, paddingHorizontal: 24, marginTop: 28 },
  emptyState: { alignItems: 'center', paddingVertical: 30, gap: 8, marginHorizontal: 24 },
  emptyText: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  txItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 24,
  },
  txBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  txIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  txInfo: { flex: 1 },
  txDesc: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text },
  txDate: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 2 },
  txPoints: { fontSize: 16, fontFamily: 'Poppins_700Bold' },
  tierLevels: { paddingBottom: 20 },
  tierLevel: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 24,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  tierDot: { width: 12, height: 12, borderRadius: 6, marginRight: 14 },
  tierLevelInfo: { flex: 1 },
  tierLevelName: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  tierLevelRange: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  currentBadge: {
    backgroundColor: Colors.primary + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  currentBadgeText: { fontSize: 11, fontFamily: 'Poppins_600SemiBold', color: Colors.primary },
});
