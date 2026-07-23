import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';



const Header = ({ isCart }) => {

const navigation=useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity 
            onPress={()=>{
                navigation.navigate("HOME_STACK");
            }}
            style={styles.appIconContainer}>
                {
                    isCart ?
                        <FontAwesome style={{ marginLeft: 10 }} name="chevron-left" size={24} color={"#E55858"} /> :
                        <Image source={require("./assets/logo.png")} style={styles.appIcon} />
                }

            </TouchableOpacity>
                   {
                isCart &&
                    <Text style={styles.myCart}>My Cart</Text> 
            }
            

            <View style={styles.appImageContainer}>
                <Image source={require("./assets/girl.png")} style={styles.appImage} />
            </View>

        </View>

    )
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
        marginLeft: 8,
    },
    appIconContainer: {
        backgroundColor: "#fff",
        height: 44,
        width: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignContent: "center",
        
    },
    appImageContainer: {
        backgroundColor: "#fff",
        height: 44,
        width: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignContent: "center",
      
    },
    appImage: {
        height: 44,
        width: 44,

    },
    myCart: {
        fontSize: 28,
        color: "black",
    }

});