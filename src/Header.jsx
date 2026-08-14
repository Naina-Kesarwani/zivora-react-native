import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "@react-native-firebase/auth";

const Header = ({ isCart, title }) => {
  const navigation = useNavigation();
  const user = getAuth().currentUser;

  const isBackHeader = isCart || title;

  const handleLeftPress = () => {
    if (title) {
      navigation.goBack();
    } else {
      navigation.navigate("HOME_STACK");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleLeftPress}
        style={styles.appIconContainer}
      >
        {isBackHeader ? (
          <FontAwesome
            name="chevron-left"
            size={24}
            color="#E55858"
          />
        ) : (
          <Image
            source={require("./assets/logo.png")}
            style={styles.appIcon}
          />
        )}
      </TouchableOpacity>

      {isBackHeader && (
        <Text style={styles.heading}>
          {title || "My Cart"}
        </Text>
      )}

      <View style={styles.appImageContainer}>
        {user?.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            style={styles.appImage}
          />
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
    marginTop: 30,
  },

  appIcon: {
    height: 28,
    width: 28,
  },

  appIconContainer: {
    backgroundColor: "#FFFFFF",
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  appImageContainer: {
    backgroundColor: "#FFFFFF",
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

  heading: {
    fontSize: 25,
    color: "black",
    fontWeight: "600",
  },
});