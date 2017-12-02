// presentational component for splash page

import React from "react"
import {
    View,
    Text,
    StyleSheet,
    Button
} from "react-native"
import Emoji from "react-native-emoji"
import {colors} from "../../lib/colors"


const Splash = ({SignIn}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: colors.white,
        padding: 50
    },
    title: {
        fontSize: 20
    },
    loginButton: {

    }
})

export default Splash