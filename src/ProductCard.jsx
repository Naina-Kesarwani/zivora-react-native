import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useNavigation } from '@react-navigation/native';


export default function ProductCard({ item, handleLiked
}) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate("PRODUCT_DETAILS", { item });
            }}
            style={styles.container}>
            <Image
                source={{ uri: item.image }}
                style={styles.coverImage}
                resizeMode="cover"
            />

            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>${item.price}</Text>
            </View>
            <TouchableOpacity onPress={() => {
                handleLiked(item);
            }} style={styles.likeContainer}>
                {item?.isLiked ? (
                    <FontAwesome name={"heart"} size={20} color={"#E55B5B"} />
                ) : (
                    <FontAwesome name={"heart-o"} size={20} color={"#E55B5B"} />
                )}

            </TouchableOpacity>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({

    container: {
        flexBasis: "50%",
        maxWidth: "50%",
        flexGrow: 0,
        flexShrink: 0,
        marginTop: 10,
        position: "relative",
    },
    coverImage: {
        width: "90%",
        height: 256,
        borderRadius: 20,
        marginVertical: 10,
        marginLeft: 8,

    },
    title: {
        fontSize: 18,
        color: "black",
        fontWeight: 600,
    },
    price: {
        fontSize: 18,
        color: "#9C9C9C",
        fontWeight: 600,

    },
    content: {
        paddingHorizontal: 10,

    },
    likeContainer: {
        height: 34,
        width: 34,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 17,
        position: "absolute",
        top: 20,
        right: 20,
    },
})