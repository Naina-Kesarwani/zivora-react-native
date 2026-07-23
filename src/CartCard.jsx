import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from "react-native";
import FontAwesome from "@react-native-vector-icons/fontawesome";

const CartCard = ({ item, deleteItemFromCart }) => {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: item.image }}
                style={styles.coverImage}
            />

            <View style={styles.cardContent}>
                <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                </Text>

                <Text style={styles.price}>
                    ${item.price}
                </Text>

                <View style={styles.circleSizeContainer}>
                    <View
                        style={[
                            styles.circle,
                            {
                                backgroundColor:
                                    item.color || "#FFFFFF",
                            },
                        ]}
                    />

                    <View style={styles.sizeCircle}>
                        <Text style={styles.sizeText}>
                            {item.size}
                        </Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteItemFromCart(item.id)}
               
            >
                <FontAwesome
                    name="trash"
                    color="#E55858"
                    size={22}
                />
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
        marginVertical: 10,
        fontSize: 18,
    },

    circleSizeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    circle: {
        height: 32,
        width: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#CCCCCC",
    },

    sizeCircle: {
        backgroundColor: "#FFFFFF",
        height: 32,
        width: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
    },

    sizeText: {
        fontSize: 18,
        fontWeight: "500",
    },

    deleteButton: {
        padding: 10,
    },
});