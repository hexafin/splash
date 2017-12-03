// presentational component for splash page

import React from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"
import Button from '../universal/Button'
import { Input, MultiInput, MultiInputBlock } from '../universal/Input'
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"



const Splash = ({SignIn}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Splash Page</Text>
            <Button title="Log in" onPress={() => SignIn()}/>

            <FBLogin/>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: colors.white,
        padding: 30
    },
})

export default Splash
