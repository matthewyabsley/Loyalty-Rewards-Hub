import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Platform, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import { useData } from '@/lib/data-context';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const TIERS = [
  { name: 'Bronze', min: 0, max: 499, color: '#CD7F32', icon: 'shield' as const },
  { name: 'Silver', min: 500, max: 1999, color: '#A8A8A8', icon: 'shield-half' as const },
  { name: 'Gold', min: 2000, max: 4999, color: Colors.accent, icon: 'shield-checkmark' as const },
  { name: 'Platinum', min: 5000, max: 99999, color: '#B0B0B8', icon: 'diamond' as const },
];

export default function PointsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { transactions } = useData();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const points = user?.totalPoints || 0;

  const currentTier = TIERS.find(t => points >= t.min && points <= t.max) || TIERS[0];
  const currentIndex = TIERS.indexOf(currentTier);
  const nextTier = TIERS[currentIndex + 1];
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
        <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16 }]}>
          <Text style={styles.headerTitle}>Points</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <LinearGradient
            colors={['#1A1A1A', '#2D2D2D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tierCard}
          >
            <View style={styles.tierTop}>
              <View style={[styles.tierIconCircle, { borderColor: currentTier.color }]}>
                <Ionicons name={currentTier.icon} size={30} color={currentTier.color} />
              </View>
              <View style={styles.tierTopInfo}>
                <Text style={styles.tierLabel}>{currentTier.name} Member</Text>
                <Text style={styles.tierPoints}>{points.toLocaleString()}</Text>
                <Text style={styles.tierPointsUnit}>total points</Text>
              </View>
            </View>

            {nextTier && (
              <View style={styles.progressWrap}>
                <View style={styles.progressTrack}>
                  <LinearGradient
                    colors={[currentTier.color, nextTier.color]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${Math.max(Math.min(progress * 100, 100), 4)}%` }]}
                  />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressCurrent}>{currentTier.name}</Text>
                  <Text style={styles.progressNext}>{nextTier.min - points} pts to {nextTier.name}</Text>
                </View>
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(500)} style={styles.statsRow}>
          <StatCard label="This Month" value="+85" icon="trending-up" color={Colors.success} />
          <StatCard label="Lifetime" value={points.toString()} icon="star" color={Colors.accent} />
          <StatCard label="Redeemed" value="40" icon="gift" color={Colors.primary} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>History</Text>
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={36} color={Colors.border} />
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            <View style={styles.txList}>
              {transactions.map((tx, i) => (
                <TxRow key={tx.id} tx={tx} isLast={i === transactions.length - 1} />
              ))}
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(320).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Tier Levels</Text>
          <View style={styles.tiersList}>
            {TIERS.map((tier, i) => {
              const isCurrent = currentTier.name === tier.name;
              const isReached = currentIndex >= i;
              return (
                <View key={tier.name} style={[styles.tierRow, i < TIERS.length - 1 && styles.tierRowBorder]}>
                  <View style={[
                    styles.tierRowDot,
                    { backgroundColor: isReached ? tier.color : Colors.border },
                  ]}>
                    {isCurrent && <View style={[styles.tierRowDotInner, { backgroundColor: tier.color }]} />}
                  </View>
                  <View style={styles.tierRowInfo}>
                    <Text style={[styles.tierRowName, isCurrent && { color: Colors.primary, fontFamily: 'Poppins_700Bold' }]}>
                      {tier.name}
                    </Text>
                    <Text style={styles.tierRowRange}>
                      {tier.min.toLocaleString()}{tier.max < 99999 ? ` - ${tier.max.toLocaleString()}` : '+'} pts
                    </Text>
                  </View>
                  {isCurrent && (
                    <View style={styles.currentTag}>
                      <Text style={styles.currentTagText}>You</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: color + '12' }]}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function TxRow({ tx, isLast }: { tx: any; isLast: boolean }) {
  const isEarned = tx.type === 'earned';
  return (
    <View style={[styles.txRow, !isLast && styles.txRowBorder]}>
      <View style={[styles.txIcon, { backgroundColor: isEarned ? Colors.success + '12' : Colors.error + '12' }]}>
        <Ionicons name={isEarned ? 'arrow-down' : 'arrow-up'} size={17} color={isEarned ? Colors.success : Colors.error} />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txDesc}>{tx.description}</Text>
        <Text style={styles.txDate}>
          {new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </Text>
      </View>
      <Text style={[styles.txPts, { color: isEarned ? Colors.success : Colors.error }]}>
        {isEarned ? '+' : ''}{tx.points}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 24, paddingBottom: 8 },
  headerTitle: { fontSize: 30, fontFamily: 'Poppins_700Bold', color: Colors.text },

  tierCard: { marginHorizontal: 20, borderRadius: 24, padding: 24, marginTop: 12 },
  tierTop: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  tierIconCircle: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 2.5,
    justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)',
  },
  tierTopInfo: {},
  tierLabel: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: 'rgba(255,255,255,0.5)' },
  tierPoints: { fontSize: 34, fontFamily: 'Poppins_700Bold', color: '#FFF', lineHeight: 40 },
  tierPointsUnit: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.35)', marginTop: -4 },
  progressWrap: { marginTop: 22, gap: 8 },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressCurrent: { fontSize: 11, fontFamily: 'Poppins_500Medium', color: 'rgba(255,255,255,0.35)' },
  progressNext: { fontSize: 11, fontFamily: 'Poppins_600SemiBold', color: Colors.accent },

  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginTop: 20 },
  statCard: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 18, padding: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  statIconWrap: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { fontSize: 20, fontFamily: 'Poppins_700Bold', color: Colors.text },
  statLabel: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 3 },

  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionTitle: { fontSize: 19, fontFamily: 'Poppins_700Bold', color: Colors.text, marginBottom: 14 },
  emptyState: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  emptyText: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },

  txList: {
    backgroundColor: '#FFF', borderRadius: 18, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  txRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  txRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  txIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  txInfo: { flex: 1 },
  txDesc: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text },
  txDate: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 2 },
  txPts: { fontSize: 17, fontFamily: 'Poppins_700Bold' },

  tiersList: {
    backgroundColor: '#FFF', borderRadius: 18, overflow: 'hidden', paddingVertical: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  tierRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18 },
  tierRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  tierRowDot: {
    width: 16, height: 16, borderRadius: 8, marginRight: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  tierRowDotInner: { width: 7, height: 7, borderRadius: 4 },
  tierRowInfo: { flex: 1 },
  tierRowName: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  tierRowRange: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  currentTag: {
    backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10,
  },
  currentTagText: { fontSize: 11, fontFamily: 'Poppins_700Bold', color: '#FFF' },
});
