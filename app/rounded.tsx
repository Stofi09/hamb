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

export default function RoundedSoftScreen() {
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
        placeholderTextColor="#999"
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
        <Text style={styles.couponsHeaderTitle}>🎫 Your Coupons</Text>
        <Text style={styles.couponsHeaderSubtitle}>{COUPONS.length} coupons ready to use</Text>
      </View>

      <FlatList
        data={COUPONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.couponsList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
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
    backgroundColor: '#ECECEC',
  },
  couponBanner: {
    backgroundColor: '#FFD700',
    padding: 14,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  couponText: {
    color: '#2D2D2D',
    fontWeight: '600',
    fontSize: 14,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 14,
    fontSize: 16,
    color: '#2D2D2D',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
    flexGrow: 0,
    flexShrink: 0,
    height: 50,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    height: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: '#3D3D3D',
  },
  categoryText: {
    color: '#666',
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
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  foodImage: {
    width: '100%',
    height: 100,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D2D2D',
    marginTop: 10,
  },
  foodPrice: {
    fontSize: 15,
    color: '#E5B800',
    fontWeight: '700',
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#3D3D3D',
    paddingVertical: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
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
  couponsHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  couponsHeaderSubtitle: {
    fontSize: 14,
    color: '#2D2D2D',
    marginTop: 4,
    opacity: 0.8,
  },
  couponsList: {
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