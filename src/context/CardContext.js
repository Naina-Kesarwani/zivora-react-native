import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carts, setCarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    loadCartItems();
  }, []);

  const totalSum = (items = []) => {
    const total = items.reduce((amount, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;

      return amount + price * quantity;
    }, 0);

    setTotalPrice(total);
  };

  const saveCartItems = async items => {
    await AsyncStorage.setItem("carts", JSON.stringify(items));
    setCarts(items);
    totalSum(items);
  };

  const loadCartItems = async () => {
    try {
      const savedCarts = await AsyncStorage.getItem("carts");
      const parsedCarts = savedCarts ? JSON.parse(savedCarts) : [];

      // Gives old saved cart items quantity: 1 automatically
      const cartItemsWithQuantity = parsedCarts.map(item => ({
        ...item,
        quantity: item.quantity || 1,
      }));

      setCarts(cartItemsWithQuantity);
      totalSum(cartItemsWithQuantity);
    } catch (error) {
      console.error("Failed to load cart items:", error);
    }
  };

  const addToCart = async item => {
    try {
      const itemIndex = carts.findIndex(cart => cart.id === item.id);

      let newCartItems;

      if (itemIndex === -1) {
        newCartItems = [...carts, { ...item, quantity: 1 }];
      } else {
        // Adding the same product again increases its quantity
        newCartItems = carts.map(cartItem =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: (cartItem.quantity || 1) + 1,
              }
            : cartItem
        );
      }

      await saveCartItems(newCartItems);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const updateItemQuantity = async (itemId, change) => {
    try {
      const newCartItems = carts
        .map(cartItem => {
          if (cartItem.id !== itemId) {
            return cartItem;
          }

          return {
            ...cartItem,
            quantity: (cartItem.quantity || 1) + change,
          };
        })
        // Quantity 0 means remove that product from the cart
        .filter(cartItem => cartItem.quantity > 0);

      await saveCartItems(newCartItems);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const deleteItemFromCart = async itemId => {
    try {
      const newCartItems = carts.filter(
        cartItem => cartItem.id !== itemId
      );

      await saveCartItems(newCartItems);
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        carts,
        totalPrice,
        addToCart,
        updateItemQuantity,
        deleteItemFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};