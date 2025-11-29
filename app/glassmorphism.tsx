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

const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Salads', 'Desserts'];

const FOOD_ITEMS = [
  { id: '1', name: 'Classic Burger', price: '€8.99', category: 'Burgers' },
  { id: '2', name: 'Pepperoni Pizza', price: '€12.99', category: 'Pizza' },
  { id: '3', name: 'Caesar Salad', price: '€7.49', category: 'Salads' },
  { id: '4', name: 'Chocolate Cake', price: '€5.99', category: 'Desserts' },
  { id: '5', name: 'Cheese Burger', price: '€9.49', category: 'Burgers' },
  { id: '6', name: 'Margherita', price: '€10.99', category: 'Pizza' },
];

export default function GlassmorphismScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [foodImages, setFoodImages] = useState<Record<string, string>>({});

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

  const renderHeader = () => (
    <>
      {/* Coupon Banner */}
      <View style={styles.couponBanner}>
        <Text style={styles.couponText}>🎫 Use code DEMO20 for 20% off!</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search food..."
          placeholderTextColor="rgba(255,255,255,0.6)"
        />
      </View>

      {/* Categories */}
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

      {/* Scrollable Content */}
      <FlatList
        data={filteredItems}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.foodGrid}
        ListHeaderComponent={renderHeader}
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🎫</Text>
          <Text style={styles.navText}>Coupons</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🛒</Text>
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
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
});