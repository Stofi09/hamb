import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

const COUPONS = [
  { id: '1', code: 'DEMO20', discount: '20% OFF', description: 'On all orders', expiry: '2025-12-31', minOrder: '€15' },
  { id: '2', code: 'BURGER5', discount: '€5 OFF', description: 'On any burger', expiry: '2025-06-30', minOrder: '€10' },
  { id: '3', code: 'FREEDELIVERY', discount: 'Free Delivery', description: 'No minimum order', expiry: '2025-07-15', minOrder: '€0' },
  { id: '4', code: 'PIZZA30', discount: '30% OFF', description: 'On all pizzas', expiry: '2025-08-01', minOrder: '€20' },
  { id: '5', code: 'WELCOME10', discount: '€10 OFF', description: 'First order only', expiry: '2025-12-31', minOrder: '€25' },
];

export default function CouponsFlatScreen() {
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
      <View style={styles.couponRight}>
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{item.code}</Text>
        </View>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => handleCopy(item.code, item.id)}
        >
          <Text style={styles.copyButtonText}>
            {copiedId === item.id ? 'Copied!' : 'Copy'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.expiryText}>Valid until {item.expiry}</Text>
        <Text style={styles.minOrderText}>Min. order: {item.minOrder}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Coupons</Text>
        <Text style={styles.headerSubtitle}>{COUPONS.length} coupons available</Text>
      </View>

      <FlatList
        data={COUPONS}
        keyExtractor={(item) => item.id}
        renderItem={renderCoupon}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFD700',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#2D2D2D',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  couponCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  couponLeft: {
    flex: 1,
    backgroundColor: '#2D2D2D',
    padding: 16,
    justifyContent: 'center',
  },
  discountText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
  },
  descriptionText: {
    fontSize: 12,
    color: '#F5F5F5',
    marginTop: 4,
  },
  couponRight: {
    flex: 1.5,
    padding: 16,
  },
  codeContainer: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2D2D',
    letterSpacing: 1,
  },
  copyButton: {
    backgroundColor: '#2D2D2D',
    padding: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  copyButtonText: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 14,
  },
  expiryText: {
    fontSize: 11,
    color: '#888',
    marginTop: 8,
  },
  minOrderText: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
});