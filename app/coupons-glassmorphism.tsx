import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';

const COUPONS = [
  { id: '1', code: 'DEMO20', discount: '20% OFF', description: 'On all orders', expiry: '2025-12-31', minOrder: '€15' },
  { id: '2', code: 'BURGER5', discount: '€5 OFF', description: 'On any burger', expiry: '2025-06-30', minOrder: '€10' },
  { id: '3', code: 'FREEDELIVERY', discount: 'Free Delivery', description: 'No minimum order', expiry: '2025-07-15', minOrder: '€0' },
  { id: '4', code: 'PIZZA30', discount: '30% OFF', description: 'On all pizzas', expiry: '2025-08-01', minOrder: '€20' },
  { id: '5', code: 'WELCOME10', discount: '€10 OFF', description: 'First order only', expiry: '2025-12-31', minOrder: '€25' },
];

export default function CouponsGlassmorphismScreen() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (code: string, id: string) => {
    await Clipboard.setStringAsync(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderCoupon = ({ item }: { item: typeof COUPONS[0] }) => (
    <View style={styles.couponCard}>
      <View style={styles.couponLeft}>
        <Text style={styles.discountText}>{item.discount}</Text>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>

      <View style={styles.couponDivider} />

      <View style={styles.couponRight}>
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>PROMO CODE</Text>
          <Text style={styles.codeText}>{item.code}</Text>
        </View>

        <TouchableOpacity
          style={[styles.copyButton, copiedId === item.id && styles.copyButtonCopied]}
          onPress={() => handleCopy(item.code, item.id)}
        >
          <Text style={styles.copyButtonText}>
            {copiedId === item.id ? '✓ Copied!' : 'Copy Code'}
          </Text>
        </TouchableOpacity>

        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>Until {item.expiry}</Text>
          <Text style={styles.detailText}>Min: {item.minOrder}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Decorative circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🎫 Your Coupons</Text>
          <Text style={styles.headerSubtitle}>Save big on your next order!</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{COUPONS.length}</Text>
        </View>
      </View>

      <FlatList
        data={COUPONS}
        keyExtractor={(item) => item.id}
        renderItem={renderCoupon}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFD700',
    opacity: 0.12,
    top: -50,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFD700',
    opacity: 0.08,
    bottom: 200,
    left: -40,
  },
  circle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    opacity: 0.1,
    top: 300,
    right: -20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 16,
    padding: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#1a1a2e',
    marginTop: 4,
    opacity: 0.8,
  },
  countBadge: {
    backgroundColor: '#1a1a2e',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: '#FFD700',
    fontWeight: '700',
    fontSize: 18,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  couponCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  couponLeft: {
    flex: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    padding: 18,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
  discountText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFD700',
  },
  descriptionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 6,
  },
  couponDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  couponRight: {
    flex: 1.6,
    padding: 16,
  },
  codeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    letterSpacing: 1,
  },
  codeText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginTop: 4,
  },
  copyButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  copyButtonCopied: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  copyButtonText: {
    color: '#FFD700',
    fontWeight: '700',
    fontSize: 13,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  detailText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
  },
});