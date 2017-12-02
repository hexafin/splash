// presentational component for splash page

import React from "react"
import {
    View,
    Text,
    StyleSheet,
    Button
} from "react-native"
import {colors} from "../../lib/colors"


const Splash = ({SignIn}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Splash Page</Text>
            <Button style={styles.loginButton} title="Log In" onPress={() => SignIn()}/>
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