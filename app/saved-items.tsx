import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useData } from '@/lib/data-context';
import Colors from '@/constants/colors';
import Animated, { FadeInDown, FadeOutRight } from 'react-native-reanimated';

export default function SavedItemsScreen() {
  const insets = useSafeAreaInsets();
  const { savedItems, menu, toggleSavedItem } = useData();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;

  function handleRemove(menuItemId: string) {
    const menuItem = menu.find(m => m.id === menuItemId);
    if (menuItem) {
      toggleSavedItem(menuItem);
    }
  }

  const CATEGORY_ICONS: Record<string, string> = {
    'Starters': 'leaf-outline',
    'Mains': 'flame-outline',
    'Desserts': 'ice-cream-outline',
    'Drinks': 'wine-outline',
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Saved Items</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {savedItems.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(500)} style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyTitle}>No Saved Items</Text>
            <Text style={styles.emptyText}>Save your favourite dishes for quick access</Text>
          </Animated.View>
        ) : (
          savedItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(index * 60).duration(400)}
              style={styles.itemCard}
            >
              <View style={styles.itemIconWrap}>
                <Ionicons
                  name={(CATEGORY_ICONS[item.category] || 'restaurant-outline') as any}
                  size={22}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc} numberOfLines={1}>{item.description}</Text>
                <View style={styles.itemMeta}>
                  <Text style={styles.itemPrice}>£{item.price.toFixed(2)}</Text>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>
                </View>
              </View>
              <Pressable
                onPress={() => handleRemove(item.menuItemId)}
                hitSlop={12}
                style={styles.removeBtn}
              >
                <Ionicons name="bookmark" size={22} color={Colors.accent} />
              </Pressable>
            </Animated.View>
          ))
        )}

        {savedItems.length > 0 && (
          <Animated.View entering={FadeInDown.delay(savedItems.length * 60 + 100).duration(400)}>
            <Pressable
              style={({ pressed }) => [styles.browseBtn, pressed && { opacity: 0.8 }]}
              onPress={() => router.push('/menu')}
            >
              <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.browseBtnText}>Browse Menu</Text>
            </Pressable>
          </Animated.View>
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

  itemCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 12, backgroundColor: '#FFF', borderRadius: 18,
    padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  itemIconWrap: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.primary + '10',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  itemDesc: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, marginTop: 2 },
  itemMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  itemPrice: { fontSize: 15, fontFamily: 'Poppins_700Bold', color: Colors.primary },
  categoryTag: {
    backgroundColor: Colors.surface, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8,
  },
  categoryText: { fontSize: 10, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  removeBtn: { padding: 8 },

  browseBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 20, marginTop: 8, paddingVertical: 14, borderRadius: 16,
    borderWidth: 1.5, borderColor: Colors.primary + '30', borderStyle: 'dashed',
  },
  browseBtnText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: Colors.primary },
});
