import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import React, { useContext, useMemo, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import Header from "../src/Header";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Category from "../src/Category";
import ProductCard from "../src/ProductCard";
import data from "../src/data/data.json";
import { WishlistContext } from "../src/context/WishlistContext";

const categories = ["Trending Now", "All", "New", "Men", "Women"];

export default function Homescreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  const products = useMemo(() => {
    return data.products.map(product => ({
      ...product,
      isLiked: wishlist.some(item => item.id === product.id),
    }));
  }, [wishlist]);

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.categories?.includes(selectedCategory);

    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <LinearGradient
      colors={["#e5d8db", "#e1d4d5", "#e4d6d6"]}
      style={styles.linearGradient}
    >
      <Header />

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <>
            <Text style={styles.matchText}>
              <Text style={styles.appName}>Zivora</Text>
              <Text> - Match Your Style</Text>
            </Text>

            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <FontAwesome
                  name="search"
                  size={22}
                  color="#A49898"
                />
              </View>

              <TextInput
                style={styles.textInput}
                placeholder="Search products..."
                placeholderTextColor="#8A8A8A"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <FlatList
              data={categories}
              renderItem={({ item }) => (
                <Category
                  item={item}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              )}
              keyExtractor={item => item}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </>
        }
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            handleLiked={toggleWishlist}
          />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found.</Text>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },

  matchText: {
    fontSize: 20,
    color: "#000000",
    marginTop: 25,
  },

  appName: {
    fontSize: 28,
    fontWeight: "600",
    color: "#E55B5B",
  },

  inputContainer: {
    backgroundColor: "white",
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#222222",
  },

  iconContainer: {
    marginHorizontal: 15,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 17,
    color: "#757575",
  },
});