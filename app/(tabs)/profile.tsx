import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import Colors from '@/constants/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  function handleSignOut() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/');
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
        <View style={[styles.header, { paddingTop: insets.top + webTopInset + 12 }]}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.avatar || 'G'}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Guest'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
          <View style={styles.memberInfo}>
            <View style={styles.memberBadge}>
              <Ionicons name="shield-checkmark" size={14} color={Colors.accent} />
              <Text style={styles.memberBadgeText}>{user?.tier || 'Bronze'}</Text>
            </View>
            <Text style={styles.joinDate}>
              Member since {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'N/A'}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user?.totalPoints || 0}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxMiddle]}>
            <Text style={styles.statValue}>{user?.availableCredits || 0}</Text>
            <Text style={styles.statLabel}>Credits</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user?.tier || '-'}</Text>
            <Text style={styles.statLabel}>Tier</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.menuSection}>
          <MenuItem icon="receipt-outline" label="Order History" onPress={() => {}} />
          <MenuItem icon="bookmark-outline" label="Saved Items" onPress={() => {}} />
          <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
          <MenuItem icon="card-outline" label="Payment Methods" onPress={() => {}} />
          <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
          <MenuItem icon="document-text-outline" label="Terms & Conditions" onPress={() => {}} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <Pressable
            style={({ pressed }) => [styles.signOutButton, pressed && { opacity: 0.8 }]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function MenuItem({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: Colors.surface }]}
      onPress={onPress}
    >
      <Ionicons name={icon as any} size={22} color={Colors.textSecondary} />
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#CCC" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 24, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontFamily: 'Poppins_700Bold', color: Colors.text },
  profileCard: {
    alignItems: 'center', marginHorizontal: 20, backgroundColor: '#FFF', borderRadius: 20,
    padding: 24, marginTop: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  avatarText: { fontSize: 32, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  name: { fontSize: 22, fontFamily: 'Poppins_700Bold', color: Colors.text },
  email: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 2 },
  memberInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  memberBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.accent + '15',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  memberBadgeText: { fontSize: 12, fontFamily: 'Poppins_600SemiBold', color: Colors.accent },
  joinDate: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  statsRow: {
    flexDirection: 'row', marginHorizontal: 20, marginTop: 16, backgroundColor: '#FFF',
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statBoxMiddle: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: 18, fontFamily: 'Poppins_700Bold', color: Colors.primary },
  statLabel: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 2 },
  menuSection: {
    marginHorizontal: 20, marginTop: 24, backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: 'Poppins_500Medium', color: Colors.text, marginLeft: 14 },
  signOutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 20, marginTop: 24, paddingVertical: 16, borderRadius: 14,
    backgroundColor: Colors.error + '10',
  },
  signOutText: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.error },
});
