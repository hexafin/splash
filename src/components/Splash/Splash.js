// presentational component for splash page

import React from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"
import Button from '../universal/Button'
import {colors} from "../../lib/colors"


const Splash = ({SignIn}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Splash Page</Text>
            <Button title="Log in" onPress={() => SignIn()}/>
            <Button primary title="Get your wallet" onPress={() => SignIn()}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: colors.white,
        padding: 30
    },
    title: {
        fontSize: 20
    },
    loginButton: {

    }
})

export default Splash