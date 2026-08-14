import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute } from "@react-navigation/native";

const OrderSuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const orderId = route.params?.orderId;

  return (
    <LinearGradient
      colors={["#e5d8db", "#e1d4d5", "#e4d6d6"]}
      style={styles.container}
    >
      <View style={styles.iconCircle}>
        <FontAwesome name="check" size={45} color="#FFFFFF" />
      </View>

      <Text style={styles.title}>Order Placed!</Text>

      <Text style={styles.message}>
        Your order has been saved successfully.
      </Text>

      <Text style={styles.orderId}>Order ID: {orderId}</Text>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() =>
          navigation.navigate("MAIN_APP", {
            screen: "HOME_STACK",
          })
        }
      >
        <Text style={styles.homeButtonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default OrderSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  iconCircle: {
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#43A047",
  },

  title: {
    color: "#333333",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 25,
  },

  message: {
    color: "#757575",
    fontSize: 17,
    textAlign: "center",
    marginTop: 10,
  },

  orderId: {
    color: "#555555",
    fontSize: 15,
    marginTop: 12,
  },

  homeButton: {
    backgroundColor: "#E55B5B",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 35,
    marginTop: 35,
  },

  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});