import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, Dimensions,
  Modal, TextInput, KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '@/lib/data-context';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');
const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];
const TABLE_NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1);

const CAT_ICONS: Record<string, { name: string; color: string }> = {
  All: { name: 'grid', color: Colors.text },
  Starters: { name: 'leaf', color: '#4CAF50' },
  Mains: { name: 'flame', color: '#E8735A' },
  Desserts: { name: 'ice-cream', color: '#8B5AE8' },
  Drinks: { name: 'wine', color: '#5A9AE8' },
};

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const { menu, cart, addToCart, cartTotal, tableNumber, setTableNumber } = useData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showTableModal, setShowTableModal] = useState(tableNumber === null);
  const [showScanner, setShowScanner] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const filteredMenu = activeCategory === 'All' ? menu : menu.filter(item => item.category === activeCategory);
  const cartItemCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  async function handleAdd(item: any) {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    addToCart(item);
  }

  function handleSelectTable(num: number) {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    setTableNumber(num);
    setShowTableModal(false);
  }

  function handleManualSubmit() {
    const num = parseInt(manualInput, 10);
    if (num >= 1 && num <= 99) {
      handleSelectTable(num);
    }
  }

  function handleChangeTable() {
    setShowTableModal(true);
    setManualInput('');
    setShowScanner(false);
  }

  async function handleOpenScanner() {
    if (Platform.OS === 'web') {
      setShowScanner(true);
      return;
    }
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setShowScanner(true);
  }

  function handleBarCodeScanned({ data }: { data: string }) {
    const match = data.match(/table[:\s-]*(\d+)/i) || data.match(/^(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num >= 1 && num <= 99) {
        setShowScanner(false);
        handleSelectTable(num);
        return;
      }
    }
    setShowScanner(false);
    handleSelectTable(parseInt(data, 10) || 1);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Menu</Text>
        <Pressable style={styles.cartBtn} onPress={() => router.push('/cart')}>
          <Ionicons name="bag-outline" size={22} color={Colors.text} />
          {cartItemCount > 0 && (
            <View style={styles.cartDot}>
              <Text style={styles.cartDotText}>{cartItemCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {tableNumber && (
        <Pressable onPress={handleChangeTable} style={styles.tableBanner}>
          <View style={styles.tableBannerLeft}>
            <View style={styles.tableBannerIcon}>
              <Ionicons name="tablet-landscape-outline" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.tableBannerText}>
              Table <Text style={styles.tableBannerNum}>{tableNumber}</Text>
            </Text>
          </View>
          <View style={styles.tableBannerChange}>
            <Text style={styles.tableBannerChangeText}>Change</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
          </View>
        </Pressable>
      )}

      <View style={styles.catBarWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catContent}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat;
            const cfg = CAT_ICONS[cat];
            return (
              <Pressable key={cat} onPress={() => setActiveCategory(cat)}>
                {active ? (
                  <LinearGradient colors={['#1A1A1A', '#2D2D2D']} style={styles.catChip}>
                    <Ionicons name={cfg.name as any} size={15} color="#FFF" />
                    <Text style={[styles.catText, { color: '#FFF' }]}>{cat}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.catChip}>
                    <Ionicons name={cfg.name as any} size={15} color={Colors.textSecondary} />
                    <Text style={styles.catText}>{cat}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuList}>
        {filteredMenu.map((item, i) => (
          <MenuCard key={item.id} item={item} onAdd={handleAdd} delay={i * 40} />
        ))}
      </ScrollView>

      {cartItemCount > 0 && (
        <Animated.View entering={FadeIn.duration(250)} style={[styles.cartBar, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 12 }]}>
          <Pressable
            style={({ pressed }) => [pressed && { transform: [{ scale: 0.98 }] }]}
            onPress={() => router.push('/cart')}
          >
            <LinearGradient colors={['#1A1A1A', '#2D2D2D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cartBarInner}>
              <View style={styles.cartBarLeft}>
                <View style={styles.cartCount}>
                  <Text style={styles.cartCountText}>{cartItemCount}</Text>
                </View>
                <Text style={styles.cartBarLabel}>View Order</Text>
              </View>
              <Text style={styles.cartBarTotal}>{'\u00A3'}{cartTotal.toFixed(2)}</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      )}

      <Modal
        visible={showTableModal}
        animationType="slide"
        transparent
        onRequestClose={() => { if (tableNumber) setShowTableModal(false); }}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalKeyboard}>
            <Animated.View entering={FadeInUp.duration(400)} style={[styles.modalContent, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 20 }]}>
              {showScanner ? (
                <View style={styles.scannerContainer}>
                  <View style={styles.scannerHeader}>
                    <Pressable onPress={() => setShowScanner(false)} style={styles.scannerBackBtn}>
                      <Ionicons name="chevron-back" size={24} color={Colors.text} />
                    </Pressable>
                    <Text style={styles.scannerTitle}>Scan QR Code</Text>
                    <View style={{ width: 40 }} />
                  </View>

                  {Platform.OS === 'web' ? (
                    <View style={styles.scannerFallback}>
                      <View style={styles.scannerFallbackIcon}>
                        <Ionicons name="camera-outline" size={48} color={Colors.textSecondary} />
                      </View>
                      <Text style={styles.scannerFallbackTitle}>Camera not available</Text>
                      <Text style={styles.scannerFallbackText}>Please enter your table number manually</Text>
                      <Pressable onPress={() => setShowScanner(false)}>
                        <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.scannerFallbackBtn}>
                          <Text style={styles.scannerFallbackBtnText}>Enter Manually</Text>
                        </LinearGradient>
                      </Pressable>
                    </View>
                  ) : (
                    <View style={styles.cameraBox}>
                      {permission?.granted ? (
                        <CameraView
                          style={styles.camera}
                          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                          onBarcodeScanned={handleBarCodeScanned}
                        >
                          <View style={styles.scanOverlay}>
                            <View style={styles.scanFrame}>
                              <View style={[styles.scanCorner, styles.scanTL]} />
                              <View style={[styles.scanCorner, styles.scanTR]} />
                              <View style={[styles.scanCorner, styles.scanBL]} />
                              <View style={[styles.scanCorner, styles.scanBR]} />
                            </View>
                            <Text style={styles.scanHint}>Point at the table QR code</Text>
                          </View>
                        </CameraView>
                      ) : (
                        <View style={styles.scannerFallback}>
                          <Ionicons name="camera-outline" size={48} color={Colors.textSecondary} />
                          <Text style={styles.scannerFallbackTitle}>Camera access needed</Text>
                          <Pressable onPress={requestPermission}>
                            <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.scannerFallbackBtn}>
                              <Text style={styles.scannerFallbackBtnText}>Allow Camera</Text>
                            </LinearGradient>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ) : (
                <>
                  <View style={styles.modalHandle} />
                  <View style={styles.modalHeader}>
                    <View style={styles.modalIconWrap}>
                      <Ionicons name="tablet-landscape-outline" size={28} color={Colors.primary} />
                    </View>
                    <Text style={styles.modalTitle}>Select Your Table</Text>
                    <Text style={styles.modalSubtitle}>Choose your table number or scan the QR code on your table</Text>
                  </View>

                  <View style={styles.inputRow}>
                    <View style={styles.inputWrap}>
                      <Ionicons name="keypad-outline" size={18} color={Colors.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.tableInput}
                        placeholder="Enter table number"
                        placeholderTextColor={Colors.textSecondary}
                        keyboardType="number-pad"
                        value={manualInput}
                        onChangeText={setManualInput}
                        maxLength={2}
                        onSubmitEditing={handleManualSubmit}
                        returnKeyType="done"
                      />
                      <Pressable
                        onPress={handleOpenScanner}
                        style={({ pressed }) => [styles.scanIconBtn, pressed && { opacity: 0.7 }]}
                      >
                        <Ionicons name="qr-code-outline" size={22} color="#FFF" />
                      </Pressable>
                    </View>
                    {manualInput.length > 0 && (
                      <Pressable
                        onPress={handleManualSubmit}
                        style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                      >
                        <LinearGradient colors={['#1A1A1A', '#2D2D2D']} style={styles.goBtn}>
                          <Ionicons name="arrow-forward" size={20} color="#FFF" />
                        </LinearGradient>
                      </Pressable>
                    )}
                  </View>

                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or select below</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false} style={styles.tableGridScroll} contentContainerStyle={styles.tableGrid}>
                    {TABLE_NUMBERS.map(num => (
                      <Pressable
                        key={num}
                        onPress={() => handleSelectTable(num)}
                        style={({ pressed }) => [styles.tableCell, pressed && { transform: [{ scale: 0.92 }] }]}
                      >
                        <Text style={styles.tableCellNum}>{num}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </>
              )}
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

function MenuCard({ item, onAdd, delay }: { item: any; onAdd: (item: any) => void; delay: number }) {
  const cfg = CAT_ICONS[item.category] || CAT_ICONS.All;
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <View style={styles.menuCard}>
        <View style={styles.menuCardMain}>
          <View style={styles.menuCardInfo}>
            {item.popular && (
              <View style={styles.popularTag}>
                <Ionicons name="flame" size={10} color="#FFF" />
                <Text style={styles.popularText}>Popular</Text>
              </View>
            )}
            <Text style={styles.menuName}>{item.name}</Text>
            <Text style={styles.menuDesc} numberOfLines={2}>{item.description}</Text>
          </View>
          <View style={[styles.menuIconBox, { backgroundColor: cfg.color + '12' }]}>
            <Ionicons name={cfg.name as any} size={26} color={cfg.color} />
          </View>
        </View>
        <View style={styles.menuCardBottom}>
          <Text style={styles.menuPrice}>{'\u00A3'}{item.price.toFixed(2)}</Text>
          <Pressable
            style={({ pressed }) => [styles.addBtn, pressed && { transform: [{ scale: 0.9 }] }]}
            onPress={() => onAdd(item)}
          >
            <Ionicons name="add" size={20} color="#FFF" />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 10,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  cartBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  cartDot: {
    position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  cartDotText: { fontSize: 10, fontFamily: 'Poppins_700Bold', color: '#FFF' },

  tableBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 20, marginBottom: 8,
    backgroundColor: Colors.primary + '0A', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.primary + '18',
  },
  tableBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tableBannerIcon: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.primary + '14',
    justifyContent: 'center', alignItems: 'center',
  },
  tableBannerText: { fontSize: 14, fontFamily: 'Poppins_500Medium', color: Colors.text },
  tableBannerNum: { fontFamily: 'Poppins_700Bold', color: Colors.primary, fontSize: 15 },
  tableBannerChange: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  tableBannerChangeText: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: Colors.primary },

  catBarWrap: { height: 58, marginBottom: 4 },
  catContent: { paddingHorizontal: 20, gap: 8, alignItems: 'center', height: 58, paddingVertical: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingHorizontal: 16, height: 42, borderRadius: 14, backgroundColor: '#FFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  catText: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: Colors.textSecondary },

  menuList: { padding: 20, paddingBottom: 140, gap: 12 },
  menuCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  menuCardMain: { flexDirection: 'row', marginBottom: 14 },
  menuCardInfo: { flex: 1, paddingRight: 14 },
  popularTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.error,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 8,
  },
  popularText: { fontSize: 10, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
  menuName: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: Colors.text, marginBottom: 4 },
  menuDesc: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, lineHeight: 19 },
  menuIconBox: {
    width: 58, height: 58, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },
  menuCardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  menuPrice: { fontSize: 18, fontFamily: 'Poppins_700Bold', color: Colors.text },
  addBtn: {
    width: 40, height: 40, borderRadius: 14, backgroundColor: '#1A1A1A',
    justifyContent: 'center', alignItems: 'center',
  },

  cartBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingTop: 12, backgroundColor: Colors.background,
  },
  cartBarInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 18, paddingVertical: 16, paddingHorizontal: 20,
  },
  cartBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cartCount: {
    width: 28, height: 28, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  cartCountText: { fontSize: 13, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  cartBarLabel: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
  cartBarTotal: { fontSize: 17, fontFamily: 'Poppins_700Bold', color: '#FFF' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end',
  },
  modalKeyboard: { justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingTop: 12,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 20,
  },
  modalHeader: { alignItems: 'center', marginBottom: 24 },
  modalIconWrap: {
    width: 60, height: 60, borderRadius: 20, backgroundColor: Colors.primary + '10',
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  modalTitle: { fontSize: 22, fontFamily: 'Poppins_700Bold', color: Colors.text, marginBottom: 6 },
  modalSubtitle: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 16, paddingLeft: 14,
    borderWidth: 1.5, borderColor: Colors.border, height: 54,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  inputIcon: { marginRight: 10 },
  tableInput: {
    flex: 1, fontSize: 16, fontFamily: 'Poppins_500Medium', color: Colors.text,
    height: 54, paddingRight: 8,
  },
  scanIconBtn: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginRight: 5,
  },
  goBtn: {
    width: 54, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 12, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },

  tableGridScroll: { maxHeight: 260 },
  tableGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    justifyContent: 'center', paddingBottom: 10,
  },
  tableCell: {
    width: (width - 48 - 40) / 5, height: (width - 48 - 40) / 5,
    borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
    borderWidth: 1, borderColor: Colors.border + '80',
  },
  tableCellNum: { fontSize: 18, fontFamily: 'Poppins_700Bold', color: Colors.text },

  scannerContainer: { minHeight: 400 },
  scannerHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 16, paddingTop: 8,
  },
  scannerBackBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scannerTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  cameraBox: { borderRadius: 20, overflow: 'hidden', height: 320 },
  camera: { flex: 1 },
  scanOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scanFrame: {
    width: 200, height: 200, borderRadius: 20,
    position: 'relative',
  },
  scanCorner: {
    position: 'absolute', width: 40, height: 40,
    borderColor: '#FFF', borderWidth: 3,
  },
  scanTL: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 20 },
  scanTR: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 20 },
  scanBL: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 20 },
  scanBR: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 20 },
  scanHint: {
    marginTop: 24, fontSize: 14, fontFamily: 'Poppins_500Medium', color: '#FFF',
    textAlign: 'center',
  },
  scannerFallback: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14, paddingVertical: 40,
  },
  scannerFallbackIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.surface,
    justifyContent: 'center', alignItems: 'center',
  },
  scannerFallbackTitle: { fontSize: 17, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  scannerFallbackText: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  scannerFallbackBtn: {
    borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14, marginTop: 4,
  },
  scannerFallbackBtnText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
});
