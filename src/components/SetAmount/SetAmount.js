/* @flow weak */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import {connect} from "react-redux";
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"
import BackButton from "../universal/BackButton";
import {Actions} from "react-native-router-flux"
import GenericLine from "../universal/GenericLine"
import EmojiCircle from "../universal/EmojiCircle"
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
            amount: 0,
            relativeAmount: '',
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
        const relativeAmount = e.replace(/[^\d.-]/g, '')
        const amount = (relativeAmount/this.props.ExchangeRate).toFixed(4)
        this.setState({relativeAmount: relativeAmount, amount: amount})
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
                            style={styles.balanceRelativeCurrency}
                            onChangeText={this.inputChange}
                            value={(this.state.relativeAmount == '' ? '' : '$' + this.state.relativeAmount)}/>
                        <Text style={styles.balanceCurrency}>{this.state.amount} BTC</Text>
                    </View>
                    <Text style={styles.sectionHeader}>Recipient</Text>
                    <GenericLine {...this.props.to} type={'none'}/>
                    <Text style={styles.sectionHeader}>Select category</Text>
                </View>
                <ScrollView style={{flex: 1, backgroundColor: 'white'}} keyboardShouldPersistTaps={'never'}>
                    {this.renderEmojis()}
                </ScrollView>
                <View style={styles.footerWrapper}>
                    <TouchableOpacity style={styles.footer}
                                      disabled={(this.state.amount <= 0 || this.state.selectedEmojiFirst == null)}
                                      onPress={() => this.props.CreateTransaction({
                                                                                  transactionType: this.props.transactionType,
                                                                                  other_person: this.props.to,
                                                                                  emoji: emojis[this.state.selectedEmojiFirst][this.state.selectedEmojiSecond],
                                                                                  relative_amount: this.state.relativeAmount,
                                                                                  amount: this.state.amount,
                                                                                  })}>
                        {this.props.transactionType == 'send' && !this.props.isCreatingTransaction &&
                          <Text style={styles.footerButtonText}>
                              Send bitcoin
                          </Text>}
                        {this.props.transactionType == 'request' && !this.props.isCreatingTransaction &&
                          <Text style={styles.footerButtonText}>
                              Request bitcoin
                          </Text>}
                        {this.props.isCreatingTransaction &&
                          <ActivityIndicator size="large" color="white" />}
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
    balanceRelativeCurrency: {
        textAlign: "center",
        fontSize: 39,
        fontWeight: "700",
        color: colors.purple
    },
    balanceCurrency: {
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
