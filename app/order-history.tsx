import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useData, Order } from '@/lib/data-context';
import Colors from '@/constants/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const STATUS_CONFIG = {
  completed: { color: Colors.success, icon: 'checkmark-circle' as const, label: 'Completed' },
  preparing: { color: Colors.warning, icon: 'time' as const, label: 'Preparing' },
  delivered: { color: Colors.primary, icon: 'restaurant' as const, label: 'Delivered' },
  cancelled: { color: Colors.error, icon: 'close-circle' as const, label: 'Cancelled' },
};

export default function OrderHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { orders, menu, addToCart, clearCart } = useData();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  function handleOrderAgain(order: Order) {
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    clearCart();
    let addedCount = 0;
    for (const orderItem of order.items) {
      const menuItem = menu.find(m => m.name === orderItem.name);
      if (menuItem) {
        for (let i = 0; i < orderItem.quantity; i++) {
          addToCart(menuItem);
          addedCount++;
        }
      }
    }
    if (addedCount > 0) {
      Alert.alert(
        'Items Added',
        `${addedCount} item${addedCount > 1 ? 's' : ''} added to your cart from your previous order.`,
        [{ text: 'View Menu', onPress: () => router.push('/menu') }]
      );
    } else {
      router.push('/menu');
    }
  }

  async function handleForwardReceipt(order: typeof orders[0]) {
    const itemsText = order.items
      .map((item) => `- ${item.quantity}x ${item.name} - £${item.price.toFixed(2)}`)
      .join('\n');

    const receiptText = `Dine & Earn Receipt\nDate: ${formatDate(order.date)}\nTable: ${order.tableNumber}\n\nItems:\n${itemsText}\n\nTotal: £${order.total.toFixed(2)}`;

    try {
      await Share.share({ message: receiptText });
    } catch (_) {}
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {orders.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(500)} style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptyText}>Your order history will appear here</Text>
          </Animated.View>
        ) : (
          orders.map((order, index) => {
            const status = STATUS_CONFIG[order.status];
            return (
              <Animated.View
                key={order.id}
                entering={FadeInDown.delay(index * 60).duration(400)}
                style={styles.orderCard}
              >
                <View style={styles.orderHeader}>
                  <View style={styles.orderMeta}>
                    <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
                    <Text style={styles.orderTime}>{formatTime(order.date)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: status.color + '15' }]}>
                    <Ionicons name={status.icon} size={13} color={status.color} />
                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                  </View>
                </View>

                <View style={styles.tableTag}>
                  <Ionicons name="restaurant-outline" size={12} color={Colors.textSecondary} />
                  <Text style={styles.tableText}>Table {order.tableNumber}</Text>
                </View>

                <View style={styles.divider} />

                {order.items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <View style={styles.qtyBadge}>
                      <Text style={styles.qtyText}>{item.quantity}x</Text>
                    </View>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {item.options && item.options.length > 0 && (
                        <Text style={styles.itemOptions}>{item.options.join(' · ')}</Text>
                      )}
                    </View>
                    <Text style={styles.itemPrice}>£{item.price.toFixed(2)}</Text>
                  </View>
                ))}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>£{order.total.toFixed(2)}</Text>
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.primaryButton}
                    onPress={() => handleOrderAgain(order)}
                  >
                    <Ionicons name="refresh" size={15} color="#FFF" />
                    <Text style={styles.primaryButtonText}>Order Again</Text>
                  </Pressable>
                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => handleForwardReceipt(order)}
                  >
                    <Ionicons name="mail-outline" size={15} color={Colors.primary} />
                    <Text style={styles.secondaryButtonText}>Forward Receipt</Text>
                  </Pressable>
                </View>
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

  emptyState: { alignItems: 'center', paddingTop: 100, gap: 12 },
  emptyTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  emptyText: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },

  orderCard: {
    marginHorizontal: 20, marginBottom: 16, backgroundColor: '#FFF', borderRadius: 18,
    padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderMeta: {},
  orderDate: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  orderTime: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 1 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  statusText: { fontSize: 11, fontFamily: 'Poppins_600SemiBold' },

  tableTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8,
  },
  tableText: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 14 },

  itemRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  qtyBadge: {
    width: 28, height: 24, borderRadius: 6, backgroundColor: Colors.surface,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  qtyText: { fontSize: 12, fontFamily: 'Poppins_600SemiBold', color: Colors.primary },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text },
  itemOptions: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 2 },
  itemPrice: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: Colors.text, marginLeft: 8 },

  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 6, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  totalLabel: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.textSecondary },
  totalValue: { fontSize: 18, fontFamily: 'Poppins_700Bold', color: Colors.primary },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 11,
    borderRadius: 12,
  },
  primaryButtonText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFF',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'transparent',
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.primary,
  },
});
