import React from "react"
import {
    View,
    Text,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    Image,
    Modal
} from "react-native"
import {colors} from "../../lib/colors"
import {cryptoTitleDict, cryptoUnits, currencySymbolDict} from "../../lib/cryptos"
import {defaults, icons} from "../../lib/styles"
import Button from "../universal/Button"
import {Actions} from "react-native-router-flux"

const CurrencyCard = ({icon, currency, amount, exchangeRate, defaultCurrency}) => {

    const cryptoTitle = cryptoTitleDict[currency]
    const trueAmount = amount/cryptoUnits[currency]
    const relativeAmount = (exchangeRate*trueAmount).toFixed(2)

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={styles.header}>
                    <Image style={styles.icon} source={icon}/>
                    <Text style={styles.title}>{cryptoTitle}</Text>
                </View>
                <View style={styles.balanceWrapper}>
                    <Text style={styles.balanceAmount}>{trueAmount.toFixed(4)}</Text>
                    <Text style={styles.balanceLabel}>{currency}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.exchangeRate}>
                    1 {currency} = {currencySymbolDict[defaultCurrency]}{exchangeRate} {defaultCurrency}
                </Text>
                <View style={styles.relativeBalanceWrapper}>
                    <Text style={styles.relativeBalanceAmount}>{currencySymbolDict[defaultCurrency]}{relativeAmount}</Text>
                    <Text style={styles.relativeBalanceLabel}>{defaultCurrency}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => {Actions.wallet({currency: currency})}}>
                <Text style={styles.buttonText}>View wallet</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "column",
        borderRadius: 10,
        marginBottom: 50,
        ...defaults.shadow
    },
    row: {
        padding: 15,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    icon: {
        height: 30,
        width: 30,
        marginRight: 10
    },
    title: {
        fontWeight: "800",
        fontSize: 20,
        color: colors.nearBlack
    },
    balanceWrapper: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    balanceAmount: {
        fontWeight: "800",
        color: colors.nearBlack,
        fontSize: 16,
        marginRight: 5,
    },
    balanceLabel: {
        fontWeight: "400",
        color: colors.nearBlack,
        fontSize: 16
    },
    exchangeRate: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    exchangeRateText: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: "400",
        color: colors.lightGray
    },
    relativeBalanceWrapper: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    relativeBalanceAmount: {
        fontWeight: "800",
        color: colors.nearBlack,
        fontSize: 16,
        marginRight: 5,
    },
    relativeBalanceLabel: {
        fontWeight: "400",
        color: colors.nearBlack,
        fontSize: 16
    },
    button: {
        backgroundColor: colors.purple,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: colors.white,
        fontWeight: "800",
        fontSize: 20
    }
})

export default CurrencyCard
