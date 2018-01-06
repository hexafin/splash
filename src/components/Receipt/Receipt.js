/* @flow weak */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Friend from "../universal/Friend"
import BackButton from "../universal/BackButton"
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"
import {Actions} from "react-native-router-flux"
import {ifIphoneX} from "react-native-iphone-x-helper";


const Receipt = ({transactionType, to, emoji, btcAmount, usdAmount, LoadApp}) => (
    <View style={styles.container}>
        <View style={styles.page}>
            {transactionType == 'pay' && <Text style={styles.header}>Payment sent 🚀</Text>}
            {transactionType == 'request' && <Text style={styles.header}>Request sent 🚀</Text>}
            <View style={styles.balance}>
                <Text style={styles.balanceUSD}>${usdAmount}</Text>
                <Text style={styles.balanceBTC}>{btcAmount} BTC</Text>
            </View>
            <Friend {...to} emoji={emoji} type={'emoji'}/>
            {transactionType == 'request' &&
            [<Text key={0} style={styles.descriptionText}>We’ll send {to.name} your request.</Text>,
                <Text key={1} style={styles.descriptionText}>Once they accept, They will receive</Text>,
                <Text key={2} style={styles.descriptionText}>the bitcoin in less than 1 hour.</Text>]}
            {transactionType == 'pay' &&
            [<Text key={0} style={styles.descriptionText}>We’ll send {to.name} your payment.</Text>,
                <Text key={1} style={styles.descriptionText}>They’ll receive the bitcoin</Text>,
                <Text key={2} style={styles.descriptionText}>in less than 1 hour.</Text>]}
        </View>
        <TouchableOpacity style={styles.footer} onPress={() => LoadApp()}>
            <Text style={styles.footerButtonText}>
                Back to home
            </Text>
        </TouchableOpacity>
    </View>
);

export default Receipt;

const styles = StyleSheet.create({
    container: {
        ...defaults.container
    },
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,

    },
    header: {
        color: colors.nearBlack,
        fontSize: 26,
        fontWeight: '900',
    },
    balance: {
        marginVertical: 10,
        flexDirection: "column",
        justifyContent: "center"
    },
    balanceUSD: {
        textAlign: "center",
        fontSize: 39,
        fontWeight: "bold",
        color: colors.purple
    },
    balanceBTC: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "400",
        color: colors.gray
    },
    descriptionText: {
        fontSize: 16,
        paddingTop: 2,
        fontWeight: "400",
        color: colors.lightGrey,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    footer: {
        flex: 0,
        padding: 20,
        ...ifIphoneX({
            marginBottom: 20
        }),
        flexDirection: "row",
        justifyContent: "center",
        shadowColor: colors.lightShadow,
        shadowOffset: {
            width: 0,
            height: -5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        backgroundColor: colors.white,
    },
    footerButtonText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600',
        color: colors.purple,
    }
});
