import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const Category = ({item,selectedCategory,setSelectedCategory}) => {
  return (
    <TouchableOpacity onPress={()=>setSelectedCategory(item)}>
      <Text style={[styles.categoryText,selectedCategory===item && {color:"white" , backgroundColor:"#E96E6E"} ]}>{item}</Text>
    </TouchableOpacity>
  )
}

export default Category

const styles = StyleSheet.create({
    categoryText:{
        fontWeight:600,
        fontSize:16,
        color:"#938F8F",
        backgroundColor:"#c8c2c2",
        paddingVertical:10,
        paddingHorizontal:16,
        textAlign:"center",
        borderRadius:16,
        marginHorizontal:10,
    }
})