import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import Header from '../src/Header';
import CartCard from '../src/CartCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CartContext } from '../src/context/CardContext';


const sizes = ['S', 'M', 'L', 'XL'];
const colorsArray = ["white", "red", "blue", "yellow", "green", "black"];

export default function ProductDetails() {
    const navigation=useNavigation();
    const { addToCart } = useContext(CartContext);
    const route = useRoute();
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

    const handleAddToCart = (item) => {
        item.size=selectedSize;
        item.color=selectedColor;
        addToCart(item);
        navigation.navigate("CART");
    }

    return (
        <LinearGradient colors={['#e5d8db', '#e1d4d5', '#e4d6d6']}
            style={styles.container}>
            <View style={styles.headerContainer}>
                <Header />

            </View>
            <Image source={{ uri: item.image }}
                style={styles.coverImage}
            />

            <View style={styles.contentContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>${item.price}</Text>
            </View>
            <Text style={[styles.title, styles.sizeText]}>Size </Text>
            <View style={styles.sizeContainer}>
                {
                    sizes.map((size, index) => {
                        return (
                            <TouchableOpacity
                            key={index}
                                style={styles.sizeValueContainer}
                                onPress={() => {
                                    setSelectedSize(size);
                                }}>
                                <Text style={[styles.sizeValue,
                                selectedSize == size && { color: "#E55858" }]}>{size}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
            <Text style={[styles.title, styles.colorText]}>Colors</Text>
            <View style={styles.colorContainer}>
                {
                    colorsArray.map((color,index) => {
                        return (
                            <TouchableOpacity
                            key={index}
                                onPress={() => {
                                    setSelectedColor(color);
                                }}
                                style={[styles.circleBorder,
                                selectedColor === color && {
                                    borderColor: color,
                                    borderWidth: 2,
                                }
                                ]}>
                                <View style={[styles.circle, {
                                    backgroundColor: color
                                }]} />
                            </TouchableOpacity>
                        )
                    })

                }
            </View>
            <TouchableOpacity
                onPress={() => {
                    handleAddToCart(item);
                }}
                style={styles.button}>
                <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
        </LinearGradient>
    )
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
    },
    contentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginVertical: 20,
    },
    title: {
        fontSize: 20,
        color: "#444444",
        fontWeight: "500",
    },
    price: {
        color: "#4D4C4C"
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
        fontWeight: 600,

    },
    sizeValueContainer: {
        height: 36,
        width: 36,
        borderRadius: 18,

        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10
    },
    colorText: {
        marginHorizontal: 20,
        marginTop: 10,
    },
    circle: {
        height: 36,
        width: 36,
        borderRadius: 18,


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
        marginHorizontal: 5
    },
    button: {
        backgroundColor: "#E55B5B",
        padding: 10,
        margin: 10,
        borderRadius: 20,

    },
    buttonText: {
        fontSize: 24,
        color: "white",
        fontWeight: 600,
        textAlign: "center",

    }
})


