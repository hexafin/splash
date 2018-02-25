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
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import {connect} from "react-redux";
import {colors} from "../../lib/colors"
import {defaults} from "../../lib/styles"
import BackButton from "../universal/BackButton";
import {Actions} from "react-native-router-flux"
import GenericLine from "../universal/GenericLine"
import AddressLine from "../universal/AddressLine"
import EmojiCircle from "../universal/EmojiCircle"
import {ifIphoneX} from "react-native-iphone-x-helper";

// list of emojis to be rendered. 3 per row
const emojis = [
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
        const amount = (relativeAmount/this.props.exchangeRateBTC).toFixed(4)
        this.setState({relativeAmount: relativeAmount, amount: amount})
    }

    confirmAmount = () => {
      if (this.props.relativeBalance > parseFloat(this.state.relativeAmount) || this.props.transactionType == 'request') {
        const callback = () => this.props.CreateTransaction({
                                                              transactionType: this.props.transactionType,
                                                              other_person: this.props.to,
                                                              emoji: emojis[this.state.selectedEmojiFirst][this.state.selectedEmojiSecond],
                                                              relative_amount: this.state.relativeAmount,
                                                              amount: this.state.amount,
                                                              })
        const to_user = this.props.transactionType == 'external' ? "a " + this.props.to.currency + " address" : "@" + this.props.to.username
        const title = this.props.transactionType == 'send' ? "Confirm Payment" : "Confirm Request"
        const text = (this.props.transactionType == 'send' || this.props.transactionType == 'external') ? "You are sending $" + this.state.relativeAmount + " to " + to_user :
                                                          "You are requesting $" + this.state.relativeAmount + " from " + to_user

        Actions.notify({
                        emoji: "💵",
                        title: title,
                        text: text,
                        buttonText: "Confirm",
                        callback: callback
                      })
      } else {
        Actions.notify({
                        emoji: "❌",
                        title: 'Insufficient Funds',
                        text: 'You do not have enough balance to process that transaction'
                      })
      }
    }

    render() {
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.page}>
                    <BackButton onPress={() => Actions.home()} type="right"/>
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
                    {typeof this.props.to.currency === 'undefined' && <GenericLine {...this.props.to} type={'none'} friendCallback={Keyboard.dismiss}/>}
                    {typeof this.props.to.currency !== 'undefined' && <AddressLine {...this.props.to} type={'none'} friendCallback={Keyboard.dismiss}/>}
                    <Text style={styles.sectionHeader}>Select category</Text>
                </View>
                <ScrollView style={{flex: 1, backgroundColor: 'white'}} keyboardShouldPersistTaps={'never'}>
                    {this.renderEmojis()}
                </ScrollView>
                <View style={styles.footerWrapper}>
                    <TouchableOpacity style={styles.footer}
                                      disabled={(this.state.amount <= 0 || this.state.selectedEmojiFirst == null)}
                                      onPress={() => this.confirmAmount()}>
                        {(this.props.transactionType == 'send' || this.props.transactionType == 'external') && !this.props.isCreatingTransaction &&
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
          </TouchableWithoutFeedback>
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
