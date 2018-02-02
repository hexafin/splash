
import React from "react"
import {
    View,
    Text,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Modal
} from "react-native"
import {colors} from "../../lib/colors"
import {defaults, icons} from "../../lib/styles"
import Button from '../universal/Button'
import BackButton from "../universal/BackButton"
import {Actions} from "react-native-router-flux"
import {cryptoNames, cryptoNameDict, cryptoUnits, currencySymbolDict} from "../../lib/cryptos"
import EmojiButton from "../universal/EmojiButton"
import api from "../../api"

const Wallet = ({currency, crypto, exchangeRate, defaultCurrency, GetCrypto}) => {

    const amount = crypto[currency].balance
    const address = crypto[currency].address
    const cryptoName = cryptoNameDict[currency]
    const trueAmount = amount/cryptoUnits[currency]
    const relativeAmount = (exchangeRate[currency][defaultCurrency]*trueAmount).toFixed(2)
    const qrCode = "https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl="+address

    return (
        <View style={styles.container}>
            <BackButton onPress={() => Actions.pop()} type="right"/>

            <View style={styles.header}>
                <Image style={styles.icon} source={icons[currency]}/>
                <Text style={styles.title}>Your {cryptoName}</Text>
            </View>

            <View style={styles.balance}>
                <View style={styles.balanceTop}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.balanceTitle}>Balance</Text>
                      {crypto.loading && <ActivityIndicator size='small' color={colors.purple}/>}
                    </View>
                    <EmojiButton
                        style={styles.balanceRefreshButton}
                        title={"Refresh"} emoji={"⚡️"}
                        onPress={() => {GetCrypto()}}
                    />
                </View>
                <View style={styles.balanceBottom}>
                    <View style={styles.balanceAmountWrapper}>
                        <Text style={styles.balanceAmountValue}>{trueAmount.toFixed(4)}</Text>
                        <Text style={styles.balanceAmountLabel}>{currency}</Text>
                    </View>
                    <View style={styles.balanceRelativeAmountWrapper}>
                        <Text style={styles.balanceRelativeAmountValue}>
                            {currencySymbolDict[defaultCurrency]}
                            {relativeAmount}
                        </Text>
                        <Text style={styles.balanceRelativeAmountLabel}>{defaultCurrency}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.address}>
                <Text style={styles.addressTitle}>Address</Text>
                <View style={styles.addressBodyWrapper}>
                    <View style={styles.addressButtonColumn}>
                        <TouchableOpacity style={styles.addressButton} onPress={() => {console.log("TODO: share address")}}>
                            <Text style={styles.addressButtonText}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addressButton} onPress={() => {console.log("TODO: copy address")}}>
                            <Text style={styles.addressButtonText}>Copy</Text>
                        </TouchableOpacity>
                    </View>
                    <Image style={styles.addressQR} source={{uri: qrCode}}/>
                </View>
                <Text style={styles.addressText}>{address}</Text>
            </View>

            <Button
                style={styles.button}
                primary={false}
                onPress={() => {console.log("TODO: launch coinbase transfer")}}
                title={"Exchange "+cryptoName}
            />

        </View>
    )

};

export default Wallet;

const styles = StyleSheet.create({
    container: {
        ...defaults.container,
        padding: 20,
        flexDirection: "column",
        justifyContent: "space-around",
        paddingBottom: 60
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 100,
        paddingBottom: 30
    },
    icon: {
        width: 40,
        height: 40,
        marginLeft: 10,
        marginRight: 15
    },
    title: {
        fontWeight: "700",
        fontSize: 22,
        color: colors.nearBlack
    },
    balance: {
        ...defaults.shadow,
        padding: 20,
        flexDirection: "column",
        justifyContent: "space-between",
        marginBottom: 30,
        borderRadius: 10
    },
    balanceTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
    },
    balanceBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    balanceTitle: {
        fontWeight: "800",
        color: colors.nearBlack,
        fontSize: 22,
        paddingRight: 5,
    },
    balanceRefreshButton: {},
    balanceAmountWrapper: {
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    balanceAmountValue: {
        fontSize: 18,
        fontWeight: "800",
        color: colors.nearBlack
    },
    balanceAmountLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.nearBlack,
        marginLeft: 5
    },
    balanceRelativeAmountWrapper: {
        flexDirection: "row",
        justifyContent: "flex-start"
    },
    balanceRelativeAmountValue: {
        fontSize: 18,
        fontWeight: "800",
        color: colors.nearBlack
    },
    balanceRelativeAmountLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.nearBlack,
        marginLeft: 5
    },
    address: {
        ...defaults.shadow,
        padding: 20,
        paddingBottom: 10,
        paddingRight: 0,
        flexDirection: "column",
        marginBottom: 30,
        borderRadius: 10,
    },
    addressTitle: {
        fontWeight: "800",
        color: colors.nearBlack,
        fontSize: 22
    },
    addressBodyWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    addressButtonColumn: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingTop: 25,
        paddingBottom: 25
    },
    addressButton: {
        width: 120,
        borderRadius: 5,
        paddingTop: 12,
        paddingBottom: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        ...defaults.shadow
    },
    addressButtonText: {
        color: colors.nearBlack,
        fontWeight: "700",
        fontSize: 18
    },
    addressQR: {
        width: 160,
        height: 160
    },
    addressText: {
        color: colors.lightGray,
        fontSize: 14,
        fontWeight: "600",
        paddingRight: 20
    }
});
