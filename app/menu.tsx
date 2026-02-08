import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '@/lib/data-context';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];

const CAT_ICONS: Record<string, { name: string; color: string }> = {
  All: { name: 'grid', color: Colors.text },
  Starters: { name: 'leaf', color: '#4CAF50' },
  Mains: { name: 'flame', color: '#E8735A' },
  Desserts: { name: 'ice-cream', color: '#8B5AE8' },
  Drinks: { name: 'wine', color: '#5A9AE8' },
};

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const { menu, cart, addToCart, cartTotal } = useData();
  const [activeCategory, setActiveCategory] = useState('All');
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const filteredMenu = activeCategory === 'All' ? menu : menu.filter(item => item.category === activeCategory);
  const cartItemCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  async function handleAdd(item: any) {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    addToCart(item);
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
});
