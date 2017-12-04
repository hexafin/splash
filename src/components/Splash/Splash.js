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
import {Actions} from "react-native-router-flux"



const Splash = () => {
    return (
        <View style={styles.container}>
            <Image 

                style={styles.splashImage}
                source={require('../../assets/images/people-splash.png')} 
            />
            <View style={styles.content}>
                <Text style={styles.logo}>splash</Text>
                <Text style={styles.tagline}> An easy way to send
                and get bitcoin from 
                your friends✌️
                </Text>
            </View>
            <Button title="Get started" onPress={() => Actions.chooseUsername()}/>

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
    content: {
        marginTop: 70,
    },
    logo: {
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 35,
        fontWeight: '800',
        fontStyle: 'italic',
        textAlign: 'center',
        color: colors.white,
    },
    tagline: {
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 20,
        color: colors.white,
        textAlign: 'center',
        fontWeight: '500',
    }
})

export default Splash
