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
import BackButton from "../universal/BackButton"

import {Actions} from "react-native-router-flux"


const Welcome = ({LinkFacebook}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BackButton onPress={() => Actions.pop()}/>
                <Text style={styles.headerEmoji}>🙌</Text>
                <Text style={styles.headerText}>Welcome on board,</Text>
                <Text style={styles.headerUsername}>@bryce</Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.bodyText}>
                    Your friends will be able to send money to <Text style={{color: colors.purple}}>@bryce</Text>.
                </Text>
                <Text style={styles.bodyText}>
                    Finish setting up your account to save your username
                </Text>
            </View>
            <View style={styles.footer}>
                <Button title="Sign up with Facebook" onPress={() => LinkFacebook()}/>
                <Text style={styles.footerText}>
                    We will never post using your account.
                    We just use it to authenticate you and find your friends,
                    so you can send them bitcoin easily.
                </Text>
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
        padding: 20,
        paddingTop: 30,
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
    headerUsername: {
        flexDirection: "row",
        fontSize: 25,
        textAlign: "center",
        paddingTop: 5,
        fontWeight: "600",
        color: colors.purple
    },
    body: {
        padding: 30,
        paddingTop: 10,
        flex: 1,
        flexDirection: "column",
        justifyContent: "center"
    },
    bodyText: {
        marginTop: 20,
        color: colors.gray,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "400",
        backgroundColor: "transparent",
        lineHeight: 25
    },
    footerText: {
        marginTop: 20,
        color: colors.gray,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "400",
        backgroundColor: "transparent",
        lineHeight: 23
    },
    footer: {
        flex: 0,
        flexDirection: "column"
    }
})

export default Welcome