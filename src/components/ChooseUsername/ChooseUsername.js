// presentational component for splash page

import React from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import {colors} from "../../lib/colors"


const ChooseUsername = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerEmoji}>🎅</Text>
                <Text style={styles.headerText}>Choose your username</Text>
                <Text style={styles.headerText}>- it's yours, forever.</Text>
            </View>
            <View style={styles.body}>
                {/* @username input */}
                <Text style={styles.bodyText}>
                    Your username will be the way people can find you in the app and send money to you.
                </Text>
            </View>
            <TouchableOpacity style={styles.bottomButton}><Text>test</Text></TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: colors.white,
        padding: 50
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
        flex: 2
    },
    bodyText: {
        marginTop: 20,
        color: colors.gray,
        textAlign: "center",
        fontSize: 20
    },
    bottomButton: {
        flex: 0,
        padding: 20,
        backgroundColor: colors.purple
    }
})

export default ChooseUsername