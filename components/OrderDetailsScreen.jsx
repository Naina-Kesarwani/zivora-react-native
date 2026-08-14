import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "@react-native-firebase/auth";

import Header from "../src/Header";

const ORDER_STEPS = ["Placed", "Packed", "Shipped", "Delivered"];

const OrderDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [order, setOrder] = useState(route.params?.order);

  const user = getAuth().currentUser;

  const ordersKey = user
    ? `zivora_orders_${user.uid}`
    : "zivora_guest_orders";

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Order not found.</Text>
      </View>
    );
  }

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleCancelOrder = () => {
    Alert.alert(
      "Cancel order",
      "Are you sure you want to cancel this order?",
      [
        { text: "Keep Order", style: "cancel" },
        {
          text: "Cancel Order",
          style: "destructive",
          onPress: async () => {
            try {
              const savedOrders = await AsyncStorage.getItem(
                ordersKey
              );

              const orders = savedOrders
                ? JSON.parse(savedOrders)
                : [];

              const updatedOrders = orders.map(savedOrder =>
                savedOrder.id === order.id
                  ? { ...savedOrder, status: "Cancelled" }
                  : savedOrder
              );

              await AsyncStorage.setItem(
                ordersKey,
                JSON.stringify(updatedOrders)
              );

              setOrder(currentOrder => ({
                ...currentOrder,
                status: "Cancelled",
              }));

              Alert.alert(
                "Order cancelled",
                "Your order has been cancelled."
              );
            } catch (error) {
              Alert.alert(
                "Could not cancel",
                "Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const subtotal = Number(
    order.subtotal ?? order.total
  );

  const discountAmount = Number(order.discountAmount || 0);

  const discountLabel =
    order.discountType === "FIRST_ORDER"
      ? "First order discount"
      : order.couponCode
        ? `Coupon (${order.couponCode})`
        : "Discount";

  return (
    <LinearGradient
      colors={["#e5d8db", "#e1d4d5", "#e4d6d6"]}
      style={styles.container}
    >
      <Header title="Order Details" />

      <FlatList
        data={order.items}
        keyExtractor={item => item.cartItemId || item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.orderInfoCard}>
              <View style={styles.orderTopRow}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.dateText}>
                    Ordered on {formatDate(order.createdAt)}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.status,
                    order.status === "Cancelled" &&
                      styles.cancelledStatus,
                  ]}
                >
                  {order.status}
                </Text>
              </View>

              <View style={styles.locationRow}>
                <FontAwesome
                  name="map-marker"
                  size={18}
                  color="#E55B5B"
                />
                <Text style={styles.locationText}>
                  {order.location}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Order Status</Text>

            {order.status === "Cancelled" ? (
              <View style={styles.cancelledBanner}>
                <FontAwesome
                  name="times-circle"
                  size={20}
                  color="#E55858"
                />
                <Text style={styles.cancelledText}>
                  This order was cancelled.
                </Text>
              </View>
            ) : (
              <View style={styles.timelineCard}>
                {ORDER_STEPS.map((step, index) => {
                  const isCompleted =
                    step === "Placed" ||
                    ORDER_STEPS.indexOf(order.status) >= index;

                  return (
                    <View key={step} style={styles.timelineRow}>
                      <View>
                        <View
                          style={[
                            styles.timelineCircle,
                            isCompleted && styles.completedCircle,
                          ]}
                        >
                          {isCompleted && (
                            <FontAwesome
                              name="check"
                              size={11}
                              color="#FFFFFF"
                            />
                          )}
                        </View>

                        {index < ORDER_STEPS.length - 1 && (
                          <View
                            style={[
                              styles.timelineLine,
                              isCompleted && styles.completedLine,
                            ]}
                          />
                        )}
                      </View>

                      <Text
                        style={[
                          styles.stepText,
                          isCompleted && styles.completedStepText,
                        ]}
                      >
                        {step}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            <Text style={styles.sectionTitle}>Products</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
            />

            <View style={styles.productDetails}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.title}
              </Text>

              <Text style={styles.variantText}>
                Size: {item.size || "-"} · Colour: {item.color || "-"}
              </Text>

              <Text style={styles.variantText}>
                Quantity: {item.quantity || 1}
              </Text>

              <Text style={styles.productPrice}>
                $
                {(
                  Number(item.price) *
                  Number(item.quantity || 1)
                ).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <>
            <View style={styles.totalCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalLabel}>
                  ${subtotal.toFixed(2)}
                </Text>
              </View>

              {discountAmount > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.discountLabel}>
                    {discountLabel}
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
                  ${Number(order.total).toFixed(2)}
                </Text>
              </View>
            </View>

            {order.status === "Placed" && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelOrder}
              >
                <Text style={styles.cancelButtonText}>
                  Cancel Order
                </Text>
              </TouchableOpacity>
            )}
          </>
        }
      />
    </LinearGradient>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },

  listContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },

  orderInfoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
  },

  orderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  orderId: {
    color: "#333333",
    fontSize: 17,
    fontWeight: "700",
  },

  dateText: {
    color: "#757575",
    fontSize: 14,
    marginTop: 5,
  },

  status: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "700",
  },

  cancelledStatus: {
    color: "#E55858",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  locationText: {
    flex: 1,
    marginLeft: 9,
    color: "#555555",
    fontSize: 15,
  },

  sectionTitle: {
    color: "#333333",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 12,
  },

  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
  },

  timelineRow: {
    flexDirection: "row",
    minHeight: 44,
  },

  timelineCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    backgroundColor: "#D6D6D6",
    justifyContent: "center",
    alignItems: "center",
  },

  completedCircle: {
    backgroundColor: "#43A047",
  },

  timelineLine: {
    width: 2,
    height: 22,
    backgroundColor: "#D6D6D6",
    alignSelf: "center",
  },

  completedLine: {
    backgroundColor: "#43A047",
  },

  stepText: {
    marginLeft: 14,
    color: "#888888",
    fontSize: 16,
  },

  completedStepText: {
    color: "#333333",
    fontWeight: "700",
  },

  cancelledBanner: {
    backgroundColor: "#FCE8E8",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  cancelledText: {
    color: "#E55858",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },

  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 10,
    flexDirection: "row",
    marginBottom: 10,
  },

  productImage: {
    width: 75,
    height: 96,
    borderRadius: 10,
    resizeMode: "cover",
  },

  productDetails: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "700",
  },

  variantText: {
    color: "#757575",
    fontSize: 14,
    marginTop: 5,
  },

  productPrice: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 7,
  },

  totalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  totalLabel: {
    color: "#757575",
    fontSize: 16,
  },

  discountLabel: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "700",
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    marginVertical: 8,
  },

  grandTotal: {
    color: "#333333",
    fontSize: 19,
    fontWeight: "700",
  },

  cancelButton: {
    borderWidth: 1.5,
    borderColor: "#E55858",
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  cancelButtonText: {
    color: "#E55858",
    fontSize: 17,
    fontWeight: "700",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    color: "#E55858",
    fontSize: 18,
  },
});