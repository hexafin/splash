// presentational component for splash page

import React from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native"
import {colors} from "../../lib/colors"
import Button from "../universal/Button"

import {Actions} from "react-native-router-flux"


const Home = ({person, transactions}) => {
    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <Image style={styles.profileImage} source={{uri: person.picture_url}} />
                <View style={styles.profileTextWrapper}>
                    <Text style={styles.profileUsername}>@{person.username}</Text>
                    <Text style={styles.profileFullName}>{person.first_name} {person.last_name}</Text>
                </View>
            </View>
            <View style={styles.balance}>
                <Text style={styles.balanceUSD}>$50</Text>
                <Text style={styles.balanceBTC}>0.0024 BTC</Text>
                <Text style={styles.balanceDescription}>Your bitcoin</Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.bodyTitle}>
                    Make your first transaction <Text style={styles.bodyTitleEmoji}>☝️</Text>
                </Text>
                <Button title="Send Bitcoin"/>
                <View style={styles.bodySpacer}/>
                <Button title="Request Bitcoin"/>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => {}} style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>
                        Request
                    </Text>
                </TouchableOpacity>
                <View style={styles.footerDivider}/>
                <TouchableOpacity onPress={() => {}} style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>
                        Pay
                    </Text>
                </TouchableOpacity>
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
        paddingTop: 25
    },
    profile: {
        flexDirection: "row",
        padding: 15,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },
    profileTextWrapper: {
        flexDirection: "column",
        justifyContent: "center"
    },
    profileUsername: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.nearBlack
    },
    profileFullName: {
        fontSize: 16,
        fontWeight: "500",
        color: colors.gray
    },
    balance: {
        marginTop: 20,
        flexDirection: "column",
        justifyContent: "center"
    },
    balanceUSD: {
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        color: colors.purple
    },
    balanceBTC: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "400",
        color: colors.gray
    },
    balanceDescription: {
        textAlign: "center",
        marginTop: 2,
        fontSize: 15,
        fontWeight: "bold",
        color: colors.nearBlack
    },
    body: {
        flex: 1,
        padding: 30,
    },
    bodyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.nearBlack,
        paddingBottom: 20
    },
    bodyTitleEmoji: {
        fontSize: 30
    },
    bodySpacer: {
        padding: 10
    },
    footer: {
        flex: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        shadowColor: colors.lightShadow,
        shadowOffset: {
            width: 0,
            height: -5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        backgroundColor: colors.gray
    },
    footerDivider: {
        width: 1,
        backgroundColor: colors.nearWhite
    },
    footerButton: {
        width: "50%",
        padding: 20,
        justifyContent: 'center',
        backgroundColor: colors.white
    },
    footerButtonText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600',
        color: colors.purple
    }
})

export default Home