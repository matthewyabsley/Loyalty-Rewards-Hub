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

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();
  const { rewards, claimReward } = useData();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const activeRewards = rewards.filter(r => !r.claimed);
  const claimedRewards = rewards.filter(r => r.claimed);

  async function handleClaim(rewardId: string) {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    Alert.alert(
      'Claim Reward',
      'Show this QR code to your server to claim this reward.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark as Claimed', onPress: () => claimReward(rewardId) },
      ]
    );
  }

  function onViewableItemsChanged({ viewableItems }: any) {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 12 }]}>
        <Text style={styles.headerTitle}>My Rewards</Text>
        <Text style={styles.headerSubtitle}>
          {activeRewards.length} active reward{activeRewards.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {activeRewards.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="gift-outline" size={60} color="#DDD" />
          <Text style={styles.emptyTitle}>No rewards yet</Text>
          <Text style={styles.emptySubtitle}>Keep dining with us to earn rewards</Text>
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={activeRewards}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={styles.cardList}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
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
          <Text style={styles.claimedTitle}>Claimed</Text>
          {claimedRewards.map(reward => (
            <View key={reward.id} style={styles.claimedItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <View style={styles.claimedInfo}>
                <Text style={styles.claimedName}>{reward.title}</Text>
                <Text style={styles.claimedValue}>{reward.value}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

function RewardCard({ reward, onClaim }: { reward: any; onClaim: (id: string) => void }) {
  const typeConfig = {
    discount: { color: '#E8735A', bg: '#FEF0ED', icon: 'pricetag' as const },
    credit: { color: Colors.success, bg: '#E8F8F0', icon: 'wallet' as const },
    offer: { color: Colors.accent, bg: '#FFF8EB', icon: 'star' as const },
  };
  const config = typeConfig[reward.type as keyof typeof typeConfig] || typeConfig.offer;

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.card}>
      <View style={[styles.cardHeader, { backgroundColor: config.bg }]}>
        <View style={styles.cardHeaderContent}>
          <View style={[styles.typeBadge, { backgroundColor: config.color }]}>
            <Ionicons name={config.icon} size={14} color="#FFF" />
            <Text style={styles.typeBadgeText}>{reward.type}</Text>
          </View>
          <Text style={styles.cardValue}>{reward.value}</Text>
        </View>
        <Text style={styles.cardTitle}>{reward.title}</Text>
        <Text style={styles.cardDescription}>{reward.description}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.qrContainer}>
          <QRCode value={reward.code} size={140} color={Colors.text} backgroundColor="transparent" />
        </View>
        <Text style={styles.codeText}>{reward.code}</Text>
        <Text style={styles.expiryText}>
          Expires {new Date(reward.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.claimButton, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
        onPress={() => onClaim(reward.id)}
      >
        <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
        <Text style={styles.claimButtonText}>Claim Reward</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 24, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontFamily: 'Poppins_700Bold', color: Colors.text },
  headerSubtitle: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 2 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, paddingBottom: 100 },
  emptyTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.textSecondary },
  emptySubtitle: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: '#BBB' },
  cardList: { paddingHorizontal: 24, paddingTop: 8 },
  card: {
    width: CARD_WIDTH, marginRight: 16, backgroundColor: '#FFF', borderRadius: 24,
    overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },
  cardHeader: { padding: 20, paddingBottom: 16 },
  cardHeaderContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeBadgeText: { fontSize: 11, fontFamily: 'Poppins_600SemiBold', color: '#FFF', textTransform: 'capitalize' },
  cardValue: { fontSize: 22, fontFamily: 'Poppins_700Bold', color: Colors.text },
  cardTitle: { fontSize: 17, fontFamily: 'Poppins_600SemiBold', color: Colors.text, marginBottom: 4 },
  cardDescription: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, lineHeight: 18 },
  cardBody: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  qrContainer: {
    padding: 16, backgroundColor: '#F8F8F8', borderRadius: 16,
  },
  codeText: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary, letterSpacing: 1 },
  expiryText: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: '#AAA' },
  claimButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, margin: 16, marginTop: 0, paddingVertical: 14, borderRadius: 14,
  },
  claimButtonText: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
  pagination: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DDD' },
  dotActive: { backgroundColor: Colors.primary, width: 24 },
  claimedSection: { paddingHorizontal: 24, paddingBottom: 120 },
  claimedTitle: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: Colors.textSecondary, marginBottom: 10 },
  claimedItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  claimedInfo: { flex: 1 },
  claimedName: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  claimedValue: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: '#BBB' },
});
