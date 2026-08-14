import React, { useCallback, useContext, useState } from "react";
import {
    ActivityIndicator,
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
import { getAuth } from "@react-native-firebase/auth";
import {
    useFocusEffect,
    useNavigation,
} from "@react-navigation/native";

import Header from "../src/Header";
import { CartContext } from "../src/context/CardContext";


const OrdersScreen = () => {
    const navigation = useNavigation();
    const { addMultipleToCart } = useContext(CartContext);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = getAuth().currentUser;

    const ordersKey = user
        ? `zivora_orders_${user.uid}`
        : "zivora_guest_orders";

    const loadOrders = async () => {
        try {
            setLoading(true);

            const savedOrders = await AsyncStorage.getItem(ordersKey);

            setOrders(savedOrders ? JSON.parse(savedOrders) : []);
        } catch (error) {
            Alert.alert("Error", "Could not load your orders.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadOrders();
        }, [ordersKey])
    );

    const handleReorder = async order => {
        await addMultipleToCart(order.items);

        Alert.alert(
            "Added to Cart",
            "All products from this order were added to your cart."
        );
    };

    const handleAddProduct = async item => {
        await addMultipleToCart([item]);

        Alert.alert(
            "Added to Cart",
            `${item.title} was added to your cart.`
        );
    };

    const formatDate = dateString => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <LinearGradient
            colors={["#e5d8db", "#e1d4d5", "#e4d6d6"]}
            style={styles.container}
        >
            <Header title="My Orders" />

            {loading ? (
                <ActivityIndicator
                    size="large"
                    color="#E55B5B"
                    style={styles.loader}
                />
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item: order }) => (
                        <View style={styles.orderCard}>
                            <View style={styles.orderTopRow}>
                                <View>
                                    <Text style={styles.orderId}>{order.id}</Text>
                                    <Text style={styles.orderDate}>
                                        {formatDate(order.createdAt)}
                                    </Text>
                                </View>

                                <Text style={styles.status}>{order.status}</Text>
                            </View>

                            <View style={styles.locationRow}>
                                <FontAwesome
                                    name="map-marker"
                                    size={17}
                                    color="#E55B5B"
                                />
                                <Text style={styles.locationText}>
                                    {order.location}
                                </Text>
                            </View>

                            <View style={styles.divider} />

                            {order.items.map(item => (
                                <View key={item.cartItemId || item.id} style={styles.productCard}>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={styles.productImage}
                                    />

                                    <View style={styles.productDetails}>
                                        <Text style={styles.itemName} numberOfLines={2}>
                                            {item.title}
                                        </Text>

                                        <Text style={styles.productQuantity}>
                                            Purchased quantity: {item.quantity || 1}
                                        </Text>

                                        <Text style={styles.itemPrice}>
                                            $
                                            {(
                                                Number(item.price) *
                                                Number(item.quantity || 1)
                                            ).toFixed(2)}
                                        </Text>

                                        <TouchableOpacity
                                            style={styles.addOneButton}
                                            onPress={() => handleAddProduct(item)}
                                        >
                                            <FontAwesome
                                                name="shopping-cart"
                                                size={14}
                                                color="#FFFFFF"
                                            />
                                            <Text style={styles.addOneText} >Add to Cart</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                            <View style={styles.totalRow}>
                                <Text style={styles.totalText}>Total</Text>
                                <Text style={styles.totalText}>
                                    ${Number(order.total).toFixed(2)}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.detailsButton}
                                onPress={() =>
                                    navigation.navigate("ORDER_DETAILS", {
                                        order,
                                    })
                                }
                            >
                                <Text style={styles.detailsButtonText}>
                                    View Order Details
                                </Text>

                                <FontAwesome
                                    name="chevron-right"
                                    size={14}
                                    color="#E55B5B"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.reorderButton}
                                onPress={() => handleReorder(order)}
                            >
                                <FontAwesome
                                    name="shopping-cart"
                                    size={17}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.reorderText}>Reorder</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <FontAwesome
                                name="shopping-bag"
                                size={42}
                                color="#E55B5B"
                            />
                            <Text style={styles.emptyTitle}>No orders yet</Text>
                            <Text style={styles.emptyText}>
                                Your placed orders will appear here.
                            </Text>
                        </View>
                    }
                />
            )}
        </LinearGradient>
    );
};

export default OrdersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },

    loader: {
        marginTop: 80,
    },

    listContent: {
        paddingTop: 20,
        paddingBottom: 40,
    },

    orderCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 16,
        marginBottom: 15,
    },

    orderTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    orderId: {
        color: "#333333",
        fontSize: 16,
        fontWeight: "700",
    },

    orderDate: {
        color: "#757575",
        fontSize: 14,
        marginTop: 4,
    },

    status: {
        color: "#2E7D32",
        fontSize: 14,
        fontWeight: "700",
    },

    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
    },

    locationText: {
        color: "#555555",
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
    },

    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
        marginVertical: 14,
    },

    productCard: {
        flexDirection: "row",
        backgroundColor: "#F8F8F8",
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
    },

    productImage: {
        height: 92,
        width: 72,
        borderRadius: 10,
        resizeMode: "cover",
    },

    productDetails: {
        flex: 1,
        marginLeft: 12,
    },

    itemName: {
        color: "#444444",
        fontSize: 16,
        fontWeight: "700",
    },

    productQuantity: {
        color: "#757575",
        fontSize: 14,
        marginTop: 5,
    },

    itemPrice: {
        color: "#444444",
        fontSize: 15,
        fontWeight: "700",
        marginTop: 5,
    },

    addOneButton: {
        backgroundColor: "#E55B5B",
        borderRadius: 8,
        paddingVertical: 7,
        paddingHorizontal: 10,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },

    addOneText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
        marginLeft: 6,
    },

    itemName: {
        color: "#444444",
        fontSize: 15,
        flex: 1,
        marginRight: 10,
    },

    itemPrice: {
        color: "#444444",
        fontSize: 15,
        fontWeight: "600",
    },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },

    totalText: {
        color: "#333333",
        fontSize: 17,
        fontWeight: "700",
    },


    detailsButton: {
        height: 44,
        borderWidth: 1.5,
        borderColor: "#E55B5B",
        borderRadius: 12,
        marginTop: 16,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    detailsButtonText: {
        color: "#E55B5B",
        fontSize: 16,
        fontWeight: "700",
    },






    reorderButton: {
        backgroundColor: "#E55B5B",
        height: 45,
        borderRadius: 12,
        marginTop: 16,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    reorderText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 9,
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
        textAlign: "center",
        fontSize: 16,
        marginTop: 8,
    },
});