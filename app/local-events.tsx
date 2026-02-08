import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, Linking, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type EventCategory = 'Market' | 'Festival' | 'Music' | 'Running' | 'Cinema' | 'Community' | 'Food';

interface LocalEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  coords: { lat: number; lng: number };
  description: string;
}

const CAT_CONFIG: Record<EventCategory, { gradient: string[]; icon: string }> = {
  Market: { gradient: ['#E8735A', '#D45A42'], icon: 'basket' },
  Festival: { gradient: ['#8B5AE8', '#7042D0'], icon: 'sparkles' },
  Music: { gradient: ['#5A9AE8', '#4280D0'], icon: 'musical-notes' },
  Running: { gradient: ['#1DB264', '#17904F'], icon: 'fitness' },
  Cinema: { gradient: ['#E8A830', '#C98E20'], icon: 'film' },
  Community: { gradient: ['#E85A8B', '#D04270'], icon: 'people' },
  Food: { gradient: ['#E8735A', '#D45A42'], icon: 'fast-food' },
};

const CATEGORIES: EventCategory[] = ['Market', 'Festival', 'Music', 'Running', 'Cinema', 'Community', 'Food'];

const WILMSLOW_EVENTS: LocalEvent[] = [
  { id: 'am-jan', title: 'Wilmslow Artisan Market', category: 'Market', date: '2026-01-17', startTime: '10:00', endTime: '16:00', location: 'Alderley Road', address: 'Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3271, lng: -2.2310 }, description: '120+ artisan traders with food, gifts and handmade goods.' },
  { id: 'am-feb', title: 'Wilmslow Artisan Market', category: 'Market', date: '2026-02-21', startTime: '10:00', endTime: '16:00', location: 'Alderley Road', address: 'Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3271, lng: -2.2310 }, description: '120+ artisan traders with food, gifts and handmade goods.' },
  { id: 'run-mar', title: 'Wilmslow Running Festival', category: 'Running', date: '2026-03-22', startTime: '08:30', endTime: '14:00', location: 'Wilmslow Town Centre', address: 'Bank Square, Wilmslow SK9 1AN', coords: { lat: 53.3283, lng: -2.2290 }, description: 'Half Marathon, 10K & Fun Run through the streets of Wilmslow.' },
  { id: 'am-mar', title: 'Wilmslow Artisan Market', category: 'Market', date: '2026-03-21', startTime: '10:00', endTime: '16:00', location: 'Alderley Road', address: 'Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3271, lng: -2.2310 }, description: '120+ artisan traders with food, gifts and handmade goods.' },
  { id: 'am-apr', title: 'Wilmslow Artisan Market', category: 'Market', date: '2026-04-18', startTime: '10:00', endTime: '16:00', location: 'Alderley Road', address: 'Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3271, lng: -2.2310 }, description: '120+ artisan traders with food, gifts and handmade goods.' },
  { id: 'sf-apr', title: 'Wilmslow Street Fest', category: 'Food', date: '2026-04-24', startTime: '17:00', endTime: '21:00', location: 'Bank Square', address: 'Bank Square, Wilmslow SK9 1AN', coords: { lat: 53.3283, lng: -2.2290 }, description: 'Street food festival with live music and global cuisine.' },
  { id: 'am-may', title: 'Wilmslow Artisan Market', category: 'Market', date: '2026-05-16', startTime: '10:00', endTime: '16:00', location: 'Alderley Road', address: 'Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3271, lng: -2.2310 }, description: '120+ artisan traders with food, gifts and handmade goods.' },
  { id: 'am-jun', title: 'Wilmslow Artisan Market', category: 'Market', date: '2026-06-20', startTime: '10:00', endTime: '16:00', location: 'Alderley Road', address: 'Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3271, lng: -2.2310 }, description: '120+ artisan traders with food, gifts and handmade goods.' },
  { id: 'live-jun', title: 'Wilmslow Live', category: 'Music', date: '2026-06-20', startTime: '12:00', endTime: '19:00', location: 'Bank Square', address: 'Bank Square, Wilmslow SK9 1AN', coords: { lat: 53.3283, lng: -2.2290 }, description: 'Free music festival with local bands, street food and family activities.' },
  { id: 'sf-jun', title: 'Wilmslow Street Fest', category: 'Food', date: '2026-06-26', startTime: '17:00', endTime: '21:00', location: 'Bank Square', address: 'Bank Square, Wilmslow SK9 1AN', coords: { lat: 53.3283, lng: -2.2290 }, description: 'Street food festival with live music and global cuisine.' },
  { id: 'fw-jul', title: 'Wilmslow Festival of Writing', category: 'Community', date: '2026-07-04', startTime: '10:00', endTime: '17:00', location: 'The Guild', address: 'Bourne Street, Wilmslow SK9 5HD', coords: { lat: 53.3265, lng: -2.2285 }, description: 'Celebrating storytelling, creativity and the written word.' },
  { id: 'am-jul', title: 'Wilmslow Artisan Market', category: 'Market', date: '2026-07-18', startTime: '10:00', endTime: '16:00', location: 'Alderley Road', address: 'Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3271, lng: -2.2310 }, description: '120+ artisan traders with food, gifts and handmade goods.' },
  { id: 'climb-jul', title: 'Free Climbing Wall at The Carrs', category: 'Community', date: '2026-07-25', startTime: '10:00', endTime: '16:00', location: 'The Carrs Park', address: 'The Carrs, Wilmslow SK9 5LR', coords: { lat: 53.3215, lng: -2.2255 }, description: 'Free fully-staffed climbing wall for all ages. Funded by Wilmslow Town Council.' },
  { id: 'am-aug', title: 'Wilmslow Artisan Market', category: 'Market', date: '2026-08-15', startTime: '10:00', endTime: '16:00', location: 'Alderley Road', address: 'Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3271, lng: -2.2310 }, description: '120+ artisan traders with food, gifts and handmade goods.' },
  { id: 'sf-aug', title: 'Wilmslow Street Fest', category: 'Food', date: '2026-08-28', startTime: '17:00', endTime: '21:00', location: 'Bank Square', address: 'Bank Square, Wilmslow SK9 1AN', coords: { lat: 53.3283, lng: -2.2290 }, description: 'Street food festival with live music and global cuisine.' },
  { id: 'am-sep', title: 'Wilmslow Artisan Market', category: 'Market', date: '2026-09-19', startTime: '10:00', endTime: '16:00', location: 'Alderley Road', address: 'Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3271, lng: -2.2310 }, description: '120+ artisan traders with food, gifts and handmade goods.' },
  { id: 'am-oct', title: 'Wilmslow Artisan Market', category: 'Market', date: '2026-10-17', startTime: '10:00', endTime: '16:00', location: 'Alderley Road', address: 'Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3271, lng: -2.2310 }, description: '120+ artisan traders with food, gifts and handmade goods.' },
  { id: 'am-nov', title: 'Wilmslow Artisan Market', category: 'Market', date: '2026-11-21', startTime: '10:00', endTime: '16:00', location: 'Alderley Road', address: 'Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3271, lng: -2.2310 }, description: '120+ artisan traders with food, gifts and handmade goods.' },
  { id: 'xmas-nov', title: 'Wilmslow Christmas Lights Switch On', category: 'Festival', date: '2026-11-27', startTime: '16:00', endTime: '20:00', location: 'Bank Square', address: 'Bank Square, Wilmslow SK9 1AN', coords: { lat: 53.3283, lng: -2.2290 }, description: 'Annual Christmas lights ceremony with live entertainment and stalls.' },
  { id: 'am-dec', title: 'Wilmslow Christmas Artisan Market', category: 'Market', date: '2026-12-19', startTime: '10:00', endTime: '16:00', location: 'Alderley Road', address: 'Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3271, lng: -2.2310 }, description: 'Festive edition with 120+ artisan traders, seasonal gifts and treats.' },

  { id: 'cin-1', title: 'The Running Man', category: 'Cinema', date: '2026-02-13', startTime: '14:00', endTime: '16:15', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Action thriller at Rex Cinema Wilmslow.' },
  { id: 'cin-2', title: 'The Running Man', category: 'Cinema', date: '2026-02-13', startTime: '19:30', endTime: '21:45', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Action thriller at Rex Cinema Wilmslow.' },
  { id: 'cin-3', title: 'Wicked: For Good', category: 'Cinema', date: '2026-02-14', startTime: '13:30', endTime: '16:00', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Part 2 of the Broadway musical adaptation at Rex Cinema.' },
  { id: 'cin-4', title: 'Wicked: For Good', category: 'Cinema', date: '2026-02-14', startTime: '19:00', endTime: '21:30', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Part 2 of the Broadway musical adaptation at Rex Cinema.' },
  { id: 'cin-5', title: 'Zootopia 2', category: 'Cinema', date: '2026-02-15', startTime: '10:30', endTime: '12:30', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Animated sequel. Family showing at Rex Cinema.' },
  { id: 'cin-6', title: 'Zootopia 2', category: 'Cinema', date: '2026-02-15', startTime: '14:00', endTime: '16:00', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Animated sequel at Rex Cinema.' },
  { id: 'cin-7', title: 'Now You See Me: Now You Don\'t', category: 'Cinema', date: '2026-02-20', startTime: '17:00', endTime: '19:15', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Magic heist thriller at Rex Cinema.' },
  { id: 'cin-8', title: 'Now You See Me: Now You Don\'t', category: 'Cinema', date: '2026-02-20', startTime: '20:00', endTime: '22:15', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Magic heist thriller at Rex Cinema.' },
  { id: 'cin-9', title: 'Eternity', category: 'Cinema', date: '2026-02-27', startTime: '14:30', endTime: '16:45', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Drama at Rex Cinema Wilmslow.' },
  { id: 'cin-10', title: 'Eternity', category: 'Cinema', date: '2026-02-27', startTime: '19:30', endTime: '21:45', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Drama at Rex Cinema Wilmslow.' },
  { id: 'cin-11', title: 'Mission: Impossible 8', category: 'Cinema', date: '2026-03-13', startTime: '14:00', endTime: '16:30', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Action blockbuster at Rex Cinema.' },
  { id: 'cin-12', title: 'Mission: Impossible 8', category: 'Cinema', date: '2026-03-13', startTime: '19:30', endTime: '22:00', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Action blockbuster at Rex Cinema.' },
  { id: 'cin-13', title: 'Paddington in Peru', category: 'Cinema', date: '2026-04-04', startTime: '11:00', endTime: '13:00', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Family adventure at Rex Cinema.' },
  { id: 'cin-14', title: 'Paddington in Peru', category: 'Cinema', date: '2026-04-04', startTime: '14:30', endTime: '16:30', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Family adventure at Rex Cinema.' },
  { id: 'cin-15', title: 'Jurassic World Rebirth', category: 'Cinema', date: '2026-05-01', startTime: '14:00', endTime: '16:30', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Dinosaur blockbuster at Rex Cinema.' },
  { id: 'cin-16', title: 'Jurassic World Rebirth', category: 'Cinema', date: '2026-05-01', startTime: '19:30', endTime: '22:00', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Dinosaur blockbuster at Rex Cinema.' },
  { id: 'cin-17', title: 'How to Train Your Dragon', category: 'Cinema', date: '2026-06-12', startTime: '11:00', endTime: '13:00', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Live-action remake at Rex Cinema.' },
  { id: 'cin-18', title: 'How to Train Your Dragon', category: 'Cinema', date: '2026-06-12', startTime: '14:30', endTime: '16:30', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Live-action remake at Rex Cinema.' },
  { id: 'cin-19', title: 'Superman', category: 'Cinema', date: '2026-07-10', startTime: '14:00', endTime: '16:30', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'DC superhero reboot at Rex Cinema.' },
  { id: 'cin-20', title: 'Superman', category: 'Cinema', date: '2026-07-10', startTime: '19:30', endTime: '22:00', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'DC superhero reboot at Rex Cinema.' },
  { id: 'cin-21', title: 'Fantastic Four: First Steps', category: 'Cinema', date: '2026-07-24', startTime: '14:00', endTime: '16:15', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Marvel superhero film at Rex Cinema.' },
  { id: 'cin-22', title: 'Fantastic Four: First Steps', category: 'Cinema', date: '2026-07-24', startTime: '19:30', endTime: '21:45', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Marvel superhero film at Rex Cinema.' },
  { id: 'cin-23', title: 'Avatar: Fire and Ash', category: 'Cinema', date: '2026-08-14', startTime: '13:00', endTime: '16:00', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Sci-fi epic at Rex Cinema.' },
  { id: 'cin-24', title: 'Avatar: Fire and Ash', category: 'Cinema', date: '2026-08-14', startTime: '19:00', endTime: '22:00', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Sci-fi epic at Rex Cinema.' },
  { id: 'cin-25', title: 'Toy Story 5', category: 'Cinema', date: '2026-09-05', startTime: '11:00', endTime: '13:00', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Pixar animated sequel at Rex Cinema.' },
  { id: 'cin-26', title: 'Toy Story 5', category: 'Cinema', date: '2026-09-05', startTime: '14:30', endTime: '16:30', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Pixar animated sequel at Rex Cinema.' },
  { id: 'cin-27', title: 'The Conjuring 4', category: 'Cinema', date: '2026-10-09', startTime: '19:30', endTime: '21:45', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Horror film at Rex Cinema. Just in time for Halloween.' },
  { id: 'cin-28', title: 'The Conjuring 4', category: 'Cinema', date: '2026-10-16', startTime: '19:30', endTime: '21:45', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Horror film at Rex Cinema.' },
  { id: 'cin-29', title: 'Frozen 3', category: 'Cinema', date: '2026-11-20', startTime: '11:00', endTime: '13:00', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Disney animated sequel at Rex Cinema.' },
  { id: 'cin-30', title: 'Frozen 3', category: 'Cinema', date: '2026-11-20', startTime: '14:30', endTime: '16:30', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Disney animated sequel at Rex Cinema.' },
  { id: 'cin-31', title: 'Star Wars: New Jedi Order', category: 'Cinema', date: '2026-12-17', startTime: '14:00', endTime: '16:30', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Star Wars saga continues at Rex Cinema.' },
  { id: 'cin-32', title: 'Star Wars: New Jedi Order', category: 'Cinema', date: '2026-12-17', startTime: '19:30', endTime: '22:00', location: 'Rex Cinema', address: '23 Alderley Road, Wilmslow SK9 1HY', coords: { lat: 53.3278, lng: -2.2305 }, description: 'Star Wars saga continues at Rex Cinema.' },
];

function openGoogleMaps(address: string, coords: { lat: number; lng: number }) {
  const url = Platform.select({
    ios: `maps://maps.apple.com/?q=${encodeURIComponent(address)}&ll=${coords.lat},${coords.lng}`,
    android: `geo:${coords.lat},${coords.lng}?q=${encodeURIComponent(address)}`,
    default: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
  });
  Linking.openURL(url as string).catch(() => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
  });
}

export default function LocalEventsScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const [activeFilter, setActiveFilter] = useState<EventCategory | 'All'>('All');
  const [mapModal, setMapModal] = useState<LocalEvent | null>(null);

  const filteredEvents = useMemo(() => {
    const sorted = [...WILMSLOW_EVENTS].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
    if (activeFilter === 'All') return sorted;
    return sorted.filter(e => e.category === activeFilter);
  }, [activeFilter]);

  const groupedByMonth = useMemo(() => {
    const groups: { month: string; events: LocalEvent[] }[] = [];
    let currentLabel = '';
    for (const event of filteredEvents) {
      const d = new Date(event.date);
      const label = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      if (label !== currentLabel) {
        currentLabel = label;
        groups.push({ month: label, events: [] });
      }
      groups[groups.length - 1].events.push(event);
    }
    return groups;
  }, [filteredEvents]);

  function handleBookAfter(event: LocalEvent) {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    router.push('/book-table');
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Local Events</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.subtitle}>
        <Ionicons name="location" size={14} color={Colors.primary} />
        <Text style={styles.subtitleText}>Wilmslow & surrounds</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        <Pressable
          onPress={() => setActiveFilter('All')}
          style={[styles.filterChip, activeFilter === 'All' && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, activeFilter === 'All' && styles.filterTextActive]}>All</Text>
        </Pressable>
        {CATEGORIES.map(cat => (
          <Pressable
            key={cat}
            onPress={() => setActiveFilter(cat)}
            style={[styles.filterChip, activeFilter === cat && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, activeFilter === cat && styles.filterTextActive]}>{cat}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {groupedByMonth.map((group, gi) => (
          <View key={group.month}>
            <Text style={styles.monthLabel}>{group.month}</Text>
            {group.events.map((event, ei) => {
              const cfg = CAT_CONFIG[event.category];
              const eventDate = new Date(event.date);
              return (
                <Animated.View key={event.id + '-' + ei} entering={FadeInDown.delay(Math.min(ei * 40, 300)).duration(400)}>
                  <View style={styles.eventCard}>
                    <View style={styles.eventTop}>
                      <LinearGradient colors={cfg.gradient as [string, string]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.eventDateBlock}>
                        <Text style={styles.eventDay}>{eventDate.getDate()}</Text>
                        <Text style={styles.eventMonth}>{eventDate.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}</Text>
                      </LinearGradient>
                      <View style={styles.eventInfo}>
                        <View style={styles.eventTagRow}>
                          <View style={[styles.eventTag, { backgroundColor: cfg.gradient[0] + '14' }]}>
                            <Ionicons name={cfg.icon as any} size={10} color={cfg.gradient[0]} />
                            <Text style={[styles.eventTagText, { color: cfg.gradient[0] }]}>{event.category}</Text>
                          </View>
                        </View>
                        <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
                        <View style={styles.eventMeta}>
                          <Ionicons name="time-outline" size={12} color={Colors.textSecondary} />
                          <Text style={styles.eventMetaText}>{event.startTime} - {event.endTime}</Text>
                        </View>
                        <Text style={styles.eventDesc} numberOfLines={1}>{event.description}</Text>
                      </View>
                    </View>
                    <View style={styles.eventActions}>
                      <Pressable
                        onPress={() => setMapModal(event)}
                        style={styles.locationBtn}
                      >
                        <Ionicons name="location-outline" size={14} color={Colors.primary} />
                        <Text style={styles.locationText} numberOfLines={1}>{event.location}</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleBookAfter(event)}
                        style={({ pressed }) => [styles.bookAfterBtn, pressed && { opacity: 0.8 }]}
                      >
                        <Ionicons name="restaurant-outline" size={13} color="#FFF" />
                        <Text style={styles.bookAfterText}>Book a table after</Text>
                      </Pressable>
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        ))}
        {filteredEvents.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptyText}>Try a different category filter</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={!!mapModal} transparent animationType="fade" onRequestClose={() => setMapModal(null)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setMapModal(null)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{mapModal?.title}</Text>
            <View style={styles.modalRow}>
              <Ionicons name="location" size={16} color={Colors.primary} />
              <Text style={styles.modalAddress}>{mapModal?.address}</Text>
            </View>
            <View style={styles.modalRow}>
              <Ionicons name="time" size={16} color={Colors.textSecondary} />
              <Text style={styles.modalTime}>{mapModal?.startTime} - {mapModal?.endTime}</Text>
            </View>
            <Pressable
              onPress={() => {
                if (mapModal) {
                  openGoogleMaps(mapModal.address, mapModal.coords);
                  setMapModal(null);
                }
              }}
              style={({ pressed }) => [pressed && { transform: [{ scale: 0.98 }] }]}
            >
              <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.openMapsBtn}>
                <Ionicons name="navigate" size={16} color="#FFF" />
                <Text style={styles.openMapsText}>Open in Maps</Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={() => setMapModal(null)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topTitle: { fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  subtitle: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, marginBottom: 10,
  },
  subtitleText: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  filterRow: { paddingHorizontal: 20, gap: 10, paddingBottom: 16 },
  filterChip: {
    paddingHorizontal: 20, borderRadius: 24,
    backgroundColor: '#FFF', borderWidth: 1.5, borderColor: Colors.border,
    height: 44, justifyContent: 'center' as const, alignItems: 'center' as const,
  },
  filterChipActive: {
    backgroundColor: Colors.primary, borderColor: Colors.primary,
  },
  filterText: { fontSize: 15, lineHeight: 20, fontFamily: 'Poppins_600SemiBold', color: Colors.text, includeFontPadding: false },
  filterTextActive: { color: '#FFF' },
  content: { padding: 20, paddingTop: 6, paddingBottom: 40 },
  monthLabel: {
    fontSize: 16, fontFamily: 'Poppins_700Bold', color: Colors.text, marginTop: 10, marginBottom: 12,
  },
  eventCard: {
    backgroundColor: '#FFF', borderRadius: 18, padding: 14, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  eventTop: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  eventDateBlock: {
    width: 52, height: 60, borderRadius: 14, justifyContent: 'center', alignItems: 'center',
  },
  eventDay: { fontSize: 22, fontFamily: 'Poppins_700Bold', color: '#FFF', lineHeight: 26 },
  eventMonth: { fontSize: 9, fontFamily: 'Poppins_600SemiBold', color: 'rgba(255,255,255,0.8)', letterSpacing: 1 },
  eventInfo: { flex: 1, gap: 3 },
  eventTagRow: { flexDirection: 'row' },
  eventTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
  },
  eventTagText: { fontSize: 10, fontFamily: 'Poppins_600SemiBold' },
  eventTitle: { fontSize: 14, fontFamily: 'Poppins_700Bold', color: Colors.text },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  eventMetaText: { fontSize: 11, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  eventDesc: { fontSize: 11, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  eventActions: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  locationBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1, marginRight: 8,
  },
  locationText: {
    fontSize: 11, fontFamily: 'Poppins_500Medium', color: Colors.primary,
    textDecorationLine: 'underline',
  },
  bookAfterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
  },
  bookAfterText: { fontSize: 11, fontFamily: 'Poppins_600SemiBold', color: '#FFF' },

  emptyState: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyTitle: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: Colors.text },
  emptyText: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },

  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  modalBackdrop: { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 },
  modalContent: {
    width: '85%', backgroundColor: Colors.background, borderRadius: 24, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 30, elevation: 10,
  },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 16,
  },
  modalTitle: { fontSize: 17, fontFamily: 'Poppins_700Bold', color: Colors.text, marginBottom: 14 },
  modalRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  modalAddress: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.text, flex: 1 },
  modalTime: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  openMapsBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: 14, paddingVertical: 14, marginTop: 6,
  },
  openMapsText: { fontSize: 14, fontFamily: 'Poppins_700Bold', color: '#FFF' },
  modalClose: { alignItems: 'center', paddingTop: 14 },
  modalCloseText: { fontSize: 13, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
});
