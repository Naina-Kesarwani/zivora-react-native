import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Header from "../src/Header";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Category from "../src/Category";
import ProductCard from "../src/ProductCard";
import data from "../src/data/data.json";




const categories = ['Trending Now', 'All', 'New', 'Men', 'Women']

export default function Homescreen() {

  const [products, setProducts] = useState(data.products);
  const [selectedCategory, setSelectedCategory] = useState(null);
  


  const handleLiked = item => {
    const newProducts = products.map(prod => {
      if (prod.id === item.id) {
        return {
          ...prod,
          isLiked: !prod.isLiked,
        };
      }

      return prod;
    });

    setProducts(newProducts);
  };
  return (
    <LinearGradient colors={['#e5d8db', '#e1d4d5', '#e4d6d6']} style={styles.linearGradient}>
      <Header />


      <FlatList data={products}
        ListHeaderComponent={
          <>
            <Text style={styles.matchText}>Zivora - Match Your Style</Text>

            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <FontAwesome name="search" size={26} color="#a49898c0" />
              </View>
              <TextInput style={styles.textInput} placeholder='Search' />
            </View>


            <FlatList data={categories}
              renderItem={({ item }) => (
                <Category
                  item={item}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false} />
          </>
        }

        renderItem={({ item, index }) => (<ProductCard item={item} handleLiked={handleLiked} />)}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
        }}

      />
    </LinearGradient>
  )
};

var styles = StyleSheet.create({
  linearGradient: {
    // flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  matchText: {
    fontSize: 28,
    color: "#000000",
    marginTop: 25,
  },
  inputContainer: {
    backgroundColor: "white",
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
  },
  textInput: {
    flex: 1,


  },
  iconContainer: {
    marginHorizontal: 15,
  },


});