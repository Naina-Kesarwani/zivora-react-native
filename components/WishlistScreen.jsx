import React, { useContext, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import Header from "../src/Header";
import ProductCard from "../src/ProductCard";
import { WishlistContext } from "../src/context/WishlistContext";

const WishlistScreen = () => {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  const wishlistProducts = useMemo(
    () => wishlist.map(item => ({ ...item, isLiked: true })),
    [wishlist]
  );

  return (
    <LinearGradient
      colors={["#e5d8db", "#e1d4d5", "#e4d6d6"]}
      style={styles.container}
    >
      <Header title="My Wishlist" />

      <FlatList
        data={wishlistProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            handleLiked={toggleWishlist}
          />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="heart-o" size={42} color="#E55B5B" />
            <Text style={styles.emptyTitle}>
              Your wishlist is empty
            </Text>
            <Text style={styles.emptyText}>
              Heart products on the Home screen to save them here.
            </Text>
          </View>
        }
      />
    </LinearGradient>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },

  listContent: {
    paddingBottom: 40,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
    paddingHorizontal: 30,
  },

  emptyTitle: {
    color: "#333333",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 15,
  },

  emptyText: {
    color: "#757575",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },
});