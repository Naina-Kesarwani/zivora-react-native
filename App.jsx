



import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Reorder from "./components/Reorder";
import Homescreen from "./components/Homescreen";
import CartScreen from "./components/CartScreen";
import ProductDetails from "./components/ProductDetails";

import FontAwesome from '@react-native-vector-icons/fontawesome';

import { CartContext, CartProvider } from "./src/context/CardContext";
import { MaterialIcons } from '@react-native-vector-icons/material-icons/static';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MyHomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,

      }}

    >


      <Stack.Screen name="HOME" component={Homescreen} />
      <Stack.Screen name="PRODUCT_DETAILS" component={ProductDetails} />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarInactiveTintColor: "#000",
          tabBarActiveTintColor: "#6170db",
        }}
         
        >
          <Tab.Screen
            name="HOME_STACK"
            component={MyHomeStack}
            options={{
              tabBarIcon: ({ size, focused, color }) => {
                return <FontAwesome name="home" size={size} color={color} />
              }
            }} />

          <Tab.Screen
            name="REORDER"
            component={Reorder}
            options={{
              tabBarIcon: ({ size, focused, color }) => {
                return <FontAwesome name="reorder" size={size} color={color} />
              }
            }} />

          <Tab.Screen
            name="CART"
            component={CartScreen}
            options={{
              tabBarIcon: ({ size, focused, color }) => {
                const { carts } = useContext(CartContext);
                return (


                  <View style={{position:"relative"}}>
                    <FontAwesome
                      name="shopping-cart"
                      size={size}
                      color={color} />
                    <View  style={{
                        height: 14,
                        width: 14,
                        borderRadius: 7,
                        backgroundColor: color,

                        alignItems: "center",
                        justifyContent: "center",
                        position:"absolute",
                        bottom:20,
                        left:18
                      }}>
                      <Text style={{
                        fontSize:10,
                        fontWeight:500,
                        color:"white"}}>
                          {carts?.length}
                          </Text>
                    </View>
                  </View>

                )
              }
            }}
          />

          <Tab.Screen
            name="ACCOUNT"
            component={Homescreen}
            options={{
              tabBarIcon: ({ size, focused, color }) => (
                <MaterialIcons
                  name="account-box"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});