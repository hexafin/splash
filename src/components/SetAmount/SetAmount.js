/* @flow weak */
import React, {Component} from 'react';
import {
    View,
    KeyboardAvoidingView,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"
import BackButton from "../universal/BackButton";
import {Actions} from "react-native-router-flux"
import Friend from "../universal/Friend"
import EmojiCircle from "../universal/EmojiCircle"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {ifIphoneX} from "react-native-iphone-x-helper";

// list of emojis to be rendered. 3 per row
let emojis = [
    ['🍔', '⚽️', '🚗'],
    ['💩', '😀', '🍹'],
    ['🍕', '🚀', '😍'],
    ['😎', '🎉', '🛏'],
]

export default class SetAmount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedEmojiFirst: null,
            selectedEmojiSecond: null,
            btcAmount: 0,
            usdAmount: '',
        };

    }

    //update the selected emoji
    changeEmoji = (i, j) => {
        this.setState({selectedEmojiFirst: i, selectedEmojiSecond: j})
    }

    // create rows of emojis with selected emoji given active parameter
    renderEmojis() {
        return emojis.map((emojiRow, index) => {
            return (
                <View key={index} style={styles.emojiRow}>
                    <EmojiCircle emoji={emojiRow[0]}
                                 active={(this.state.selectedEmojiFirst == index && this.state.selectedEmojiSecond == 0)}
                                 pressCallback={() => this.changeEmoji(index, 0)}/>
                    <EmojiCircle emoji={emojiRow[1]}
                                 active={(this.state.selectedEmojiFirst == index && this.state.selectedEmojiSecond == 1)}
                                 pressCallback={() => this.changeEmoji(index, 1)}/>
                    <EmojiCircle emoji={emojiRow[2]}
                                 active={(this.state.selectedEmojiFirst == index && this.state.selectedEmojiSecond == 2)}
                                 pressCallback={() => this.changeEmoji(index, 2)}/>
                </View>
            )
        })
    }

    // real time convert USD to bitcoin and save to state
    inputChange = (e) => {
        //TODO: use real btc exchange rate
        const btcExchange = 0.004
        const usdAmount = e.replace(/[^\d.-]/g, '')
        const btcAmount = (btcExchange * usdAmount).toFixed(4)
        this.setState({usdAmount: usdAmount, btcAmount: btcAmount})
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.page}>
                    <BackButton onPress={() => Actions.pop()} type="right"/>
                    <Text style={styles.pageTitle}>Choose amount</Text>
                    <View style={styles.balance}>
                        <TextInput
                            placeholder={'$0'}
                            keyboardType={'numeric'}
                            maxLength={7}
                            autoFocus={true}
                            style={styles.balanceUSD}
                            onChangeText={this.inputChange}
                            value={(this.state.usdAmount == '' ? '' : '$' + this.state.usdAmount)}/>
                        <Text style={styles.balanceBTC}>{this.state.btcAmount} BTC</Text>
                    </View>
                    <Text style={styles.sectionHeader}>Recipient</Text>
                    <Friend {...this.props.to} type={'none'}/>
                    <Text style={styles.sectionHeader}>Select category</Text>
                </View>
                <ScrollView style={{flex: 1, backgroundColor: 'white'}} keyboardShouldPersistTaps="never">
                    {this.renderEmojis()}
                </ScrollView>
                <View style={styles.footerWrapper}>
                    <TouchableOpacity style={styles.footer}
                                      disabled={(this.state.btcAmount <= 0 || this.state.selectedEmojiFirst == null)}
                                      onPress={() => Actions.receipt({
                                          transactionType: this.props.transactionType,
                                          to: this.props.to,
                                          emoji: emojis[this.state.selectedEmojiFirst][this.state.selectedEmojiSecond],
                                          usdAmount: this.state.usdAmount,
                                          btcAmount: this.state.btcAmount
                                      })}>
                        {this.props.transactionType == 'pay' &&
                        <Text style={styles.footerButtonText}>
                            Pay
                        </Text>}
                        {this.props.transactionType == 'request' &&
                        <Text style={styles.footerButtonText}>
                            Request payment
                        </Text>}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        ...defaults.container,
        paddingBottom: 0,
    },
    page: {
        backgroundColor: colors.white,
        paddingTop: 40,
        paddingHorizontal: 22,
    },
    pageTitle: {
        color: colors.nearBlack,
        fontSize: 26,
        fontWeight: '900',
    },
    balance: {
        marginTop: 10,
        flexDirection: "column",
        justifyContent: "center"
    },
    balanceUSD: {
        textAlign: "center",
        fontSize: 39,
        fontWeight: "700",
        color: colors.purple
    },
    balanceBTC: {
        textAlign: "center",
        fontSize: 14,
        color: colors.gray
    },
    sectionHeader: {
        paddingTop: 15,
        color: colors.nearBlack,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emojiRow: {
        backgroundColor: colors.white,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    footerWrapper: {
        backgroundColor: colors.purple
    },
    footer: {
        flex: 0,
        padding: 20,
        ...ifIphoneX({
            paddingBottom: 40
        }, {
            paddingBottom: 20
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
        backgroundColor: colors.purple,
    },
    footerButtonText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600',
        color: colors.white,
    }
});
