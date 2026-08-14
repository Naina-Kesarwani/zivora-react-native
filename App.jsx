import React, {
    useContext,
    useEffect,
    useState,
} from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FontAwesome from "@react-native-vector-icons/fontawesome";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";

import {
    getAuth,
    onAuthStateChanged,
} from "@react-native-firebase/auth";

import OrdersScreen from "./components/OrdersScreen";
import Homescreen from "./components/Homescreen";
import CartScreen from "./components/CartScreen";
import ProductDetails from "./components/ProductDetails";
import AuthScreen from "./components/AuthScreen";
import AccountScreen from "./components/AccountScreen";
import WishlistScreen from "./components/WishlistScreen";
import { WishlistProvider } from "./src/context/WishlistContext";
import CheckoutScreen from "./components/CheckoutScreen";
import OrderSuccessScreen from "./components/OrderSuccessScreen";
import OrderDetailsScreen from "./components/OrderDetailsScreen";

import {
    CartContext,
    CartProvider,
} from "./src/context/CardContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const MyHomeStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="HOME"
                component={Homescreen}
            />

            <Stack.Screen
                name="PRODUCT_DETAILS"
                component={ProductDetails}
            />

            <Stack.Screen
                name="WISHLIST"
                component={WishlistScreen}
            />
        </Stack.Navigator>
    );
};

const CartTabIcon = ({ size, color }) => {
    const { carts } = useContext(CartContext);

    return (
        <View style={styles.cartIconContainer}>
            <FontAwesome
                name="shopping-cart"
                size={size}
                color={color}
            />

            {carts?.length > 0 && (
                <View
                    style={[
                        styles.cartBadge,
                        { backgroundColor: color },
                    ]}
                >
                    <Text style={styles.cartBadgeText}>
                        {carts.length}
                    </Text>
                </View>
            )}
        </View>
    );
};

const MainTabs = ({ user, isGuest, onLogout }) => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarInactiveTintColor: "#000000",
                tabBarActiveTintColor: "#E55B5B",
            }}
        >
            <Tab.Screen
                name="HOME_STACK"
                component={MyHomeStack}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome
                            name="home"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="ORDERS"
                component={OrdersScreen}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome
                            name="shopping-bag"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />




            <Tab.Screen
                name="CART"
                component={CartScreen}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <CartTabIcon
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="ACCOUNT"
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MaterialIcons
                            name="account-box"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            >
                {() => (
                    <AccountScreen
                        user={user}
                        isGuest={isGuest}
                        onLogout={onLogout}
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

const App = () => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            getAuth(),
            firebaseUser => {
                setUser(firebaseUser);
                setInitializing(false);
            }
        );

        return unsubscribe;
    }, []);

    if (initializing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#E55B5B"
                />
            </View>
        );
    }

    const canOpenApp = Boolean(user) || isGuest;

    return (
        <CartProvider>
            <WishlistProvider>
                <NavigationContainer>
                    <RootStack.Navigator
                        screenOptions={{
                            headerShown: false,
                        }}
                    >
                        {canOpenApp ? (
                            <>
                                <RootStack.Screen name="MAIN_APP">
                                    {() => (
                                        <MainTabs
                                            user={user}
                                            isGuest={isGuest}
                                            onLogout={() => setIsGuest(false)}
                                        />
                                    )}
                                </RootStack.Screen>

                                <RootStack.Screen
                                    name="CHECKOUT"
                                    component={CheckoutScreen}
                                />

                                <RootStack.Screen
                                    name="ORDER_SUCCESS"
                                    component={OrderSuccessScreen}
                                />

                                <RootStack.Screen
                                    name="ORDER_DETAILS"
                                    component={OrderDetailsScreen}
                                />
                            </>
                        ) : (
                            <RootStack.Screen name="AUTH">
                                {() => (
                                    <AuthScreen
                                        onContinueAsGuest={() => setIsGuest(true)}
                                    />
                                )}
                            </RootStack.Screen>
                        )}
                    </RootStack.Navigator>
                </NavigationContainer>
            </WishlistProvider>
        </CartProvider>
    );
};

export default App;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E5D8DB",
    },

    cartIconContainer: {
        position: "relative",
    },

    cartBadge: {
        position: "absolute",
        left: 17,
        bottom: 17,
        minWidth: 15,
        height: 15,
        borderRadius: 8,
        paddingHorizontal: 3,
        justifyContent: "center",
        alignItems: "center",
    },

    cartBadgeText: {
        color: "#FFFFFF",
        fontSize: 9,
        fontWeight: "600",
    },
});