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

const NEU_BG = '#D8D8D8';
const CARD_BG = '#F0F0F0';
const DARK_ACCENT = '#3A3A3A';

export default function NeumorphicScreen() {
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
          placeholderTextColor="#888"
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
    <View style={styles.container}>
      {/* Scrollable Content */}
      <FlatList
        data={filteredItems}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.foodGrid}
        ListHeaderComponent={renderHeader}
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconContainer}>
            <Text style={styles.navIcon}>🏠</Text>
          </View>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconContainer}>
            <Text style={styles.navIcon}>🎫</Text>
          </View>
          <Text style={styles.navText}>Coupons</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconContainer}>
            <Text style={styles.navIcon}>🛒</Text>
          </View>
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconContainer}>
            <Text style={styles.navIcon}>👤</Text>
          </View>
          <Text style={styles.navText}>Profile</Text>
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
  navIcon: {
    fontSize: 18,
  },
  navText: {
    color: '#E0E0E0',
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
});