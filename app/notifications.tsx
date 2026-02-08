import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useData } from '@/lib/data-context';
import Colors from '@/constants/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';

const NOTIF_ICONS: Record<string, { icon: string; color: string }> = {
  order: { icon: 'receipt', color: Colors.primary },
  reward: { icon: 'diamond', color: Colors.accent },
  promo: { icon: 'megaphone', color: '#8B5CF6' },
  booking: { icon: 'calendar', color: Colors.success },
  system: { icon: 'settings', color: Colors.textSecondary },
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const unreadCount = notifications.filter(n => !n.read).length;

  function formatRelative(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <Pressable onPress={markAllNotificationsRead} hitSlop={12}>
            <Ionicons name="checkmark-done" size={22} color={Colors.primary} />
          </Pressable>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      {unreadCount > 0 && (
        <Animated.View entering={FadeInDown.duration(300)} style={styles.unreadBar}>
          <Text style={styles.unreadText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
        </Animated.View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {notifications.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(500)} style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyTitle}>All Caught Up</Text>
            <Text style={styles.emptyText}>No notifications at the moment</Text>
          </Animated.View>
        ) : (
          notifications.map((notif, index) => {
            const config = NOTIF_ICONS[notif.type] || NOTIF_ICONS.system;
            return (
              <Animated.View
                key={notif.id}
                entering={FadeInDown.delay(index * 40).duration(400)}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.notifItem,
                    !notif.read && styles.notifUnread,
                    pressed && { opacity: 0.9 },
                  ]}
                  onPress={() => markNotificationRead(notif.id)}
                >
                  <View style={[styles.notifIconWrap, { backgroundColor: config.color + '12' }]}>
                    <Ionicons name={config.icon as any} size={20} color={config.color} />
                  </View>
                  <View style={styles.notifContent}>
                    <View style={styles.notifHeaderRow}>
                      <Text style={[styles.notifTitle, !notif.read && styles.notifTitleUnread]}>
                        {notif.title}
                      </Text>
                      {!notif.read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notifMessage} numberOfLines={2}>{notif.message}</Text>
                    <Text style={styles.notifTime}>{formatRelative(notif.date)}</Text>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 16,
  },
  headerTitle: { fontSize: 20, fontFamily: 'Poppins_700Bold', color: Colors.text },

  unreadBar: {
    marginHorizontal: 20, marginBottom: 12, paddingVertical: 10, paddingHorizontal: 16,
    backgroundColor: Colors.primary + '10', borderRadius: 12,
  },
  unreadText: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.primary, textAlign: 'center' },

  emptyState: { alignItems: 'center', paddingTop: 100, gap: 12 },
  emptyTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  emptyText: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },

  notifItem: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginHorizontal: 20, marginBottom: 8, backgroundColor: '#FFF', borderRadius: 16,
    padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  notifUnread: { borderColor: Colors.primary + '15', backgroundColor: '#FFFBF7' },
  notifIconWrap: {
    width: 42, height: 42, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 14, marginTop: 2,
  },
  notifContent: { flex: 1 },
  notifHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifTitle: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text, flex: 1 },
  notifTitleUnread: { fontFamily: 'Poppins_600SemiBold' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginLeft: 8 },
  notifMessage: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 4, lineHeight: 18 },
  notifTime: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: Colors.border, marginTop: 6 },
});
