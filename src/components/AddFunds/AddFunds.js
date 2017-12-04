
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


const AddFunds = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerEmoji}>👍</Text>
                <Text style={styles.headerText}>Wallet created. Now, let's add some funds!</Text>
            </View>
            <View style={styles.containerSpacer}></View>
            <View style={styles.footer}>
                <Button title="I don't have bitcoin yet" onPress={() => {}}/>
                <View style={styles.footerSpacer}></View>
                <Button title="I already have bitcoin" onPress={() => {}}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: colors.white,
        padding: 30,
        paddingTop: 50,
        paddingBottom: 60
    },
    containerSpacer: {
        flex: 1
    },
    header: {
        flex: 3,
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
    footer: {
        flex: 0,
        flexDirection: "column"
    },
    footerSpacer: {
        padding: 10
    }
})

export default AddFunds