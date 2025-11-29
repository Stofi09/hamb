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

const NEU_BG = '#D8D8D8';
const CARD_BG = '#E8E8E8';
const DARK_ACCENT = '#3A3A3A';

type Tab = 'home' | 'coupons' | 'cart' | 'profile';

export default function NeumorphicScreen() {
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
          placeholderTextColor="#888"
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
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: foodImages[item.id] || 'https://via.placeholder.com/150' }}
              style={styles.foodImage}
            />
          </View>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.foodPrice}>{item.price}</Text>
        </TouchableOpacity>
      )}
    />
  );

  const renderCouponsHeader = () => (
    <View style={styles.couponsHeader}>
      <Text style={styles.couponsHeaderTitle}>🎫 Coupons</Text>
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
    <View style={styles.container}>
      {renderContent()}

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
          <View style={[styles.navIconContainer, activeTab === 'home' && styles.navIconContainerActive]}>
            <Text style={styles.navIcon}>🏠</Text>
          </View>
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('coupons')}>
          <View style={[styles.navIconContainer, activeTab === 'coupons' && styles.navIconContainerActive]}>
            <Text style={styles.navIcon}>🎫</Text>
          </View>
          <Text style={[styles.navText, activeTab === 'coupons' && styles.navTextActive]}>Coupons</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('cart')}>
          <View style={[styles.navIconContainer, activeTab === 'cart' && styles.navIconContainerActive]}>
            <Text style={styles.navIcon}>🛒</Text>
          </View>
          <Text style={[styles.navText, activeTab === 'cart' && styles.navTextActive]}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('profile')}>
          <View style={[styles.navIconContainer, activeTab === 'profile' && styles.navIconContainerActive]}>
            <Text style={styles.navIcon}>👤</Text>
          </View>
          <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEU_BG,
  },
  couponBanner: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    shadowColor: '#A0A0A0',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
    padding: 14,
    alignItems: 'center',
  },
  couponText: {
    color: '#2D2D2D',
    fontWeight: '700',
    fontSize: 14,
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: CARD_BG,
    padding: 14,
    fontSize: 16,
    color: '#2D2D2D',
    borderRadius: 25,
    shadowColor: '#A0A0A0',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
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
    backgroundColor: CARD_BG,
    borderRadius: 12,
    justifyContent: 'center',
    height: 44,
    shadowColor: '#A0A0A0',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  categoryButtonActive: {
    backgroundColor: DARK_ACCENT,
  },
  categoryText: {
    color: '#555',
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
    backgroundColor: CARD_BG,
    margin: 10,
    padding: 14,
    borderRadius: 20,
    shadowColor: '#A0A0A0',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },
  imageContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  foodImage: {
    width: '100%',
    height: 100,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK_ACCENT,
    marginTop: 12,
  },
  foodPrice: {
    fontSize: 15,
    color: '#C9A800',
    fontWeight: '800',
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: DARK_ACCENT,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  navIconContainerActive: {
    backgroundColor: '#FFD700',
  },
  navIcon: {
    fontSize: 18,
  },
  navText: {
    color: '#E0E0E0',
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
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    shadowColor: '#A0A0A0',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  couponsHeaderTitle: {
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
  couponsList: {
    padding: 16,
    paddingTop: 0,
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
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    color: '#888',
  },
});