import React from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    SectionList,
} from "react-native"
import {colors} from "../../lib/colors"
import Button from "../universal/Button"
import Friend from '../universal/Friend';

import {Actions} from "react-native-router-flux"

//dummy data to be removed
const request = {
    type: 'request',
    name: 'Maddy Kennedy',
    username: 'mads',
    picture_url: 'https://graph.facebook.com/100001753341179/picture?type=large',
    usdValue: 50,
    btcValue: 0.045,
    emoji: '😍',
    date: '1:00 11/17'
}
const waiting = {
    type: 'waiting',
    name: 'Maddy Kennedy',
    username: 'mads',
    picture_url: 'https://graph.facebook.com/100001753341179/picture?type=large',
    usdValue: 50,
    btcValue: 0.045,
    emoji: '😍',
    date: '1:00 11/17'
}
const transaction = {
    type: 'transaction',
    name: 'Maddy Kennedy',
    username: 'mads',
    picture_url: 'https://graph.facebook.com/100001753341179/picture?type=large',
    usdValue: 50,
    btcValue: 0.045,
    emoji: '😍',
    date: '1:00 11/17'
}

const transactions_dummy = [request, request, request, waiting, waiting, waiting, transaction, transaction, transaction]

const Home = ({person, transactions}) => {

    // render blank screen w/o transactions
    const renderBlank = (
        <View key={0} style={{flex: 1, padding: 30}}>
            <Text style={styles.bodyTitle}>
                Make your first transaction <Text style={styles.bodyTitleEmoji}>☝️</Text>
            </Text>
            <Button title="Deposit Bitcoin"/>
            <View style={styles.bodySpacer}/>
            <Button title="Request Bitcoin"/>
        </View>
    )

    const sections = [
        {data: [], title: 'Requests', type: 'request'},
        {data: [], title: 'Waiting on', type: 'waiting'},
        {data: [], title: 'History', type: 'transaction'},
    ];

    // build and order sections from transaction data
    // TODO: use real transaction data structure to organize
    // use transactions_dummy instead of transactions to load dummy data
    const buildSections = sections.map((section, sectionIndex) => {
        let data = [];
        for (let i = 0; i < transactions.items.length; i++) {
            const transaction = transactions.items[i];
            if (transaction.type == section.type) {
                data.push({...transaction, key: (sectionIndex.toString() + i.toString())})
            }
        }
        if (data.length == 0) {
            return {...section, title: ''}
        }
        return {...section, data: data}
    });

    //create sectionList with built data
    const renderSections = (
        <View key={0} style={{flex: 1}}>
            <SectionList style={{paddingHorizontal: 15, marginTop: 15}}
                         stickySectionHeadersEnabled={false}
                         renderItem={({item}) => <Friend {...item}/>}
                         renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                         sections={buildSections}
            />
        </View>
    )

    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <Image style={styles.profileImage} source={{uri: person.picture_url}}/>
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
            {/* if there are no transactions render blank*/}
            {transactions.items.length == 0 && renderBlank}
            {/* if there are  transactions render them in sectionList*/}
            {transactions.items.length !== 0 && renderSections}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => Actions.transaction({transactionType: 'request'})} style={styles.footerButton}>
                    <Text style={styles.footerButtonText}>
                        Request
                    </Text>
                </TouchableOpacity>
                <View style={styles.footerDivider}/>
                <TouchableOpacity onPress={() => Actions.transaction({transactionType: 'pay'})} style={styles.footerButton}>
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
        backgroundColor: colors.white
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
