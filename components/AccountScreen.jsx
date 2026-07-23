import React from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "@react-native-vector-icons/fontawesome";

import {
    getAuth,
    signOut,
} from "@react-native-firebase/auth";

import {
  GoogleOneTapSignIn,
} from "react-native-nitro-google-signin";

const AccountScreen = ({ isGuest, onLogout }) => {
    const user = getAuth().currentUser;

    const handleLogout = async () => {
  try {
    await signOut(getAuth());
    await GoogleOneTapSignIn.signOut();
  } catch (error) {
    Alert.alert(
      "Logout failed",
      error?.message || "Please try again."
    );
  }
};

    return (
        <LinearGradient
            colors={["#e5d8db", "#e1d4d5", "#e4d6d6"]}
            style={styles.container}
        >
            {user?.photoURL ? (
                <Image
                    source={{ uri: user.photoURL }}
                    style={styles.profileImage}
                />
            ) : (
                <FontAwesome
                    name="user-circle"
                    size={90}
                    color="#E55B5B"
                />
            )}

            <Text style={styles.name}>
                {isGuest
                    ? "Guest User"
                    : user?.displayName || "Zivora User"}
            </Text>

            {!isGuest && (
                <Text style={styles.email}>
                    {user?.email}
                </Text>
            )}

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>
                    {isGuest ? "Go to Sign In" : "Logout"}
                </Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default AccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 25,
    },

    profileImage: {
        height: 90,
        width: 90,
        borderRadius: 45,
    },

    name: {
        fontSize: 24,
        fontWeight: "700",
        color: "#333333",
        marginTop: 18,
    },

    email: {
        fontSize: 16,
        color: "#757575",
        marginTop: 7,
    },

    logoutButton: {
        backgroundColor: "#E55B5B",
        paddingVertical: 13,
        paddingHorizontal: 45,
        borderRadius: 20,
        marginTop: 35,
    },

    logoutText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },
});