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

const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Salads', 'Desserts'];

const FOOD_ITEMS = [
  { id: '1', name: 'Classic Burger', price: '€8.99', category: 'Burgers' },
  { id: '2', name: 'Pepperoni Pizza', price: '€12.99', category: 'Pizza' },
  { id: '3', name: 'Caesar Salad', price: '€7.49', category: 'Salads' },
  { id: '4', name: 'Chocolate Cake', price: '€5.99', category: 'Desserts' },
  { id: '5', name: 'Cheese Burger', price: '€9.49', category: 'Burgers' },
  { id: '6', name: 'Margherita', price: '€10.99', category: 'Pizza' },
];

export default function FlatMinimalScreen() {
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

  return (
    <View style={styles.container}>
      {/* Coupon Banner */}
      <View style={styles.couponBanner}>
        <Text style={styles.couponText}>🎫 Use code DEMO20 for 20% off!</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search food..."
        placeholderTextColor="#888"
      />

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

      {/* Food Items Grid */}
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
});