import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carts, setCarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    let carts = await AsyncStorage.getItem("carts");

    carts = carts ? JSON.parse(carts) : [];

    setCarts(carts);
    totalSum(carts);
  };

  const addToCart = async (item) => {
    const itemExist = carts.findIndex(
      (cart) => cart.id === item.id
    );

    if (itemExist === -1) {
      const newCartItems = [...carts, item];

      await AsyncStorage.setItem(
        "carts",
        JSON.stringify(newCartItems)
      );

      setCarts(newCartItems);
      totalSum(newCartItems);
    }
  };

 const deleteItemFromCart = async itemId => {
    try {
        const newItems = carts.filter(
            cartItem => cartItem.id !== itemId
        );

        await AsyncStorage.setItem(
            "carts",
            JSON.stringify(newItems)
        );

        setCarts(newItems);
        totalSum(newItems);
    } catch (error) {
        console.error("Failed to delete cart item:", error);
    }
};


  

const totalSum = (items = carts) => {
    const total = items.reduce(
        (amount, item) =>
            amount + (Number(item.price) || 0),
        0
    );

    setTotalPrice(total);
};

  const value = {
    carts,
    addToCart,
    totalPrice,
    deleteItemFromCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};