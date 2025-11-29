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

export default function CouponsRoundedScreen() {
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
      <View style={styles.divider}>
        <View style={styles.cutoutTop} />
        <View style={styles.dashedLine} />
        <View style={styles.cutoutBottom} />
      </View>
      <View style={styles.couponRight}>
        <View style={styles.codeContainer}>
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
        <Text style={styles.expiryText}>Valid until {item.expiry}</Text>
        <Text style={styles.minOrderText}>Min. order: {item.minOrder}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎫 Your Coupons</Text>
        <Text style={styles.headerSubtitle}>{COUPONS.length} coupons ready to use</Text>
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
    backgroundColor: '#ECECEC',
  },
  header: {
    backgroundColor: '#FFD700',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#2D2D2D',
    marginTop: 4,
    opacity: 0.8,
  },
  listContainer: {
    padding: 16,
  },
  couponCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  couponLeft: {
    flex: 1,
    backgroundColor: '#3D3D3D',
    padding: 16,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  discountText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFD700',
  },
  descriptionText: {
    fontSize: 12,
    color: '#F5F5F5',
    marginTop: 6,
  },
  divider: {
    width: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cutoutTop: {
    position: 'absolute',
    top: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ECECEC',
  },
  cutoutBottom: {
    position: 'absolute',
    bottom: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ECECEC',
  },
  dashedLine: {
    width: 1,
    height: '60%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  couponRight: {
    flex: 1.5,
    padding: 16,
  },
  codeContainer: {
    backgroundColor: '#F8F8F8',
    padding: 10,
    borderRadius: 12,
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
    backgroundColor: '#3D3D3D',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  copyButtonCopied: {
    backgroundColor: '#4CAF50',
  },
  copyButtonText: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 14,
  },
  expiryText: {
    fontSize: 11,
    color: '#888',
    marginTop: 10,
  },
  minOrderText: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
});