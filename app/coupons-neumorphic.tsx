import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

const COUPONS = [
  { id: '1', code: 'DEMO20', discount: '20% OFF', description: 'On all orders', expiry: '2025-12-31', minOrder: '€15' },
  { id: '2', code: 'BURGER5', discount: '€5 OFF', description: 'On any burger', expiry: '2025-06-30', minOrder: '€10' },
  { id: '3', code: 'FREEDELIVERY', discount: 'Free Delivery', description: 'No minimum order', expiry: '2025-07-15', minOrder: '€0' },
  { id: '4', code: 'PIZZA30', discount: '30% OFF', description: 'On all pizzas', expiry: '2025-08-01', minOrder: '€20' },
  { id: '5', code: 'WELCOME10', discount: '€10 OFF', description: 'First order only', expiry: '2025-12-31', minOrder: '€25' },
];

const NEU_BG = '#D8D8D8';
const CARD_BG = '#E8E8E8';
const DARK_ACCENT = '#3A3A3A';

export default function CouponsNeumorphicScreen() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (code: string, id: string) => {
    await Clipboard.setStringAsync(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderCoupon = ({ item }: { item: typeof COUPONS[0] }) => (
    <View style={styles.couponCard}>
      <View style={styles.couponHeader}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>

      <View style={styles.couponBody}>
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>CODE</Text>
          <Text style={styles.codeText}>{item.code}</Text>
        </View>

        <TouchableOpacity
          style={[styles.copyButton, copiedId === item.id && styles.copyButtonPressed]}
          onPress={() => handleCopy(item.code, item.id)}
        >
          <Text style={[styles.copyButtonText, copiedId === item.id && styles.copyButtonTextPressed]}>
            {copiedId === item.id ? '✓ Copied' : 'Copy'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.couponFooter}>
        <Text style={styles.footerText}>Valid until {item.expiry}</Text>
        <Text style={styles.footerText}>Min. order: {item.minOrder}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎫 Coupons</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEU_BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    shadowColor: '#A0A0A0',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: DARK_ACCENT,
  },
  countBadge: {
    backgroundColor: DARK_ACCENT,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: '#FFD700',
    fontWeight: '700',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  couponCard: {
    backgroundColor: CARD_BG,
    marginBottom: 16,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#A0A0A0',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  discountBadge: {
    backgroundColor: DARK_ACCENT,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#A0A0A0',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 4,
  },
  discountText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFD700',
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 12,
    fontWeight: '500',
  },
  couponBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  codeContainer: {
    flex: 1,
    backgroundColor: NEU_BG,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 2,
  },
  codeLabel: {
    fontSize: 10,
    color: '#888',
    fontWeight: '600',
    letterSpacing: 1,
  },
  codeText: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK_ACCENT,
    letterSpacing: 2,
    marginTop: 4,
  },
  copyButton: {
    backgroundColor: CARD_BG,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#A0A0A0',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  copyButtonPressed: {
    backgroundColor: '#D0D0D0',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  copyButtonText: {
    color: DARK_ACCENT,
    fontWeight: '700',
    fontSize: 14,
  },
  copyButtonTextPressed: {
    color: '#4CAF50',
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#CCC',
  },
  footerText: {
    fontSize: 11,
    color: '#777',
    fontWeight: '500',
  },
});