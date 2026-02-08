import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, Modal,
  TextInput, Alert, KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '@/lib/data-context';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

const DENOMINATIONS = [25, 50, 75, 100, 150];

type DeliveryMethod = 'wallet' | 'email' | 'sms';

const VOUCHER_DESIGNS: { gradient: [string, string]; pattern: string }[] = [
  { gradient: ['#8B1A2B', '#A82040'], pattern: 'burgundy' },
  { gradient: ['#1A1A1A', '#333333'], pattern: 'dark' },
  { gradient: ['#D4A853', '#B8903F'], pattern: 'gold' },
  { gradient: ['#2D5A3D', '#1A3D28'], pattern: 'green' },
  { gradient: ['#3A2D6B', '#5A45A0'], pattern: 'purple' },
];

export default function GiftVouchersScreen() {
  const insets = useSafeAreaInsets();
  const { paymentMethods } = useData();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('wallet');
  const [recipientName, setRecipientName] = useState('');
  const [recipientContact, setRecipientContact] = useState('');
  const [message, setMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const defaultPayment = paymentMethods.find(m => m.isDefault);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);

  const activePayment = selectedPaymentId
    ? paymentMethods.find(m => m.id === selectedPaymentId) || defaultPayment
    : defaultPayment;

  function selectDenomination(amount: number) {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setSelectedAmount(amount);
    setDeliveryMethod('wallet');
    setRecipientName('');
    setRecipientContact('');
    setMessage('');
    setTermsAccepted(false);
    setModalVisible(true);
  }

  function getCardIcon(type: string) {
    switch (type) {
      case 'visa': return 'card';
      case 'mastercard': return 'card';
      case 'amex': return 'card';
      case 'apple_pay': return 'logo-apple';
      default: return 'card';
    }
  }

  function getCardLabel(method: typeof defaultPayment) {
    if (!method) return 'No payment method';
    if (method.type === 'apple_pay') return 'Apple Pay';
    return `${method.type.charAt(0).toUpperCase() + method.type.slice(1)} ****${method.last4}`;
  }

  function canPurchase() {
    if (!termsAccepted) return false;
    if (!activePayment) return false;
    if (deliveryMethod === 'email') {
      if (!recipientName.trim() || !recipientContact.trim()) return false;
      if (!recipientContact.includes('@')) return false;
    }
    if (deliveryMethod === 'sms') {
      if (!recipientName.trim() || !recipientContact.trim()) return false;
    }
    return true;
  }

  async function handlePurchase() {
    if (!canPurchase()) return;
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    setIsPurchasing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsPurchasing(false);
    setModalVisible(false);

    const deliveryLabel = deliveryMethod === 'wallet' ? 'saved to your wallet' :
      deliveryMethod === 'email' ? `sent to ${recipientContact}` :
      `sent via SMS to ${recipientContact}`;

    Alert.alert(
      'Voucher Purchased!',
      `Your £${selectedAmount} gift voucher has been ${deliveryLabel}. You earned ${(selectedAmount || 0) * 2} loyalty points!`,
      [{ text: 'OK' }]
    );
  }

  const designIndex = selectedAmount ? DENOMINATIONS.indexOf(selectedAmount) % VOUCHER_DESIGNS.length : 0;
  const design = VOUCHER_DESIGNS[designIndex];

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Gift Vouchers</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Choose a voucher amount to send as a gift</Text>

        {DENOMINATIONS.map((amount, index) => {
          const vDesign = VOUCHER_DESIGNS[index % VOUCHER_DESIGNS.length];
          return (
            <Animated.View key={amount} entering={FadeInDown.delay(index * 60).duration(400)}>
              <Pressable
                onPress={() => selectDenomination(amount)}
                style={({ pressed }) => [styles.voucherCard, pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 }]}
              >
                <LinearGradient
                  colors={vDesign.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.voucherGradient}
                >
                  <View style={styles.voucherTopRow}>
                    <View style={styles.voucherLogoArea}>
                      <Ionicons name="restaurant" size={18} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.voucherBrand}>Tap Yard</Text>
                    </View>
                    <Text style={styles.voucherLabel}>GIFT VOUCHER</Text>
                  </View>
                  <View style={styles.voucherCenter}>
                    <Text style={styles.voucherAmount}>£{amount}</Text>
                  </View>
                  <View style={styles.voucherBottomRow}>
                    <Text style={styles.voucherEarn}>Earn {amount * 2} pts</Text>
                    <View style={styles.voucherChevron}>
                      <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.7)" />
                    </View>
                  </View>
                  <View style={styles.voucherDecor1} />
                  <View style={styles.voucherDecor2} />
                </LinearGradient>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)} />
            <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 20 }]}>
              <View style={styles.modalHandle} />
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={styles.modalHeader}>
                  <LinearGradient
                    colors={design.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.modalVoucherPreview}
                  >
                    <Text style={styles.modalPreviewBrand}>Tap Yard</Text>
                    <Text style={styles.modalPreviewAmount}>£{selectedAmount}</Text>
                    <Text style={styles.modalPreviewLabel}>Gift Voucher</Text>
                  </LinearGradient>
                </View>

                <Text style={styles.modalSectionTitle}>Delivery Method</Text>
                <View style={styles.deliveryRow}>
                  {([
                    { key: 'wallet' as DeliveryMethod, icon: 'wallet', label: 'Wallet' },
                    { key: 'email' as DeliveryMethod, icon: 'mail', label: 'Email' },
                    { key: 'sms' as DeliveryMethod, icon: 'chatbubble', label: 'SMS' },
                  ]).map(opt => (
                    <Pressable
                      key={opt.key}
                      onPress={() => setDeliveryMethod(opt.key)}
                      style={[styles.deliveryOption, deliveryMethod === opt.key && styles.deliveryOptionActive]}
                    >
                      <Ionicons
                        name={opt.icon as any}
                        size={20}
                        color={deliveryMethod === opt.key ? Colors.primary : Colors.textSecondary}
                      />
                      <Text style={[styles.deliveryLabel, deliveryMethod === opt.key && styles.deliveryLabelActive]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {(deliveryMethod === 'email' || deliveryMethod === 'sms') && (
                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>Recipient Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={recipientName}
                      onChangeText={setRecipientName}
                      placeholder="Enter their name"
                      placeholderTextColor="#B5B5B5"
                    />
                    <Text style={styles.inputLabel}>
                      {deliveryMethod === 'email' ? 'Email Address' : 'Mobile Number'}
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      value={recipientContact}
                      onChangeText={setRecipientContact}
                      placeholder={deliveryMethod === 'email' ? 'name@example.com' : '07700 900000'}
                      placeholderTextColor="#B5B5B5"
                      keyboardType={deliveryMethod === 'email' ? 'email-address' : 'phone-pad'}
                      autoCapitalize="none"
                    />
                  </View>
                )}

                <Text style={styles.inputLabel}>Personal Message (optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.messageInput]}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Add a personal message..."
                  placeholderTextColor="#B5B5B5"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />

                <Pressable
                  style={styles.termsRow}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                >
                  <View style={[styles.checkbox, termsAccepted && styles.checkboxActive]}>
                    {termsAccepted && <Ionicons name="checkmark" size={14} color="#FFF" />}
                  </View>
                  <Text style={styles.termsText}>
                    I accept the <Text style={styles.termsLink}>Terms & Conditions</Text>
                  </Text>
                </Pressable>

                <View style={styles.paymentSection}>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Payment</Text>
                    {activePayment ? (
                      paymentMethods.length > 1 ? (
                        <Pressable
                          onPress={() => setPaymentDropdownOpen(!paymentDropdownOpen)}
                          style={styles.paymentDropdownTrigger}
                        >
                          <Ionicons name={getCardIcon(activePayment.type) as any} size={18} color={Colors.text} />
                          <Text style={styles.paymentMethodText}>{getCardLabel(activePayment)}</Text>
                          <Ionicons name={paymentDropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textSecondary} />
                        </Pressable>
                      ) : (
                        <View style={styles.paymentMethod}>
                          <Ionicons name={getCardIcon(activePayment.type) as any} size={18} color={Colors.text} />
                          <Text style={styles.paymentMethodText}>{getCardLabel(activePayment)}</Text>
                        </View>
                      )
                    ) : (
                      <Pressable onPress={() => { setModalVisible(false); router.push('/payment-methods'); }}>
                        <Text style={styles.addPaymentText}>Add payment method</Text>
                      </Pressable>
                    )}
                  </View>
                  {paymentDropdownOpen && paymentMethods.length > 1 && (
                    <View style={styles.paymentDropdown}>
                      {paymentMethods.map(method => (
                        <Pressable
                          key={method.id}
                          onPress={() => {
                            setSelectedPaymentId(method.id);
                            setPaymentDropdownOpen(false);
                          }}
                          style={[
                            styles.paymentDropdownItem,
                            method.id === (activePayment?.id) && styles.paymentDropdownItemActive,
                          ]}
                        >
                          <Ionicons name={getCardIcon(method.type) as any} size={16} color={method.id === activePayment?.id ? Colors.primary : Colors.text} />
                          <Text style={[
                            styles.paymentDropdownText,
                            method.id === activePayment?.id && { color: Colors.primary },
                          ]}>{getCardLabel(method)}</Text>
                          {method.id === activePayment?.id && (
                            <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                          )}
                        </Pressable>
                      ))}
                    </View>
                  )}
                  <Pressable
                    onPress={() => { setModalVisible(false); router.push('/payment-methods'); }}
                    style={styles.managePaymentLink}
                  >
                    <Ionicons name="settings-outline" size={14} color={Colors.primary} />
                    <Text style={styles.managePaymentText}>Manage payment methods</Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={handlePurchase}
                  disabled={!canPurchase() || isPurchasing}
                  style={({ pressed }) => [pressed && canPurchase() && { transform: [{ scale: 0.98 }] }]}
                >
                  <LinearGradient
                    colors={canPurchase() && !isPurchasing ? [Colors.primary, Colors.primaryLight] : ['#CCC', '#BBB']}
                    style={styles.purchaseBtn}
                  >
                    {isPurchasing ? (
                      <Text style={styles.purchaseBtnText}>Processing...</Text>
                    ) : (
                      <>
                        <Ionicons name="lock-closed" size={16} color="#FFF" />
                        <Text style={styles.purchaseBtnText}>
                          Purchase £{selectedAmount} Voucher
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topTitle: { fontSize: 18, fontFamily: 'Poppins_700Bold', color: Colors.text },
  content: { padding: 20, paddingBottom: 40 },
  subtitle: {
    fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary,
    marginBottom: 20, textAlign: 'center',
  },

  voucherCard: { marginBottom: 14 },
  voucherGradient: {
    borderRadius: 20, padding: 22, height: 140, justifyContent: 'space-between',
    overflow: 'hidden',
  },
  voucherTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voucherLogoArea: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  voucherBrand: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: 'rgba(255,255,255,0.85)' },
  voucherLabel: {
    fontSize: 10, fontFamily: 'Poppins_600SemiBold', color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
  },
  voucherCenter: { alignItems: 'center' },
  voucherAmount: { fontSize: 42, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  voucherBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voucherEarn: { fontSize: 12, fontFamily: 'Poppins_500Medium', color: 'rgba(255,255,255,0.6)' },
  voucherChevron: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  voucherDecor1: {
    position: 'absolute', top: -30, right: -30, width: 100, height: 100,
    borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.06)',
  },
  voucherDecor2: {
    position: 'absolute', bottom: -20, left: -20, width: 80, height: 80,
    borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.04)',
  },

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingTop: 12, maxHeight: '90%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 16,
  },
  modalHeader: { alignItems: 'center', marginBottom: 24 },
  modalVoucherPreview: {
    width: '100%', borderRadius: 16, padding: 20, alignItems: 'center', height: 110,
    justifyContent: 'center',
  },
  modalPreviewBrand: {
    fontSize: 11, fontFamily: 'Poppins_500Medium', color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1, marginBottom: 2,
  },
  modalPreviewAmount: { fontSize: 36, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  modalPreviewLabel: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: 'rgba(255,255,255,0.5)' },

  modalSectionTitle: {
    fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.text, marginBottom: 12,
  },
  deliveryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  deliveryOption: {
    flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14,
    backgroundColor: '#FFF', borderWidth: 1.5, borderColor: Colors.border, gap: 6,
  },
  deliveryOptionActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  deliveryLabel: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  deliveryLabelActive: { color: Colors.primary, fontFamily: 'Poppins_600SemiBold' },

  formSection: { marginBottom: 4 },
  inputLabel: {
    fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.text, marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, fontFamily: 'Poppins_400Regular',
    color: Colors.text, marginBottom: 14,
  },
  messageInput: { height: 80, textAlignVertical: 'top' as const },

  termsRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20, marginTop: 4,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF',
  },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  termsText: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.text, flex: 1 },
  termsLink: { color: Colors.primary, fontFamily: 'Poppins_500Medium' },

  paymentSection: {
    backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: Colors.border,
  },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentLabel: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  paymentMethod: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  paymentDropdownTrigger: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  paymentMethodText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  addPaymentText: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: Colors.primary },
  paymentDropdown: {
    marginTop: 12, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 8,
  },
  paymentDropdownItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 4,
    borderRadius: 10,
  },
  paymentDropdownItemActive: { backgroundColor: Colors.primary + '08' },
  paymentDropdownText: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text, flex: 1 },
  managePaymentLink: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12,
  },
  managePaymentText: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.primary },

  purchaseBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 16, paddingVertical: 16, gap: 8, marginBottom: 10,
  },
  purchaseBtnText: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#FFF' },
});
