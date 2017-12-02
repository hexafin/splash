// presentational component for splash page

import React from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"
import Button from "../universal/Button"

import {Actions} from "react-native-router-flux"


const ChooseUsername = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerEmoji}>🎅</Text>
                <Text style={styles.headerText}>Choose your username</Text>
                <Text style={styles.headerText}>- it's yours, forever.</Text>
            </View>
            <View style={styles.body}>
                <View style={{backgroundColor: colors.purple, flex: 1}}></View>
                <Text style={styles.bodyText}>
                    Your username will be the way people can find you in the app and send money to you.
                </Text>
            </View>
            <Button style={{flex: 0}} title="Set username" onPress={() => Actions.home}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: colors.white,
        padding: 20,
        paddingTop: 50,
        paddingBottom: 50
    },
    header: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center"
    },
    headerEmoji: {
        fontSize: 40,
        flexDirection: "row",
        textAlign: "center",
        padding: 5
    },
    headerText: {
        flexDirection: "row",
        fontSize: 25,
        textAlign: "center",
        paddingTop: 5,
        fontWeight: "600",
        color: colors.nearBlack
    },
    body: {
        paddingTop: 50,
        flex: 2,
        flexDirection: "column",
        justifyContent: "center"
    },
    bodyText: {
        flex: 1,
        marginTop: 20,
        color: colors.gray,
        textAlign: "center",
        fontSize: 20
    }
})

export default ChooseUsername