import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CartContext = createContext();

const createCartItemId = item => {
  return (
    item.cartItemId ||
    `${item.id}-${item.size || "default"}-${item.color || "default"}`
  );
};

export const CartProvider = ({ children }) => {
  const [carts, setCarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    loadCartItems();
  }, []);

  const totalSum = (items = []) => {
    const total = items.reduce((amount, item) => {
      return (
        amount +
        (Number(item.price) || 0) * (Number(item.quantity) || 1)
      );
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

      const normalizedCartItems = parsedCarts.map(item => ({
        ...item,
        cartItemId: createCartItemId(item),
        quantity: item.quantity || 1,
      }));

      setCarts(normalizedCartItems);
      totalSum(normalizedCartItems);
    } catch (error) {
      console.error("Failed to load cart items:", error);
    }
  };

  const addToCart = async item => {
    try {
      const cartItem = {
        ...item,
        cartItemId: createCartItemId(item),
      };

      const itemIndex = carts.findIndex(
        cart => cart.cartItemId === cartItem.cartItemId
      );

      const newCartItems =
        itemIndex === -1
          ? [...carts, { ...cartItem, quantity: 1 }]
          : carts.map(existingItem =>
              existingItem.cartItemId === cartItem.cartItemId
                ? {
                    ...existingItem,
                    quantity: (existingItem.quantity || 1) + 1,
                  }
                : existingItem
            );

      await saveCartItems(newCartItems);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const updateItemQuantity = async (cartItemId, change) => {
    try {
      const newCartItems = carts
        .map(cartItem => {
          if (cartItem.cartItemId !== cartItemId) {
            return cartItem;
          }

          return {
            ...cartItem,
            quantity: (cartItem.quantity || 1) + change,
          };
        })
        .filter(cartItem => cartItem.quantity > 0);

      await saveCartItems(newCartItems);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const deleteItemFromCart = async cartItemId => {
    try {
      const newCartItems = carts.filter(
        cartItem => cartItem.cartItemId !== cartItemId
      );

      await saveCartItems(newCartItems);
    } catch (error) {
      console.error("Failed to delete cart item:", error);
    }
  };

  const clearCart = async () => {
    try {
      await saveCartItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const addMultipleToCart = async items => {
    try {
      let updatedCart = [...carts];

      items.forEach(orderItem => {
        const cartItem = {
          ...orderItem,
          cartItemId: createCartItemId(orderItem),
        };

        const itemIndex = updatedCart.findIndex(
          existingItem =>
            existingItem.cartItemId === cartItem.cartItemId
        );

        const orderQuantity = Number(cartItem.quantity) || 1;

        if (itemIndex === -1) {
          updatedCart.push({
            ...cartItem,
            quantity: orderQuantity,
          });
        } else {
          updatedCart[itemIndex] = {
            ...updatedCart[itemIndex],
            quantity:
              (Number(updatedCart[itemIndex].quantity) || 1) +
              orderQuantity,
          };
        }
      });

      await saveCartItems(updatedCart);
    } catch (error) {
      console.error("Failed to reorder items:", error);
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
        addMultipleToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};