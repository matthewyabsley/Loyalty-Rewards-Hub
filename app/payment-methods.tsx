import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useData, PaymentMethod } from '@/lib/data-context';
import Colors from '@/constants/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';

const CARD_ICONS: Record<string, { icon: string; color: string; label: string }> = {
  visa: { icon: 'card', label: 'Visa', color: '#1A1F71' },
  mastercard: { icon: 'card', label: 'Mastercard', color: '#EB001B' },
  amex: { icon: 'card', label: 'Amex', color: '#006FCF' },
  apple_pay: { icon: 'logo-apple', label: 'Apple Pay', color: '#000' },
};

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const { paymentMethods, removePaymentMethod, setDefaultPayment, addPaymentMethod } = useData();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const [showAdd, setShowAdd] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [name, setName] = useState('');

  function handleRemove(method: PaymentMethod) {
    Alert.alert(
      'Remove Card',
      `Remove ${CARD_ICONS[method.type]?.label || 'card'} ending in ${method.last4}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removePaymentMethod(method.id) },
      ]
    );
  }

  function handleAdd() {
    if (cardNumber.length < 4 || !expiry || !name) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }
    addPaymentMethod({
      type: 'visa',
      last4: cardNumber.slice(-4),
      expiryDate: expiry,
      isDefault: paymentMethods.length === 0,
      cardholderName: name,
    });
    setCardNumber('');
    setExpiry('');
    setName('');
    setShowAdd(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <Pressable onPress={() => setShowAdd(!showAdd)} hitSlop={12}>
          <Ionicons name={showAdd ? 'close' : 'add'} size={24} color={Colors.primary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {showAdd && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.addForm}>
            <Text style={styles.formTitle}>Add New Card</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={Colors.border}
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="number-pad"
                maxLength={19}
              />
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Expiry</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor={Colors.border}
                  value={expiry}
                  onChangeText={setExpiry}
                  maxLength={5}
                />
              </View>
              <View style={{ width: 14 }} />
              <View style={[styles.inputGroup, { flex: 1.5 }]}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name on card"
                  placeholderTextColor={Colors.border}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>
            <Pressable
              style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.8 }]}
              onPress={handleAdd}
            >
              <Text style={styles.addBtnText}>Add Card</Text>
            </Pressable>
          </Animated.View>
        )}

        {paymentMethods.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(500)} style={styles.emptyState}>
            <Ionicons name="card-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyTitle}>No Payment Methods</Text>
            <Text style={styles.emptyText}>Add a card to speed up checkout</Text>
          </Animated.View>
        ) : (
          paymentMethods.map((method, index) => {
            const config = CARD_ICONS[method.type] || CARD_ICONS.visa;
            return (
              <Animated.View
                key={method.id}
                entering={FadeInDown.delay(index * 60).duration(400)}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.cardItem,
                    method.isDefault && styles.cardDefault,
                    pressed && { opacity: 0.9 },
                  ]}
                  onPress={() => setDefaultPayment(method.id)}
                >
                  <View style={[styles.cardIconWrap, { backgroundColor: config.color + '12' }]}>
                    <Ionicons name={config.icon as any} size={22} color={config.color} />
                  </View>
                  <View style={styles.cardDetails}>
                    <View style={styles.cardNameRow}>
                      <Text style={styles.cardType}>{config.label}</Text>
                      {method.isDefault && (
                        <View style={styles.defaultTag}>
                          <Text style={styles.defaultText}>Default</Text>
                        </View>
                      )}
                    </View>
                    {method.last4 ? (
                      <Text style={styles.cardNumber}>
                        {'····  ····  ····  '}{method.last4}
                      </Text>
                    ) : (
                      <Text style={styles.cardNumber}>{method.cardholderName}</Text>
                    )}
                    {method.expiryDate ? (
                      <Text style={styles.cardExpiry}>Expires {method.expiryDate}</Text>
                    ) : null}
                  </View>
                  <Pressable onPress={() => handleRemove(method)} hitSlop={12} style={styles.removeBtn}>
                    <Ionicons name="trash-outline" size={18} color={Colors.error} />
                  </Pressable>
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

  emptyState: { alignItems: 'center', paddingTop: 100, gap: 12 },
  emptyTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  emptyText: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },

  addForm: {
    marginHorizontal: 20, marginBottom: 20, backgroundColor: '#FFF', borderRadius: 18,
    padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  formTitle: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: Colors.text, marginBottom: 16 },
  inputGroup: { marginBottom: 14 },
  inputLabel: { fontSize: 12, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary, marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 15, fontFamily: 'Poppins_400Regular', color: Colors.text,
    backgroundColor: Colors.surface,
  },
  inputRow: { flexDirection: 'row' },
  addBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', marginTop: 4,
  },
  addBtnText: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },

  cardItem: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 12, backgroundColor: '#FFF', borderRadius: 18,
    padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  cardDefault: { borderColor: Colors.primary + '30' },
  cardIconWrap: {
    width: 48, height: 48, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  cardDetails: { flex: 1 },
  cardNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardType: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  defaultTag: {
    backgroundColor: Colors.primary + '15', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  defaultText: { fontSize: 10, fontFamily: 'Poppins_600SemiBold', color: Colors.primary },
  cardNumber: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 3, letterSpacing: 1 },
  cardExpiry: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 2 },
  removeBtn: { padding: 8 },
});
