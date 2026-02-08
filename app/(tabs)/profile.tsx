import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { LinearGradient } from 'expo-linear-gradient';
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
        { text: 'Sign Out', style: 'destructive', onPress: async () => { await signOut(); router.replace('/'); } },
      ]
    );
  }

  const menuGroups = [
    [
      { icon: 'receipt-outline', label: 'Order History' },
      { icon: 'bookmark-outline', label: 'Saved Items' },
      { icon: 'card-outline', label: 'Payment Methods' },
    ],
    [
      { icon: 'notifications-outline', label: 'Notifications' },
      { icon: 'help-circle-outline', label: 'Help & Support' },
      { icon: 'document-text-outline', label: 'Terms & Privacy' },
    ],
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={[styles.header, { paddingTop: insets.top + webTopInset + 16 }]}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(80).duration(500)} style={styles.profileSection}>
          <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{user?.avatar || 'G'}</Text>
          </LinearGradient>
          <Text style={styles.name}>{user?.name || 'Guest'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Ionicons name="diamond" size={13} color={Colors.accent} />
              <Text style={styles.badgeText}>{user?.tier || 'Bronze'}</Text>
            </View>
            <View style={styles.badgeDot} />
            <Text style={styles.joinText}>
              Since {user?.joinedDate
                ? new Date(user.joinedDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
                : 'N/A'}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(500)} style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{user?.totalPoints || 0}</Text>
            <Text style={styles.statLbl}>Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{user?.availableCredits || 0}</Text>
            <Text style={styles.statLbl}>Credits</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{user?.tier || '-'}</Text>
            <Text style={styles.statLbl}>Tier</Text>
          </View>
        </Animated.View>

        {menuGroups.map((group, gi) => (
          <Animated.View key={gi} entering={FadeInDown.delay(240 + gi * 80).duration(500)} style={styles.menuGroup}>
            {group.map((item, i) => (
              <Pressable
                key={item.label}
                style={({ pressed }) => [
                  styles.menuRow,
                  i < group.length - 1 && styles.menuRowBorder,
                  pressed && { backgroundColor: Colors.surface },
                ]}
                onPress={() => {}}
              >
                <View style={styles.menuIconWrap}>
                  <Ionicons name={item.icon as any} size={20} color={Colors.text} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={17} color={Colors.border} />
              </Pressable>
            ))}
          </Animated.View>
        ))}

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Pressable
            style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.8 }]}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 24, paddingBottom: 4 },
  headerTitle: { fontSize: 30, fontFamily: 'Poppins_700Bold', color: Colors.text },

  profileSection: { alignItems: 'center', paddingVertical: 20 },
  avatarLarge: {
    width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  avatarLargeText: { fontSize: 36, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  name: { fontSize: 24, fontFamily: 'Poppins_700Bold', color: Colors.text },
  email: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 2 },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.accent + '15', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  badgeText: { fontSize: 12, fontFamily: 'Poppins_600SemiBold', color: Colors.accentDark },
  badgeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  joinText: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },

  statsBar: {
    flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#FFF', borderRadius: 18,
    paddingVertical: 18, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 20, fontFamily: 'Poppins_700Bold', color: Colors.primary },
  statLbl: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 3 },
  statDivider: { width: 1, height: 36, backgroundColor: Colors.border },

  menuGroup: {
    marginHorizontal: 20, marginBottom: 16, backgroundColor: '#FFF', borderRadius: 18, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18 },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIconWrap: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.surface,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: 'Poppins_500Medium', color: Colors.text },

  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 20, marginTop: 8, paddingVertical: 16, borderRadius: 18,
    backgroundColor: Colors.error + '08', borderWidth: 1, borderColor: Colors.error + '20',
  },
  signOutText: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.error },
});
