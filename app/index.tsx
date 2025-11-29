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

type Tab = 'home' | 'coupons' | 'cart' | 'profile';

export default function FlatMinimalScreen() {
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

  const renderHomeContent = () => (
    <>
      <View style={styles.couponBanner}>
        <Text style={styles.couponText}>🎫 Use code DEMO20 for 20% off!</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search food..."
        placeholderTextColor="#888"
      />

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

      <FlatList
        data={filteredItems}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.foodGrid}
        style={{ flex: 1 }}
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
    </>
  );

  const renderCouponsContent = () => (
    <>
      <View style={styles.couponsHeader}>
        <Text style={styles.couponsHeaderTitle}>Available Coupons</Text>
        <Text style={styles.couponsHeaderSubtitle}>{COUPONS.length} coupons available</Text>
      </View>

      <FlatList
        data={COUPONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.couponsList}
        renderItem={({ item }) => (
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
        )}
      />
    </>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  couponBanner: {
    backgroundColor: '#FFD700',
    padding: 12,
    alignItems: 'center',
  },
  couponText: {
    color: '#2D2D2D',
    fontWeight: '600',
    fontSize: 14,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 12,
    fontSize: 16,
    color: '#2D2D2D',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
    flexGrow: 0,
    flexShrink: 0,
    height: 35,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    height: 36,
  },
  categoryButtonActive: {
    backgroundColor: '#2D2D2D',
  },
  categoryText: {
    color: '#2D2D2D',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFD700',
  },
  foodGrid: {
    padding: 8,
  },
  foodCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  foodImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#E0E0E0',
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D2D2D',
    marginTop: 8,
  },
  foodPrice: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '700',
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#2D2D2D',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#404040',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navIcon: {
    fontSize: 20,
  },
  navText: {
    color: '#F5F5F5',
    fontSize: 12,
    marginTop: 2,
  },
  navTextActive: {
    color: '#FFD700',
  },
  // Coupons styles
  couponsHeader: {
    backgroundColor: '#FFD700',
    padding: 16,
  },
  couponsHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  couponsHeaderSubtitle: {
    fontSize: 14,
    color: '#2D2D2D',
    marginTop: 4,
  },
  couponsList: {
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