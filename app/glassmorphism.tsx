import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';

const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Salads', 'Desserts'];

const FOOD_ITEMS = [
  { id: '1', name: 'Classic Burger', price: '€8.99', category: 'Burgers' },
  { id: '2', name: 'Pepperoni Pizza', price: '€12.99', category: 'Pizza' },
  { id: '3', name: 'Caesar Salad', price: '€7.49', category: 'Salads' },
  { id: '4', name: 'Chocolate Cake', price: '€5.99', category: 'Desserts' },
  { id: '5', name: 'Cheese Burger', price: '€9.49', category: 'Burgers' },
  { id: '6', name: 'Margherita', price: '€10.99', category: 'Pizza' },
];

const COUPONS = [
  { id: '1', code: 'DEMO20', discount: '20% OFF', description: 'On all orders', expiry: '2025-12-31', minOrder: '€15' },
  { id: '2', code: 'BURGER5', discount: '€5 OFF', description: 'On any burger', expiry: '2025-06-30', minOrder: '€10' },
  { id: '3', code: 'FREEDELIVERY', discount: 'Free Delivery', description: 'No minimum order', expiry: '2025-07-15', minOrder: '€0' },
  { id: '4', code: 'PIZZA30', discount: '30% OFF', description: 'On all pizzas', expiry: '2025-08-01', minOrder: '€20' },
  { id: '5', code: 'WELCOME10', discount: '€10 OFF', description: 'First order only', expiry: '2025-12-31', minOrder: '€25' },
];

type Tab = 'home' | 'coupons' | 'cart' | 'profile';

export default function GlassmorphismScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodImages, setFoodImages] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    FOOD_ITEMS.forEach((item) => {
      fetch('https://foodish-api.com/api/')
        .then((res) => res.json())
        .then((data) => {
          setFoodImages((prev) => ({ ...prev, [item.id]: data.image }));
        })
        .catch(() => {});
    });
  }, []);

  const filteredItems =
    selectedCategory === 'All'
      ? FOOD_ITEMS
      : FOOD_ITEMS.filter((item) => item.category === selectedCategory);

  const handleCopy = async (code: string, id: string) => {
    await Clipboard.setStringAsync(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderHomeHeader = () => (
    <>
      <View style={styles.couponBanner}>
        <Text style={styles.couponText}>🎫 Use code DEMO20 for 20% off!</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search food..."
          placeholderTextColor="rgba(255,255,255,0.6)"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );

  const renderHomeContent = () => (
    <FlatList
      key="food-grid"
      data={filteredItems}
      numColumns={2}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.foodGrid}
      ListHeaderComponent={renderHomeHeader}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.foodCard}>
          <Image
            source={{ uri: foodImages[item.id] || 'https://via.placeholder.com/150' }}
            style={styles.foodImage}
          />
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.foodPrice}>{item.price}</Text>
        </TouchableOpacity>
      )}
    />
  );

  const renderCouponsHeader = () => (
    <View style={styles.couponsHeader}>
      <View style={styles.couponsHeaderContent}>
        <Text style={styles.couponsHeaderTitle}>🎫 Your Coupons</Text>
        <Text style={styles.couponsHeaderSubtitle}>Save big on your next order!</Text>
      </View>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{COUPONS.length}</Text>
      </View>
    </View>
  );

  const renderCouponsContent = () => (
    <FlatList
      key="coupons-list"
      data={COUPONS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.couponsList}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={renderCouponsHeader}
      renderItem={({ item }) => (
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
      )}
    />
  );

  const renderPlaceholder = (title: string) => (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>{title}</Text>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'coupons':
        return renderCouponsContent();
      case 'cart':
        return renderPlaceholder('Cart');
      case 'profile':
        return renderPlaceholder('Profile');
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      {renderContent()}

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('coupons')}>
          <Text style={styles.navIcon}>🎫</Text>
          <Text style={[styles.navText, activeTab === 'coupons' && styles.navTextActive]}>Coupons</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('cart')}>
          <Text style={styles.navIcon}>🛒</Text>
          <Text style={[styles.navText, activeTab === 'cart' && styles.navTextActive]}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('profile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    opacity: 0.15,
    top: -50,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFD700',
    opacity: 0.1,
    bottom: 100,
    left: -30,
  },
  couponBanner: {
    margin: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    alignItems: 'center',
  },
  couponText: {
    color: '#1a1a2e',
    fontWeight: '700',
    fontSize: 14,
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 14,
    fontSize: 16,
    color: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    flexGrow: 0,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  categoryText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFD700',
  },
  foodGrid: {
    padding: 8,
    paddingBottom: 16,
  },
  foodCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 10,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  foodImage: {
    width: '100%',
    height: 100,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  foodName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
  },
  foodPrice: {
    fontSize: 15,
    color: '#FFD700',
    fontWeight: '800',
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
  },
  navText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
  navTextActive: {
    color: '#FFD700',
  },
  // Coupons styles
  couponsHeader: {
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
  couponsHeaderContent: {
    flex: 1,
  },
  couponsHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  couponsHeaderSubtitle: {
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
  couponsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 0,
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
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});