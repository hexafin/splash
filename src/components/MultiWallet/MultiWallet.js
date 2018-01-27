
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
import {defaults, icons} from "../../lib/styles"
import Button from "../universal/Button"
import GenericLine from "../universal/GenericLine"
import {Input} from "../universal/Input"
import BackButton from "../universal/BackButton"
import {Actions} from "react-native-router-flux"
import CurrencyCard from "./CurrencyCard"
import {cryptoNames, cryptoUnits, currencySymbolDict} from "../../lib/cryptos"

const MultiWallet = ({crypto, exchangeRate, defaultCurrency}) => {

    const calculateTotalBalance = (cryptoNames) => {
        let balance = 0
        for (let i=0; i<cryptoNames.length; i++) {
            const currency = cryptoNames[i]
            const relativeBalance = crypto[currency].balance/cryptoUnits[currency]*exchangeRate[currency][defaultCurrency]
            balance = balance + relativeBalance
        }
        return balance.toFixed(2)
    }

    const buildCurrencyCards = (cryptoNames) => {
        let cards = []
        for (let i=0; i<cryptoNames.length; i++) {
            const currency = cryptoNames[i]
            cards.push(
                <CurrencyCard
                    key={currency}
                    icon={icons[currency]}
                    currency={currency}
                    amount={crypto[currency].balance}
                    exchangeRate={exchangeRate[currency][defaultCurrency]}
                    defaultCurrency={defaultCurrency}
                />
            )
        }
        return cards
    }

    return (
        <View style={styles.container}>
            <BackButton onPress={() => Actions.pop()} type="right"/>

            <View style={styles.header}>
                <Text style={styles.headerBalance}>
                    {currencySymbolDict[defaultCurrency]}
                    {calculateTotalBalance(cryptoNames)}
                </Text>
                <Text style={styles.headerTitle}>Your money</Text>
            </View>

            <View style={styles.body}>
                {buildCurrencyCards(cryptoNames)}
            </View>

        </View>
    )

};

export default MultiWallet;

const styles = StyleSheet.create({
    container: {
        ...defaults.container,
        padding: 20,
        flexDirection: "column"
    },
    header: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: "center",
        paddingTop: 80,
        paddingBottom: 80
    },
    headerBalance: {
        color: colors.purple,
        fontSize: 38,
        fontWeight: "600"
    },
    headerTitle: {
        color: colors.nearBlack,
        fontSize: 18,
        fontWeight: '800'
    }

});
