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
import * as Haptics from 'expo-haptics';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { cart, cartTotal, updateCartQuantity, removeFromCart, clearCart, addTransaction } = useData();
  const { updatePoints } = useAuth();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const pointsToEarn = Math.floor(cartTotal);

  async function handlePlaceOrder() {
    if (cart.length === 0) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    const orderDescription = cart.map(c => `${c.quantity}x ${c.item.name}`).join(', ');

    await updatePoints(pointsToEarn);
    await addTransaction({
      description: `Order: ${orderDescription.substring(0, 40)}${orderDescription.length > 40 ? '...' : ''}`,
      points: pointsToEarn,
      date: new Date().toISOString().split('T')[0],
      type: 'earned',
    });
    clearCart();
    Alert.alert(
      'Order Placed!',
      `Your order has been sent to the kitchen. You earned ${pointsToEarn} points!`,
      [{ text: 'Great!', onPress: () => router.back() }]
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topBarTitle}>Your Order</Text>
        {cart.length > 0 ? (
          <Pressable onPress={() => { clearCart(); router.back(); }}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        ) : <View style={{ width: 40 }} />}
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bag-outline" size={60} color="#DDD" />
          <Text style={styles.emptyTitle}>Your bag is empty</Text>
          <Text style={styles.emptySubtitle}>Add items from the menu to get started</Text>
          <Pressable
            style={({ pressed }) => [styles.browseButton, pressed && { opacity: 0.8 }]}
            onPress={() => router.back()}
          >
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cartContent}>
            {cart.map(cartItem => (
              <View key={cartItem.item.id} style={styles.cartCard}>
                <View style={styles.cartCardInfo}>
                  <Text style={styles.cartItemName}>{cartItem.item.name}</Text>
                  <Text style={styles.cartItemPrice}>{'\u00A3'}{(cartItem.item.price * cartItem.quantity).toFixed(2)}</Text>
                </View>
                <View style={styles.quantityRow}>
                  <Pressable
                    style={styles.qtyButton}
                    onPress={() => updateCartQuantity(cartItem.item.id, cartItem.quantity - 1)}
                  >
                    <Ionicons name={cartItem.quantity === 1 ? 'trash-outline' : 'remove'} size={18} color={cartItem.quantity === 1 ? Colors.error : Colors.text} />
                  </Pressable>
                  <Text style={styles.qtyText}>{cartItem.quantity}</Text>
                  <Pressable
                    style={styles.qtyButton}
                    onPress={() => updateCartQuantity(cartItem.item.id, cartItem.quantity + 1)}
                  >
                    <Ionicons name="add" size={18} color={Colors.text} />
                  </Pressable>
                </View>
              </View>
            ))}

            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{'\u00A3'}{cartTotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service Charge</Text>
                <Text style={styles.summaryValue}>{'\u00A3'}{(cartTotal * 0.1).toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{'\u00A3'}{(cartTotal * 1.1).toFixed(2)}</Text>
              </View>
              <View style={styles.pointsEarn}>
                <Ionicons name="star" size={14} color={Colors.accent} />
                <Text style={styles.pointsEarnText}>You'll earn {pointsToEarn} points with this order</Text>
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 12 }]}>
            <Pressable
              style={({ pressed }) => [styles.orderButton, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
              onPress={handlePlaceOrder}
            >
              <Text style={styles.orderButtonText}>Place Order - {'\u00A3'}{(cartTotal * 1.1).toFixed(2)}</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topBarTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  clearText: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.error },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, paddingBottom: 60 },
  emptyTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.textSecondary },
  emptySubtitle: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: '#BBB' },
  browseButton: {
    backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8,
  },
  browseButtonText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
  cartContent: { padding: 20, paddingBottom: 140, gap: 12 },
  cartCard: {
    backgroundColor: '#FFF', borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  cartCardInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cartItemName: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.text, flex: 1 },
  cartItemPrice: { fontSize: 15, fontFamily: 'Poppins_700Bold', color: Colors.primary },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyButton: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.surface,
    justifyContent: 'center', alignItems: 'center',
  },
  qtyText: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: Colors.text, minWidth: 24, textAlign: 'center' },
  summarySection: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 18, gap: 12, marginTop: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  summaryValue: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  totalValue: { fontSize: 18, fontFamily: 'Poppins_700Bold', color: Colors.primary },
  pointsEarn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.accent + '15',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
  },
  pointsEarnText: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.accentDark },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingTop: 12, backgroundColor: '#FFF',
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  orderButton: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  orderButtonText: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
});
