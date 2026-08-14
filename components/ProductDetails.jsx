import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import Header from "../src/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CartContext } from "../src/context/CardContext";

const sizes = ["S", "M", "L", "XL"];
const colorsArray = [
  "white",
  "red",
  "blue",
  "yellow",
  "green",
  "black",
];

export default function ProductDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { addToCart } = useContext(CartContext);

  const item = route.params?.item;

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No product selected</Text>
      </View>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      Alert.alert(
        "Choose options",
        "Please select both a size and colour."
      );
      return;
    }

    const cartItem = {
      ...item,
      size: selectedSize,
      color: selectedColor,
      cartItemId: `${item.id}-${selectedSize}-${selectedColor}`,
    };

    await addToCart(cartItem);

    navigation.navigate("CART");
  };

  return (
    <LinearGradient
      colors={["#e5d8db", "#e1d4d5", "#e4d6d6"]}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Header />
      </View>

      <Image source={{ uri: item.image }} style={styles.coverImage} />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>

      <Text style={[styles.title, styles.sizeText]}>Size</Text>

      <View style={styles.sizeContainer}>
        {sizes.map(size => (
          <TouchableOpacity
            key={size}
            style={[
              styles.sizeValueContainer,
              selectedSize === size && styles.selectedSize,
            ]}
            onPress={() => setSelectedSize(size)}
          >
            <Text
              style={[
                styles.sizeValue,
                selectedSize === size && styles.selectedSizeText,
              ]}
            >
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.title, styles.colorText]}>Colours</Text>

      <View style={styles.colorContainer}>
        {colorsArray.map(color => (
          <TouchableOpacity
            key={color}
            onPress={() => setSelectedColor(color)}
            style={[
              styles.circleBorder,
              selectedColor === color && {
                borderColor: "#E55858",
                borderWidth: 2,
              },
            ]}
          >
            <View
              style={[
                styles.circle,
                { backgroundColor: color },
                color === "white" && styles.whiteCircle,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleAddToCart}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  coverImage: {
    height: 365,
    width: "100%",
  },

  headerContainer: {
    padding: 20,
    marginTop: -20,
  },

  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 16,
  },

  title: {
    fontSize: 20,
    color: "#444444",
    fontWeight: "500",
  },

  price: {
    color: "#4D4C4C",
    fontSize: 18,
    fontWeight: "600",
  },

  sizeText: {
    marginHorizontal: 20,
  },

  sizeContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
  },

  sizeValue: {
    fontSize: 18,
    fontWeight: "600",
  },

  sizeValueContainer: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },

  selectedSize: {
    backgroundColor: "#E55B5B",
  },

  selectedSizeText: {
    color: "#FFFFFF",
  },

  colorText: {
    marginHorizontal: 20,
    marginTop: 16,
  },

  circle: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },

  whiteCircle: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
  },

  colorContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
  },

  circleBorder: {
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: "transparent",
  },

  button: {
    backgroundColor: "#E55B5B",
    padding: 10,
    margin: 10,
    borderRadius: 20,
    marginTop: 25,
  },

  buttonText: {
    fontSize: 24,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    fontSize: 18,
    color: "#E55B5B",
  },
});