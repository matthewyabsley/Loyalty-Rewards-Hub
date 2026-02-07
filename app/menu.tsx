import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '@/lib/data-context';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];

const CATEGORY_ICONS: Record<string, string> = {
  'All': 'grid',
  'Starters': 'leaf',
  'Mains': 'restaurant',
  'Desserts': 'ice-cream',
  'Drinks': 'wine',
};

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const { menu, cart, addToCart, cartTotal } = useData();
  const [activeCategory, setActiveCategory] = useState('All');
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  const filteredMenu = activeCategory === 'All'
    ? menu
    : menu.filter(item => item.category === activeCategory);

  const cartItemCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  async function handleAddToCart(item: any) {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    addToCart(item);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topBarTitle}>Menu</Text>
        <Pressable
          style={styles.cartButton}
          onPress={() => router.push('/cart')}
        >
          <Ionicons name="bag-outline" size={24} color={Colors.text} />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar} contentContainerStyle={styles.categoryContent}>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <Pressable
              key={cat}
              style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Ionicons name={CATEGORY_ICONS[cat] as any} size={16} color={isActive ? '#FFF' : Colors.textSecondary} />
              <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{cat}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuList}>
        {filteredMenu.map((item, i) => (
          <MenuItemCard key={item.id} item={item} onAdd={handleAddToCart} delay={i * 50} />
        ))}
      </ScrollView>

      {cartItemCount > 0 && (
        <Animated.View entering={FadeIn.duration(300)} style={[styles.cartBar, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 12 }]}>
          <Pressable
            style={({ pressed }) => [styles.viewCartButton, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
            onPress={() => router.push('/cart')}
          >
            <View style={styles.cartInfo}>
              <View style={styles.cartCount}>
                <Text style={styles.cartCountText}>{cartItemCount}</Text>
              </View>
              <Text style={styles.viewCartText}>View Order</Text>
            </View>
            <Text style={styles.cartTotalText}>{'\u00A3'}{cartTotal.toFixed(2)}</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

function MenuItemCard({ item, onAdd, delay }: { item: any; onAdd: (item: any) => void; delay: number }) {
  const itemIcon = item.category === 'Starters' ? 'leaf' : item.category === 'Mains' ? 'restaurant' : item.category === 'Desserts' ? 'ice-cream' : 'wine';
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <View style={styles.menuCard}>
        <View style={styles.menuCardContent}>
          <View style={styles.menuCardLeft}>
            <View style={styles.menuItemHeader}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              {item.popular && (
                <View style={styles.popularBadge}>
                  <Ionicons name="flame" size={10} color={Colors.error} />
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}
            </View>
            <Text style={styles.menuItemDesc} numberOfLines={2}>{item.description}</Text>
            <Text style={styles.menuItemPrice}>{'\u00A3'}{item.price.toFixed(2)}</Text>
          </View>
          <View style={styles.menuCardRight}>
            <View style={styles.menuItemIcon}>
              <Ionicons name={itemIcon as any} size={24} color={Colors.primary} />
            </View>
            <Pressable
              style={({ pressed }) => [styles.addButton, pressed && { transform: [{ scale: 0.9 }] }]}
              onPress={() => onAdd(item)}
            >
              <Ionicons name="add" size={22} color="#FFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFF',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topBarTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  cartButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  cartBadge: {
    position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  cartBadgeText: { fontSize: 10, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
  categoryBar: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: Colors.border, maxHeight: 56 },
  categoryContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center', paddingVertical: 10 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface,
  },
  categoryChipActive: { backgroundColor: Colors.primary },
  categoryText: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  categoryTextActive: { color: '#FFF' },
  menuList: { padding: 16, paddingBottom: 140, gap: 12 },
  menuCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  menuCardContent: { flexDirection: 'row' },
  menuCardLeft: { flex: 1, paddingRight: 12 },
  menuItemHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  menuItemName: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  popularBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: Colors.error + '10',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },
  popularText: { fontSize: 10, fontFamily: 'Poppins_500Medium', color: Colors.error },
  menuItemDesc: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, lineHeight: 18, marginBottom: 8 },
  menuItemPrice: { fontSize: 17, fontFamily: 'Poppins_700Bold', color: Colors.primary },
  menuCardRight: { alignItems: 'center', justifyContent: 'space-between' },
  menuItemIcon: {
    width: 56, height: 56, borderRadius: 14, backgroundColor: Colors.primary + '10',
    justifyContent: 'center', alignItems: 'center',
  },
  addButton: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  cartBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16, paddingTop: 12, backgroundColor: '#FFF',
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  viewCartButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18,
  },
  cartInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cartCount: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  cartCountText: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
  viewCartText: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },
  cartTotalText: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: '#FFF' },
});
