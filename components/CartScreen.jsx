import React, { useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import Header from "../src/Header";
import CartCard from "../src/CartCard";
import { CartContext } from "../src/context/CardContext";
import { useNavigation } from "@react-navigation/native";

const CartScreen = () => {
    const {
        carts,
        totalPrice,
        deleteItemFromCart,
        updateItemQuantity,
    } = useContext(CartContext);
    const navigation = useNavigation();

    const formattedTotal = Number(totalPrice).toFixed(2);

    return (
        <LinearGradient
            colors={["#e5d8db", "#e1d4d5", "#e4d6d6"]}
            style={styles.container}
        >
            <View style={styles.headerContainer}>
                <Header isCart={true} />
            </View>

            <FlatList
                data={carts}
                // keyExtractor={item => String(item.id)}
                keyExtractor={item => item.cartItemId}
                renderItem={({ item }) => (
                    <CartCard
                        item={item}
                        deleteItemFromCart={deleteItemFromCart}
                        updateItemQuantity={updateItemQuantity}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                }
                ListFooterComponent={
                    carts.length > 0 ? (
                        <>
                            <View style={styles.priceContainer}>
                                <View style={styles.priceAndTitle}>
                                    <Text style={styles.text}>Total</Text>
                                    <Text style={styles.text}>${formattedTotal}</Text>
                                </View>

                                <View style={styles.priceAndTitle}>
                                    <Text style={styles.text}>Shipping</Text>
                                    <Text style={styles.text}>$0.00</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.priceAndTitle}>
                                <Text style={styles.text}>Grand Total</Text>
                                <Text style={[styles.text, styles.priceText]}>
                                    ${formattedTotal}
                                </Text>
                            </View>
                        </>
                    ) : null
                }
            />

           


            <TouchableOpacity
                style={[
                    styles.checkoutContainer,
                    carts.length === 0 && styles.disabledCheckout,
                ]}
                disabled={carts.length === 0}
                onPress={() => navigation.navigate("CHECKOUT")}
            >
                <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },

    headerContainer: {
        marginBottom: 20,
    },

    listContent: {
        paddingBottom: 100,
    },

    emptyText: {
        textAlign: "center",
        color: "#757575",
        fontSize: 18,
        marginVertical: 40,
    },

    priceContainer: {
        marginTop: 40,
    },

    priceAndTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginVertical: 10,
    },

    text: {
        color: "#757575",
        fontSize: 18,
    },

    divider: {
        borderBottomWidth: 2,
        borderBottomColor: "#C0C0C0",
        marginVertical: 10,
    },

    priceText: {
        color: "#000000",
        fontWeight: "700",
    },

    checkoutContainer: {
        backgroundColor: "#E55B5B",
        padding: 10,
        margin: 10,
        borderRadius: 20,
    },

    disabledCheckout: {
        backgroundColor: "#BDBDBD",
    },

    checkoutText: {
        fontSize: 24,
        color: "#FFFFFF",
        fontWeight: "600",
        textAlign: "center",
    },
});