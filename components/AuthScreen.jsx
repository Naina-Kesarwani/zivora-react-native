import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "@react-native-vector-icons/fontawesome";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithCredential,
} from "@react-native-firebase/auth";

import {
  GoogleOneTapSignIn,
  isSuccessResponse,
} from "react-native-nitro-google-signin";

GoogleOneTapSignIn.configure({
    webClientId: "autoDetect",
    autoSelectOnSignIn: false,
});

const AuthScreen = ({ onContinueAsGuest }) => {
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
  setLoading(true);

  try {
    await GoogleOneTapSignIn.checkPlayServices();

    // Opens the complete account chooser
    const response =
      await GoogleOneTapSignIn.presentExplicitSignIn();

    if (!isSuccessResponse(response)) {
      return;
    }

    const idToken = response.data?.idToken;

    if (!idToken) {
      throw new Error("Google ID token was not returned.");
    }

    const googleCredential =
      GoogleAuthProvider.credential(idToken);

    await signInWithCredential(
      getAuth(),
      googleCredential
    );
  } catch (error) {
    Alert.alert(
      "Google sign-in failed",
      error?.message || "Please try again."
    );
  } finally {
    setLoading(false);
  }
};

    return (
        <LinearGradient
            colors={["#e5d8db", "#e1d4d5", "#e4d6d6"]}
            style={styles.container}
        >
            <View style={styles.logoCircle}>
                <Text style={styles.logoLetter}>Z</Text>
            </View>

            <Text style={styles.appName}>ZIVORA</Text>

            <Text style={styles.heading}>
                Discover your perfect style
            </Text>

            <Text style={styles.description}>
                Sign in to continue shopping, save favourites and
                manage your cart.
            </Text>

            <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#444444" />
                ) : (
                    <>
                        <FontAwesome
                            name="google"
                            size={23}
                            color="#DB4437"
                        />

                        <Text style={styles.googleButtonText}>
                            Continue with Google
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.divider} />
            </View>

            <TouchableOpacity
                style={styles.guestButton}
                onPress={onContinueAsGuest}
            >
                <Text style={styles.guestButtonText}>
                    Continue as Guest
                </Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default AuthScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 30,
    },

    logoCircle: {
        alignSelf: "center",
        height: 85,
        width: 85,
        borderRadius: 25,
        backgroundColor: "#E55B5B",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },

    logoLetter: {
        color: "#FFFFFF",
        fontSize: 44,
        fontWeight: "800",
    },

    appName: {
        color: "#E55B5B",
        fontSize: 32,
        fontWeight: "800",
        textAlign: "center",
        letterSpacing: 4,
    },

    heading: {
        color: "#333333",
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 25,
    },

    description: {
        color: "#757575",
        fontSize: 16,
        textAlign: "center",
        lineHeight: 23,
        marginTop: 10,
        marginBottom: 35,
    },

    googleButton: {
        height: 55,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 15,
        elevation: 3,
    },

    googleButtonText: {
        color: "#444444",
        fontSize: 17,
        fontWeight: "600",
    },

    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 25,
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#B5B5B5",
    },

    orText: {
        color: "#757575",
        marginHorizontal: 15,
        fontWeight: "600",
    },

    guestButton: {
        height: 55,
        borderWidth: 2,
        borderColor: "#E55B5B",
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },

    guestButtonText: {
        color: "#E55B5B",
        fontSize: 17,
        fontWeight: "700",
    },
});