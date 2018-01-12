import React, {Component} from "react"
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    SectionList,
    Modal
} from "react-native"
import {colors} from "../../lib/colors"
import EmojiButton from "../universal/EmojiButton"
import Button from "../universal/Button"
import BackButton from "../universal/BackButton"
import Friend from '../universal/Friend'
import Wallet from '../Wallet'
import {Actions} from "react-native-router-flux"
import {defaults} from "../../lib/styles"
import api from '../../api'
import {cryptoNames, cryptoUnits, currencySymbolDict} from "../../lib/cryptos";

const Home = ({uid, person, crypto, exchangeRate, isLoadingTransactions, transactions, requests, waiting}) => {

    const defaultCurrency = person.default_currency

    // v1 - only bitcoin
    const balance = crypto.BTC.balance/cryptoUnits.BTC
    const relativeBalance = (balance*exchangeRate[defaultCurrency]).toFixed(2)

    // render blank screen w/o transactions
    const renderBlank = (
        <View key={0} style={{flex: 1, padding: 30}}>
            <Text style={styles.bodyTitle}>
                Make your first transaction <Text style={styles.bodyTitleEmoji}>☝️</Text>
            </Text>
            <Button title="Deposit bitcoin 💸" onPress={() => Actions.manageFunds()}/>
            <View style={styles.bodySpacer}/>
            <Button title="Ask a friend for bitcoin 🎁" onPress={() => Actions.transaction({transactionType: 'request'})}/>
        </View>
    )

    const sections = [
        {data: [], title: 'Requests', type: 'request'},
        {data: [], title: 'Waiting on', type: 'waiting'},
        {data: [], title: 'History', type: 'transaction'},
    ];

    // build and order sections from transaction data
    const buildSections = sections.map((section, sectionIndex) => {
        let data = [];
        const items = transactions.concat(requests, waiting)
        for (let i = 0; i < items.length; i++) {
            if (items[i] && items[i].type == section.type) {
                data.push(items[i])
            }
        }
        if (data.length == 0) {
            return {...section, title: ''}
        }
        return {...section, data: data}
    });

    //create sectionList with built data
    const renderSections = (
        <ScrollView key={0} style={{flex: 1}}>

            {/*<View style={styles.homeButtons}>*/}
                {/*<EmojiButton emoji="💸" onPress={() => Actions.manageFunds()} title="Funds"/>*/}
                {/*<View style={styles.emojiSpacer}/>*/}
                {/*<EmojiButton title="Give bitcoin, get bitcoin" emoji="🎁"/>*/}
            {/*</View>*/}

            <SectionList style={{paddingHorizontal: 15, marginTop: 15}}
                         stickySectionHeadersEnabled={false}
                         renderItem={({item}) => <Friend {...item}/>}
                         renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                         sections={buildSections}
            />
        </ScrollView>
    )

    const pictureUrl = "https://graph.facebook.com/"+person.facebook_id+"/picture?type=large"
    const emptyItems = (transactions.length == 0 && requests.length == 0 && waiting.length == 0)

    return (
        <View style={styles.container}>

            <View style={styles.header}>

                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.profile} onPress={() => Actions.profile()}>
                        <Image style={styles.profileImage} source={{uri: pictureUrl}}/>
                        <View style={styles.profileTextWrapper}>
                            <Text style={styles.profileFullName}>{person.first_name} {person.last_name}</Text>
                            <Text style={styles.profileUsername}>@{person.username}</Text>
                        </View>
                    </TouchableOpacity>



                </View>

                <TouchableOpacity style={styles.balance} onPress={() => Actions.multiWallet()}>
                    <Text style={styles.balanceRelativeCurrency}>{currencySymbolDict[defaultCurrency]}{relativeBalance}</Text>
                    <Text style={styles.balanceCurrency}>{balance} BTC</Text>
                    <Text style={styles.balanceDescription}>Your bitcoin</Text>
                </TouchableOpacity>

            </View>

            {/* if there are no transactions render blank*/}
            {(emptyItems || isLoadingTransactions) && renderBlank}
            {/* if there are  transactions render them in sectionList*/}
            {!emptyItems && !isLoadingTransactions && renderSections}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => Actions.transaction({transactionType: 'request'})} style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>
                        Request
                    </Text>
                </TouchableOpacity>
                <View style={styles.footerDivider}/>
                <TouchableOpacity onPress={() => Actions.transaction({transactionType: 'transaction'})} style={styles.footerButton}>
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
        ...defaults.container,
        paddingBottom: 0,
        flexDirection: "column",
        justifyContent: "space-around"
    },
    header: {
        flexDirection: "column",
    },
    topBar: {
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: colors.white,
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
    emojiSpacer: {
        width: 10
    },
    balance: {
        padding: 20,
        paddingTop: 0,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "transparent"
    },
    balanceRelativeCurrency: {
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        color: colors.purple
    },
    balanceCurrency: {
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
    homeButtons: {
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 10
    },
    sectionHeader: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        paddingTop: 5,
        color: colors.nearBlack,
        fontWeight: '900',
        fontSize: 19,
    },
    bodyTitle: {
        alignSelf: 'center',
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
        paddingBottom: 20,
        backgroundColor: colors.purple
    },
    footerDivider: {
        width: 1,
        backgroundColor: colors.nearWhite
    },
    footerButton: {
        width: "50%",
        padding: 20,
        justifyContent: 'center',
        backgroundColor: colors.purple
    },
    footerButtonText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600',
        color: colors.white
    }
})

export default Home
