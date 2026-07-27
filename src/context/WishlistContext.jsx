import React, {
  createContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAuth,
  onAuthStateChanged,
} from "@react-native-firebase/auth";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      getAuth(),
      async user => {
        const storageKey = user
          ? `zivora_wishlist_${user.uid}`
          : "zivora_guest_wishlist";

        try {
          const savedWishlist = await AsyncStorage.getItem(storageKey);

          setWishlist(
            savedWishlist ? JSON.parse(savedWishlist) : []
          );
        } catch (error) {
          console.error("Failed to load wishlist:", error);
          setWishlist([]);
        }
      }
    );

    return unsubscribe;
  }, []);

  const toggleWishlist = async product => {
    const user = getAuth().currentUser;

    const storageKey = user
      ? `zivora_wishlist_${user.uid}`
      : "zivora_guest_wishlist";

    const exists = wishlist.some(item => item.id === product.id);

    const updatedWishlist = exists
      ? wishlist.filter(item => item.id !== product.id)
      : [...wishlist, product];

    try {
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify(updatedWishlist)
      );

      setWishlist(updatedWishlist);
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};