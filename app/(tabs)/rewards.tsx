import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Pressable, Platform, FlatList, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '@/lib/data-context';
import Colors from '@/constants/colors';
import QRCode from 'react-native-qrcode-svg';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 56;

const TYPE_CONFIG = {
  discount: { gradient: ['#E8735A', '#D45A42'] as const, icon: 'pricetag' as const, label: 'Discount' },
  credit: { gradient: [Colors.success, '#18945A'] as const, icon: 'wallet' as const, label: 'Credit' },
  offer: { gradient: [Colors.accent, Colors.accentDark] as const, icon: 'star' as const, label: 'Offer' },
};

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();
  const { rewards, claimReward } = useData();
  const [activeIndex, setActiveIndex] = useState(0);
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const activeRewards = rewards.filter(r => !r.claimed);
  const claimedRewards = rewards.filter(r => r.claimed);

  async function handleClaim(rewardId: string) {
    try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    Alert.alert(
      'Claim Reward',
      'Show this QR code to your server to redeem.',
      [
        { text: 'Not Yet', style: 'cancel' },
        { text: 'Mark Claimed', onPress: () => claimReward(rewardId) },
      ]
    );
  }

  function onViewableItemsChanged({ viewableItems }: any) {
    if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index ?? 0);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16 }]}>
        <View>
          <Text style={styles.headerTitle}>Rewards</Text>
          <Text style={styles.headerCount}>
            {activeRewards.length} active{activeRewards.length === 1 ? '' : ''} reward{activeRewards.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {activeRewards.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="gift-outline" size={44} color={Colors.border} />
          </View>
          <Text style={styles.emptyTitle}>No rewards yet</Text>
          <Text style={styles.emptySubtitle}>Dine with us to unlock exclusive rewards</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={activeRewards}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={styles.cardList}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <RewardCard reward={item} onClaim={handleClaim} />}
          />
          <View style={styles.pagination}>
            {activeRewards.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
            ))}
          </View>
        </>
      )}

      {claimedRewards.length > 0 && (
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.claimedSection}>
          <Text style={styles.claimedHeader}>Redeemed</Text>
          {claimedRewards.map(reward => {
            const cfg = TYPE_CONFIG[reward.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.offer;
            return (
              <View key={reward.id} style={styles.claimedRow}>
                <View style={[styles.claimedIcon, { backgroundColor: cfg.gradient[0] + '15' }]}>
                  <Ionicons name={cfg.icon} size={16} color={cfg.gradient[0]} />
                </View>
                <View style={styles.claimedInfo}>
                  <Text style={styles.claimedName}>{reward.title}</Text>
                  <Text style={styles.claimedVal}>{reward.value}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              </View>
            );
          })}
        </Animated.View>
      )}
    </View>
  );
}

function RewardCard({ reward, onClaim }: { reward: any; onClaim: (id: string) => void }) {
  const cfg = TYPE_CONFIG[reward.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.offer;

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.card}>
      <LinearGradient
        colors={[cfg.gradient[0], cfg.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.6 }}
        style={styles.cardTop}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.typePill}>
            <Ionicons name={cfg.icon} size={13} color="#FFF" />
            <Text style={styles.typePillText}>{cfg.label}</Text>
          </View>
          <Text style={styles.cardValueBig}>{reward.value}</Text>
        </View>
        <Text style={styles.cardTitle}>{reward.title}</Text>
        <Text style={styles.cardDesc}>{reward.description}</Text>
      </LinearGradient>

      <View style={styles.cardBottom}>
        <View style={styles.qrSection}>
          <View style={styles.qrBox}>
            <QRCode value={reward.code} size={120} color="#1A1A1A" backgroundColor="transparent" />
          </View>
          <Text style={styles.codeLabel}>{reward.code}</Text>
          <Text style={styles.expiryLabel}>
            Expires {new Date(reward.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.claimBtn, pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 }]}
          onPress={() => onClaim(reward.id)}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFF" />
          <Text style={styles.claimBtnText}>Claim</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 24, paddingBottom: 12 },
  headerTitle: { fontSize: 30, fontFamily: 'Poppins_700Bold', color: Colors.text },
  headerCount: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: -2 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14, paddingBottom: 120 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.surface,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  emptyTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  emptySubtitle: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },

  cardList: { paddingHorizontal: 28, paddingTop: 12 },
  card: {
    width: CARD_WIDTH, marginRight: 16, backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 6,
  },
  cardTop: { padding: 22, paddingBottom: 18 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  typePillText: { fontSize: 12, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
  cardValueBig: { fontSize: 26, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  cardTitle: { fontSize: 17, fontFamily: 'Poppins_600SemiBold', color: '#FFF', marginBottom: 4 },
  cardDesc: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.8)', lineHeight: 18 },

  cardBottom: { alignItems: 'center', padding: 22, gap: 16 },
  qrSection: { alignItems: 'center', gap: 10 },
  qrBox: { padding: 14, backgroundColor: '#F8F7F4', borderRadius: 18 },
  codeLabel: { fontSize: 12, fontFamily: 'Poppins_600SemiBold', color: Colors.textSecondary, letterSpacing: 1.2 },
  expiryLabel: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: '#B5B5B5' },
  claimBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#1A1A1A', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 16, width: '100%',
  },
  claimBtnText: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },

  pagination: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 18 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.primary, width: 28, borderRadius: 14 },

  claimedSection: { paddingHorizontal: 24, paddingBottom: 120 },
  claimedHeader: { fontSize: 17, fontFamily: 'Poppins_700Bold', color: Colors.textSecondary, marginBottom: 12 },
  claimedRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  claimedIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  claimedInfo: { flex: 1 },
  claimedName: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text },
  claimedVal: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
});
