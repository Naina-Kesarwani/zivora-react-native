import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    PermissionsAndroid,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "@react-native-vector-icons/fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Geolocation from "react-native-geolocation-service";
import { useNavigation } from "@react-navigation/native";

import {
    getAuth,
    signOut,
} from "@react-native-firebase/auth";

import {
    GoogleOneTapSignIn,
} from "react-native-nitro-google-signin";

const AccountScreen = ({ isGuest, onLogout }) => {
    const user = getAuth().currentUser;

    const navigation = useNavigation();

    const [locationInput, setLocationInput] = useState("");
    const [locations, setLocations] = useState([]);
    const [editingLocationId, setEditingLocationId] = useState(null);
    const [gettingLocation, setGettingLocation] = useState(false);

    const locationsKey = user
        ? `zivora_profile_locations_${user.uid}`
        : null;

    useEffect(() => {
        const loadLocations = async () => {
            if (isGuest || !locationsKey) {
                setLocations([]);
                return;
            }

            try {
                const savedLocations = await AsyncStorage.getItem(locationsKey);

                if (savedLocations) {
                    setLocations(JSON.parse(savedLocations));
                }
            } catch (error) {
                Alert.alert("Error", "Could not load saved locations.");
            }
        };

        loadLocations();
    }, [isGuest, locationsKey]);

    const saveLocations = async updatedLocations => {
        if (!locationsKey) {
            Alert.alert(
                "Sign in required",
                "Please sign in before saving locations."
            );
            return;
        }

        await AsyncStorage.setItem(
            locationsKey,
            JSON.stringify(updatedLocations)
        );

        setLocations(updatedLocations);
    };

    const handleAddOrUpdateLocation = async () => {
        const trimmedLocation = locationInput.trim();

        if (!trimmedLocation) {
            Alert.alert(
                "Location required",
                "Enter a city or address first."
            );
            return;
        }

        try {
            let updatedLocations;

            if (editingLocationId) {
                updatedLocations = locations.map(location =>
                    location.id === editingLocationId
                        ? { ...location, name: trimmedLocation }
                        : location
                );
            } else {
                const newLocation = {
                    id: Date.now().toString(),
                    name: trimmedLocation,
                };

                updatedLocations = [...locations, newLocation];
            }

            await saveLocations(updatedLocations);

            setLocationInput("");
            setEditingLocationId(null);
        } catch (error) {
            Alert.alert(
                "Could not save",
                "Please try saving the location again."
            );
        }
    };

    const handleEditLocation = location => {
        setLocationInput(location.name);
        setEditingLocationId(location.id);
    };

    const handleDeleteLocation = location => {
        Alert.alert(
            "Remove location",
            `Remove "${location.name}" from your profile?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const updatedLocations = locations.filter(
                                item => item.id !== location.id
                            );

                            await saveLocations(updatedLocations);

                            if (editingLocationId === location.id) {
                                setLocationInput("");
                                setEditingLocationId(null);
                            }
                        } catch (error) {
                            Alert.alert(
                                "Could not remove",
                                "Please try again."
                            );
                        }
                    },
                },
            ]
        );
    };

    const requestLocationPermission = async () => {
        if (Platform.OS !== "android") {
            return true;
        }

        const result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        const preciseLocationAllowed =
            result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
            PermissionsAndroid.RESULTS.GRANTED;

        if (!preciseLocationAllowed) {
            Alert.alert(
                "Precise location needed",
                "Please select Precise location in the permission popup or app settings."
            );
        }

        return preciseLocationAllowed;
    };

    const getReadableLocation = async (latitude, longitude) => {
        const url =
            `https://nominatim.openstreetmap.org/reverse` +
            `?format=jsonv2` +
            `&lat=${latitude}` +
            `&lon=${longitude}` +
            `&zoom=18` +
            `&addressdetails=1` +
            `&accept-language=en`;

        const response = await fetch(url, {
            headers: {
                "Accept-Language": "en",
                "User-Agent": "Zivora React Native App",
            },
        });

        if (!response.ok) {
            throw new Error("Could not find a readable address.");
        }

        const data = await response.json();
        const address = data.address;

        const city =
            address.city ||
            address.town ||
            address.village ||
            address.county;

        return (
            [city, address.state, address.country]
                .filter(Boolean)
                .join(", ") || data.display_name
        );
    };


    const handleUseCurrentLocation = async () => {
        const hasPermission = await requestLocationPermission();

        if (!hasPermission) {
            Alert.alert(
                "Permission denied",
                "Allow location permission to use this feature."
            );
            return;
        }

        setGettingLocation(true);

        Geolocation.getCurrentPosition(
            async position => {
                try {
                    const { latitude, longitude } = position.coords;

                    const readableLocation = await getReadableLocation(
                        latitude,
                        longitude
                    );

                    setLocationInput(readableLocation);
                    setEditingLocationId(null);

                    Alert.alert(
                        "Location found",
                        "Review it if needed, then tap Add Location."
                    );
                } catch (error) {
                    Alert.alert(
                        "Address unavailable",
                        "We found your GPS location, but could not convert it into an address. Please enter it manually."
                    );
                } finally {
                    setGettingLocation(false);
                }
            },
            () => {
                setGettingLocation(false);

                Alert.alert(
                    "Location unavailable",
                    "Turn on device location and try again."
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
            }
        );
    };


    const handleLogout = async () => {
        if (isGuest) {
            onLogout?.();
            return;
        }

        try {
            await signOut(getAuth());
            await GoogleOneTapSignIn.signOut();
            onLogout?.();
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
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
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
                    <>
                        <Text style={styles.email}>{user?.email}</Text>
                        <TouchableOpacity
                            style={styles.wishlistButton}
                            onPress={() =>
                                navigation.navigate("HOME_STACK", {
                                    screen: "WISHLIST",
                                })
                            }
                        >
                            <FontAwesome name="heart" size={20} color="#E55B5B" />

                            <Text style={styles.wishlistText}>My Wishlist</Text>

                            <FontAwesome
                                name="chevron-right"
                                size={16}
                                color="#757575"
                                style={styles.wishlistArrow}
                            />
                        </TouchableOpacity>
                        <View style={styles.locationSection}>


                            <TextInput
                                value={locationInput}
                                onChangeText={setLocationInput}
                                placeholder="Example: Home - Kanpur, Uttar Pradesh"
                                placeholderTextColor="#999999"
                                style={styles.locationInput}
                            />

                            <TouchableOpacity
                                style={styles.currentLocationButton}
                                onPress={handleUseCurrentLocation}
                                disabled={gettingLocation}
                            >
                                {gettingLocation ? (
                                    <ActivityIndicator color="#E55B5B" />
                                ) : (
                                    <>
                                        <FontAwesome
                                            name="map-marker"
                                            size={19}
                                            color="#E55B5B"
                                        />
                                        <Text style={styles.currentLocationText}>
                                            Use Current Location
                                        </Text>

                                    </>

                                )}
                            </TouchableOpacity>
                            <Text style={styles.attribution}>
                                Location data © OpenStreetMap contributors
                            </Text>

                            <TouchableOpacity
                                style={styles.saveLocationButton}
                                onPress={handleAddOrUpdateLocation}
                            >
                                <Text style={styles.saveLocationText}>
                                    {editingLocationId
                                        ? "Update Location"
                                        : "Add Location"}
                                </Text>
                            </TouchableOpacity>

                            <Text style={styles.locationLabel}>
                                Saved Locations
                            </Text>

                            {editingLocationId && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setLocationInput("");
                                        setEditingLocationId(null);
                                    }}
                                >
                                    <Text style={styles.cancelEditText}>
                                        Cancel Edit
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {locations.length === 0 ? (
                                <Text style={styles.emptyText}>
                                    No saved locations yet.
                                </Text>
                            ) : (
                                locations.map(location => (
                                    <View
                                        key={location.id}
                                        style={styles.locationCard}
                                    >
                                        <FontAwesome
                                            name="map-marker"
                                            size={21}
                                            color="#E55B5B"
                                            style={styles.locationIcon}
                                        />

                                        <Text
                                            numberOfLines={2}
                                            style={styles.savedLocationText}
                                        >
                                            {location.name}
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() => handleEditLocation(location)}
                                            style={styles.actionButton}
                                        >
                                            <FontAwesome
                                                name="pencil"
                                                size={18}
                                                color="#555555"
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => handleDeleteLocation(location)}
                                            style={styles.actionButton}
                                        >
                                            <FontAwesome
                                                name="trash"
                                                size={18}
                                                color="#E55B5B"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            )}
                        </View>
                    </>
                )}

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>
                        {isGuest ? "Go to Sign In" : "Logout"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

export default AccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContent: {
        alignItems: "center",
        padding: 25,
        paddingTop: 55,
        paddingBottom: 40,
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

    locationSection: {
        width: "100%",
        marginTop: 30,
    },

    locationLabel: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333333",
        marginBottom: 8,
        marginTop: 12,
    },

    locationInput: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 52,
        fontSize: 15,
        color: "#333333",
    },

    currentLocationButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
        height: 48,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#E55B5B",
    },

    currentLocationText: {
        color: "#E55B5B",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 9,
    },

    saveLocationButton: {
        backgroundColor: "#333333",
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
    },

    saveLocationText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    cancelEditText: {
        color: "#E55B5B",
        textAlign: "center",
        fontSize: 15,
        fontWeight: "700",
        marginTop: 12,
    },

    emptyText: {
        color: "#757575",
        textAlign: "center",
        marginTop: 20,
        fontSize: 15,
    },

    locationCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },

    locationIcon: {
        marginRight: 10,
    },

    savedLocationText: {
        flex: 1,
        color: "#333333",
        fontSize: 15,
    },

    actionButton: {
        padding: 6,
        marginLeft: 5,
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
    attribution: {
        color: "#777777",
        fontSize: 11,
        textAlign: "center",
        marginTop: 6,
    },
    wishlistButton: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 58,
        marginTop: 28,
    },

    wishlistText: {
        marginLeft: 13,
        color: "#333333",
        fontSize: 17,
        fontWeight: "700",
    },

    wishlistArrow: {
        marginLeft: "auto",
    },
});