import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '@/lib/data-context';
import { useAuth } from '@/lib/auth-context';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { cart, cartTotal, updateCartQuantity, clearCart, addTransaction, tableNumber } = useData();
  const { updatePoints } = useAuth();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const pointsToEarn = Math.floor(cartTotal);

  async function handlePlaceOrder() {
    if (cart.length === 0) return;
    try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    const desc = cart.map(c => `${c.quantity}x ${c.item.name}`).join(', ');
    await updatePoints(pointsToEarn);
    await addTransaction({
      description: `Order: ${desc.substring(0, 40)}${desc.length > 40 ? '...' : ''}`,
      points: pointsToEarn,
      date: new Date().toISOString().split('T')[0],
      type: 'earned',
    });
    clearCart();
    const tableMsg = tableNumber ? `\nTable ${tableNumber}` : '';
    Alert.alert('Order Placed!', `Sent to kitchen.${tableMsg}\n\nYou earned ${pointsToEarn} points!`, [{ text: 'Done', onPress: () => router.back() }]);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Your Order</Text>
        {cart.length > 0 ? (
          <Pressable onPress={() => { clearCart(); router.back(); }}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        ) : <View style={{ width: 40 }} />}
      </View>

      {tableNumber && cart.length > 0 && (
        <View style={styles.tablePill}>
          <Ionicons name="tablet-landscape-outline" size={14} color={Colors.primary} />
          <Text style={styles.tablePillText}>Table {tableNumber}</Text>
        </View>
      )}

      {cart.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="bag-outline" size={44} color={Colors.border} />
          </View>
          <Text style={styles.emptyTitle}>No items yet</Text>
          <Text style={styles.emptySubtitle}>Add items from the menu</Text>
          <Pressable onPress={() => router.back()}>
            <LinearGradient colors={['#1A1A1A', '#2D2D2D']} style={styles.browseBtn}>
              <Text style={styles.browseBtnText}>Browse Menu</Text>
            </LinearGradient>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cartContent}>
            {cart.map(ci => {
              const optionsPrice = ci.selectedOptions
                ? Object.values(ci.selectedOptions).reduce((s, o) => s + o.price, 0)
                : 0;
              const itemTotal = (ci.item.price + optionsPrice) * ci.quantity;
              const optionsList = ci.selectedOptions ? Object.values(ci.selectedOptions) : [];
              return (
                <View key={ci.cartId} style={styles.cartItem}>
                  <View style={styles.cartItemTop}>
                    <Text style={styles.cartItemName}>{ci.item.name}</Text>
                    <Text style={styles.cartItemPrice}>{'\u00A3'}{itemTotal.toFixed(2)}</Text>
                  </View>
                  {optionsList.length > 0 && (
                    <View style={styles.cartOptionsRow}>
                      {optionsList.map((opt, idx) => (
                        <Text key={idx} style={styles.cartOptionText}>
                          {opt.name}{opt.price > 0 ? ` (+\u00A3${opt.price.toFixed(2)})` : ''}
                        </Text>
                      ))}
                    </View>
                  )}
                  {ci.notes ? (
                    <View style={styles.cartNoteRow}>
                      <Ionicons name="chatbubble-outline" size={12} color={Colors.textSecondary} />
                      <Text style={styles.cartNoteText} numberOfLines={1}>{ci.notes}</Text>
                    </View>
                  ) : null}
                  <View style={styles.qtyRow}>
                    <Pressable
                      style={({ pressed }) => [styles.qtyBtn, pressed && { opacity: 0.7 }]}
                      onPress={() => updateCartQuantity(ci.cartId, ci.quantity - 1)}
                    >
                      <Ionicons name={ci.quantity === 1 ? 'trash-outline' : 'remove'} size={16} color={ci.quantity === 1 ? Colors.error : Colors.text} />
                    </Pressable>
                    <Text style={styles.qtyVal}>{ci.quantity}</Text>
                    <Pressable
                      style={({ pressed }) => [styles.qtyBtn, pressed && { opacity: 0.7 }]}
                      onPress={() => updateCartQuantity(ci.cartId, ci.quantity + 1)}
                    >
                      <Ionicons name="add" size={16} color={Colors.text} />
                    </Pressable>
                  </View>
                </View>
              );
            })}

            <View style={styles.summaryCard}>
              <SummaryLine label="Subtotal" value={`\u00A3${cartTotal.toFixed(2)}`} />
              <SummaryLine label="Service (10%)" value={`\u00A3${(cartTotal * 0.1).toFixed(2)}`} />
              <View style={styles.totalLine}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{'\u00A3'}{(cartTotal * 1.1).toFixed(2)}</Text>
              </View>
              <View style={styles.pointsPill}>
                <Ionicons name="star" size={14} color={Colors.accent} />
                <Text style={styles.pointsPillText}>Earn {pointsToEarn} points</Text>
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 14 }]}>
            <Pressable
              style={({ pressed }) => [pressed && { transform: [{ scale: 0.98 }] }]}
              onPress={handlePlaceOrder}
            >
              <LinearGradient colors={['#1A1A1A', '#2D2D2D']} style={styles.orderBtn}>
                <Text style={styles.orderBtnText}>Place Order  -  {'\u00A3'}{(cartTotal * 1.1).toFixed(2)}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryLine}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 14,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  clearText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: Colors.error },

  tablePill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, marginBottom: 10,
    backgroundColor: Colors.primary + '0A', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.primary + '18',
    alignSelf: 'flex-start',
  },
  tablePillText: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: Colors.primary },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14, paddingBottom: 80 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.surface,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  emptyTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  emptySubtitle: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  browseBtn: { borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14, marginTop: 4 },
  browseBtnText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },

  cartContent: { padding: 20, paddingBottom: 150, gap: 12 },
  cartItem: {
    backgroundColor: '#FFF', borderRadius: 18, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cartItemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cartItemName: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.text, flex: 1 },
  cartItemPrice: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: Colors.text },
  cartOptionsRow: { marginBottom: 8, gap: 2 },
  cartOptionText: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  cartNoteRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  cartNoteText: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, fontStyle: 'italic' as const, flex: 1 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  qtyBtn: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.surface,
    justifyContent: 'center', alignItems: 'center',
  },
  qtyVal: { fontSize: 17, fontFamily: 'Poppins_700Bold', color: Colors.text, minWidth: 28, textAlign: 'center' },

  summaryCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 20, gap: 14, marginTop: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  summaryValue: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text },
  totalLine: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 14,
  },
  totalLabel: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  totalValue: { fontSize: 20, fontFamily: 'Poppins_700Bold', color: Colors.text },
  pointsPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.accent + '12',
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
  },
  pointsPillText: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: Colors.accentDark },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingTop: 14, backgroundColor: Colors.background,
  },
  orderBtn: { borderRadius: 18, paddingVertical: 18, alignItems: 'center' },
  orderBtnText: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#FFF' },
});
