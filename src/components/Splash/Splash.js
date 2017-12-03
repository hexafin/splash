// presentational component for splash page

import React from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native"
import Button from '../universal/Button'
import { Input, MultiInput, MultiInputBlock } from '../universal/Input'
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"



const Splash = ({SignIn}) => {
    return (
        <View style={styles.container}>
            <Image 

                style={styles.splashImage}
                source={require('../../assets/images/people-splash.png')} 
            />

            <Text style={styles.title}>splash</Text>
            <Text> An easy way to send
            and get bitcoin from 
            your friends✌️
            </Text>
            <Button title="Log in" onPress={() => SignIn()}/>



        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: colors.white,
        padding: 30,
        position: 'relative'
    },
    splashImage: {
        position: 'absolute',
        left: -160,
        top: -50,
        width: 700,
        height: 700,
    },
})

export default Splash