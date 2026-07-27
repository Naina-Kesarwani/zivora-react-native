import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "@react-native-firebase/auth";

const Header = ({ isCart }) => {
  const navigation = useNavigation();
  const user = getAuth().currentUser;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("HOME_STACK")}
        style={styles.appIconContainer}
      >
        {isCart ? (
          <FontAwesome
            // style={{ marginLeft: 10 }}
            name="chevron-left"
            size={24}
            color="#E55858"
          />
        ) : (
          <Image source={require("./assets/logo.png")} style={styles.appIcon} />
        )}
      </TouchableOpacity>

      {isCart && <Text style={styles.myCart}>My Cart</Text>}

      <View style={styles.appImageContainer}>
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.appImage} />
        ) : (
          <FontAwesome name="user" size={22} color="#E55858" />
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
  },

  appIcon: {
    height: 28,
    width: 28,

  },

  appIconContainer: {
    backgroundColor: "#fff",
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  appImageContainer: {
    backgroundColor: "#fff",
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  appImage: {
    height: 44,
    width: 44,
    borderRadius: 22,
  },

  myCart: {
    fontSize: 28,
    color: "black",
  },
});