import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "@react-native-vector-icons/fontawesome";

const CartCard = ({
  item,
  deleteItemFromCart,
  updateItemQuantity,
}) => {
  const quantity = item.quantity || 1;
  const itemTotal = Number(item.price) * quantity;

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.coverImage} />

      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.price}>
          ${Number(item.price).toFixed(2)} each
        </Text>

        <View style={styles.circleSizeContainer}>
          <View
            style={[
              styles.circle,
              { backgroundColor: item.color || "#FFFFFF" },
            ]}
          />

          <View style={styles.sizeCircle}>
            <Text style={styles.sizeText}>{item.size}</Text>
          </View>
        </View>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateItemQuantity(item.cartItemId, -1)}
          >
            <FontAwesome name="minus" size={14} color="#E55858" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateItemQuantity(item.cartItemId, 1)}
          >
            <FontAwesome name="plus" size={14} color="#E55858" />
          </TouchableOpacity>

          <Text style={styles.itemTotal}>
            ${itemTotal.toFixed(2)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItemFromCart(item.cartItemId)}
      >
        <FontAwesome name="trash" color="#E55858" size={22} />
      </TouchableOpacity>
    </View>
  );
};

export default CartCard;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  coverImage: {
    height: 125,
    width: "25%",
    borderRadius: 20,
    resizeMode: "cover",
  },

  cardContent: {
    flex: 1,
    marginHorizontal: 12,
  },

  title: {
    fontSize: 18,
    color: "#444444",
    fontWeight: "500",
  },

  price: {
    color: "#797979",
    marginVertical: 8,
    fontSize: 15,
  },

  circleSizeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  circle: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },

  sizeCircle: {
    backgroundColor: "#FFFFFF",
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  sizeText: {
    fontSize: 15,
    fontWeight: "500",
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  quantityButton: {
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  quantityText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333333",
    width: 32,
    textAlign: "center",
  },

  itemTotal: {
    marginLeft: "auto",
    fontSize: 16,
    fontWeight: "700",
    color: "#333333",
  },

  deleteButton: {
    padding: 10,
  },
});