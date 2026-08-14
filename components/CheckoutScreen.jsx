import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "@react-native-firebase/auth";

import Header from "../src/Header";
import { CartContext } from "../src/context/CardContext";

const COUPONS = {
  ZIVORA10: 10,
  WELCOME20: 20,
};

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { carts, totalPrice, clearCart } = useContext(CartContext);

  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [checkingOffer, setCheckingOffer] = useState(true);

  const [couponText, setCouponText] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const user = getAuth().currentUser;

  const locationsKey = user
    ? `zivora_profile_locations_${user.uid}`
    : null;

  const ordersKey = user
    ? `zivora_orders_${user.uid}`
    : "zivora_guest_orders";

  const subtotal = Number(totalPrice) || 0;

  const discountPercentage = isFirstOrder
    ? 20
    : appliedCoupon
      ? COUPONS[appliedCoupon]
      : 0;

  const discountAmount =
    (subtotal * discountPercentage) / 100;

  const grandTotal = Math.max(0, subtotal - discountAmount);

  useEffect(() => {
    const loadLocations = async () => {
      if (!locationsKey) {
        setLoadingLocations(false);
        return;
      }

      try {
        const savedLocations = await AsyncStorage.getItem(
          locationsKey
        );

        const parsedLocations = savedLocations
          ? JSON.parse(savedLocations)
          : [];

        setLocations(parsedLocations);

        if (parsedLocations.length > 0) {
          setSelectedLocationId(parsedLocations[0].id);
        }
      } catch (error) {
        Alert.alert("Error", "Could not load saved locations.");
      } finally {
        setLoadingLocations(false);
      }
    };

    loadLocations();
  }, [locationsKey]);

  useEffect(() => {
    const checkFirstOrder = async () => {
      try {
        const savedOrders = await AsyncStorage.getItem(ordersKey);
        const orders = savedOrders ? JSON.parse(savedOrders) : [];

        setIsFirstOrder(orders.length === 0);
      } catch (error) {
        setIsFirstOrder(false);
      } finally {
        setCheckingOffer(false);
      }
    };

    checkFirstOrder();
  }, [ordersKey]);

  const handleApplyCoupon = () => {
    if (isFirstOrder) {
      Alert.alert(
        "First order offer active",
        "Your automatic 20% first-order discount is already applied."
      );
      return;
    }

    const couponCode = couponText.trim().toUpperCase();

    if (!couponCode) {
      Alert.alert(
        "Enter a coupon",
        "Enter a promo code before applying it."
      );
      return;
    }

    if (!COUPONS[couponCode]) {
      setAppliedCoupon(null);

      Alert.alert(
        "Invalid coupon",
        "Try ZIVORA10 or WELCOME20."
      );
      return;
    }

    setAppliedCoupon(couponCode);
    setCouponText(couponCode);

    Alert.alert(
      "Coupon applied",
      `${COUPONS[couponCode]}% discount was applied.`
    );
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponText("");
  };

  const handlePlaceOrder = async () => {
    if (carts.length === 0) {
      Alert.alert("Cart is empty", "Add products before checkout.");
      return;
    }

    const selectedLocation = locations.find(
      location => location.id === selectedLocationId
    );

    if (!selectedLocation) {
      Alert.alert(
        "Select a location",
        "Please add and select a saved delivery location first."
      );
      return;
    }

    try {
      setPlacingOrder(true);

      const savedOrders = await AsyncStorage.getItem(ordersKey);
      const orders = savedOrders ? JSON.parse(savedOrders) : [];

      const newOrder = {
        id: `ZIV-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "Placed",
        location: selectedLocation.name,
        items: carts,
        subtotal,
        discountPercentage,
        discountAmount,
        discountType: isFirstOrder
          ? "FIRST_ORDER"
          : appliedCoupon
            ? "COUPON"
            : null,
        couponCode: isFirstOrder ? null : appliedCoupon,
        total: grandTotal,
      };

      await AsyncStorage.setItem(
        ordersKey,
        JSON.stringify([newOrder, ...orders])
      );

      await clearCart();

      navigation.replace("ORDER_SUCCESS", {
        orderId: newOrder.id,
      });
    } catch (error) {
      Alert.alert(
        "Order failed",
        "Your order could not be placed. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <LinearGradient
      colors={["#e5d8db", "#e1d4d5", "#e4d6d6"]}
      style={styles.container}
    >
      <Header title="Checkout" />

      <FlatList
        data={carts}
        keyExtractor={item => item.cartItemId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Text style={styles.sectionTitle}>Delivery Location</Text>

            {loadingLocations ? (
              <ActivityIndicator color="#E55B5B" />
            ) : locations.length === 0 ? (
              <Text style={styles.emptyLocationText}>
                No saved location found. Add one from Account first.
              </Text>
            ) : (
              locations.map(location => (
                <TouchableOpacity
                  key={location.id}
                  style={[
                    styles.locationCard,
                    selectedLocationId === location.id &&
                      styles.selectedLocationCard,
                  ]}
                  onPress={() =>
                    setSelectedLocationId(location.id)
                  }
                >
                  <FontAwesome
                    name="map-marker"
                    size={22}
                    color="#E55B5B"
                  />

                  <Text style={styles.locationText}>
                    {location.name}
                  </Text>

                  <FontAwesome
                    name={
                      selectedLocationId === location.id
                        ? "check-circle"
                        : "circle-o"
                    }
                    size={21}
                    color="#E55B5B"
                  />
                </TouchableOpacity>
              ))
            )}

            <Text style={styles.sectionTitle}>Order Summary</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.productName}>
              {item.title} · {item.size} · {item.color} ×{" "}
              {item.quantity || 1}
            </Text>

            <Text style={styles.productPrice}>
              $
              {(
                Number(item.price) *
                Number(item.quantity || 1)
              ).toFixed(2)}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <>
            {!checkingOffer && isFirstOrder && (
              <View style={styles.firstOrderBanner}>
                <FontAwesome
                  name="gift"
                  size={20}
                  color="#2E7D32"
                />

                <View style={styles.offerTextContainer}>
                  <Text style={styles.firstOrderTitle}>
                    First order offer applied!
                  </Text>
                  <Text style={styles.firstOrderText}>
                    You saved 20% automatically.
                  </Text>
                </View>
              </View>
            )}

            {!checkingOffer && !isFirstOrder && (
              <>
                <Text style={styles.sectionTitle}>Promo Code</Text>

                <View style={styles.couponRow}>
                  <TextInput
                    value={couponText}
                    onChangeText={setCouponText}
                    placeholder="Enter coupon code"
                    placeholderTextColor="#8A8A8A"
                    autoCapitalize="characters"
                    style={styles.couponInput}
                  />

                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={handleApplyCoupon}
                  >
                    <Text style={styles.applyButtonText}>
                      Apply
                    </Text>
                  </TouchableOpacity>
                </View>

                {appliedCoupon && (
                  <View style={styles.appliedCouponRow}>
                    <Text style={styles.appliedCouponText}>
                      {appliedCoupon} · {discountPercentage}% off
                      applied
                    </Text>

                    <TouchableOpacity onPress={handleRemoveCoupon}>
                      <Text style={styles.removeCouponText}>
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <Text style={styles.demoCouponText}>
                  Try: ZIVORA10 or WELCOME20
                </Text>
              </>
            )}

            <View style={styles.totalCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalLabel}>
                  ${subtotal.toFixed(2)}
                </Text>
              </View>

              {discountPercentage > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.discountLabel}>
                    Discount ({discountPercentage}%)
                  </Text>

                  <Text style={styles.discountLabel}>
                    -${discountAmount.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Shipping</Text>
                <Text style={styles.totalLabel}>$0.00</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.grandTotal}>Grand Total</Text>
                <Text style={styles.grandTotal}>
                  ${grandTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </>
        }
      />

      <TouchableOpacity
        style={[
          styles.placeOrderButton,
          (placingOrder || carts.length === 0) &&
            styles.disabledButton,
        ]}
        onPress={handlePlaceOrder}
        disabled={placingOrder || carts.length === 0}
      >
        {placingOrder ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.placeOrderText}>Place Order</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  listContent: {
    paddingBottom: 20,
  },

  sectionTitle: {
    color: "#333333",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 12,
  },

  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },

  selectedLocationCard: {
    borderColor: "#E55B5B",
  },

  locationText: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    marginHorizontal: 12,
  },

  emptyLocationText: {
    color: "#757575",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 18,
  },

  orderItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  productName: {
    color: "#333333",
    fontSize: 15,
    flex: 1,
    marginRight: 10,
  },

  productPrice: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "700",
  },

  firstOrderBanner: {
    backgroundColor: "#EAF7EC",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  offerTextContainer: {
    marginLeft: 10,
  },

  firstOrderTitle: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "700",
  },

  firstOrderText: {
    color: "#43874A",
    fontSize: 13,
    marginTop: 2,
  },

  couponRow: {
    flexDirection: "row",
    height: 50,
  },

  couponInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#333333",
    fontSize: 15,
    marginRight: 10,
  },

  applyButton: {
    backgroundColor: "#333333",
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  appliedCouponRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#EAF7EC",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },

  appliedCouponText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "700",
  },

  removeCouponText: {
    color: "#E55B5B",
    fontSize: 14,
    fontWeight: "700",
  },

  demoCouponText: {
    color: "#757575",
    textAlign: "center",
    fontSize: 13,
    marginTop: 10,
  },

  totalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  totalLabel: {
    fontSize: 17,
    color: "#757575",
  },

  discountLabel: {
    fontSize: 17,
    color: "#2E7D32",
    fontWeight: "700",
  },

  grandTotal: {
    fontSize: 19,
    fontWeight: "700",
    color: "#333333",
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    marginVertical: 8,
  },

  placeOrderButton: {
    backgroundColor: "#E55B5B",
    height: 54,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },

  disabledButton: {
    backgroundColor: "#BDBDBD",
  },

  placeOrderText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
});