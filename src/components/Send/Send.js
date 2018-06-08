import React, { Component } from "react";
import {
	View,
	KeyboardAvoidingView,
	Alert,
	Text,
	StyleSheet,
	Image,
	Keyboard,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Dimensions
} from "react-native";
import { Field, reduxForm } from 'redux-form'
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import { isIphoneX } from "react-native-iphone-x-helper"
import FlatBackButton from "../universal/FlatBackButton"
import Button from "../universal/Button"
import {Input} from "../universal/Input"
import LoadingCircle from "../universal/LoadingCircle"

let bitcoin = require('bitcoinjs-lib')

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class Send extends Component {

	constructor(props) {
		super(props)
		this.state = {
			currency: "USD",
			balanceBtc: null,
			exchangeRate: null,
		}
	}

	 componentDidMount() {

		// get balance
        api.GetAddressBalance(this.props.bitcoinAddress, this.props.bitcoinNetwork).then(balanceBtc => {
			this.setState(prevState => {
				return {
					...prevState,
					balanceBtc
				}
			})
		}).catch(error => {
			Alert.alert("Could not load balance")
			this.setState(prevState => {
				return {
					...prevState,
					balanceBtc: null
				}
			})
		})

		// get exchange rate
        api.GetExchangeRate().then(exchangeRate => {
        	this.setState(prevState => {
        		return {
        			...prevState,
        			exchangeRate
        		}
        	})
        }).catch(error => {
        	this.setState(prevState => {
        		return {
        			...prevState,
        			exchangeRate: null
        		}
        	})
        })

	}



	render() {

		let balance = null
		if (this.state.exchangeRate != null && this.state.balanceBtc != null) {
			const rate = this.state.exchangeRate[this.state.currency]
			balance = {
				BTC: this.state.balanceBtc,
				USD: this.state.balanceBtc * rate
			}
		}

		const handleBalancePress = () => {
			this.setState(prevState => {
				return {
					...prevState,
					currency: (prevState.currency == "BTC") ? "USD" : "BTC"
				}
			})
		}

		const handleSend = () => {

			const amount = this.props.formAmount
			const address = this.props.formAddress
			const network = (this.props.bitcoinNetwork == 'testnet') ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
			try {

				bitcoin.address.toOutputScript(address, network)

				if (!balance) {
					Alert.alert("Unable to load balance")
				} else if (!this.props.formAmount) {
					Alert.alert("Please enter amount")
				} else if (!this.props.formAddress) {
					Alert.alert("Please enter address")
				} else if (parseFloat(amount) >= balance[this.state.currency]) {
					Alert.alert("Not enough balance")
				} else {
					this.props.navigation.navigate("ApproveTransactionModal", {
						address,
						amount: parseFloat(amount),
						currency: this.state.currency,
						exchangeRate: this.state.exchangeRate['USD']
					});
				}

			} catch(e) {
				Alert.alert("Invalid bitcoin address")
			}
		}

		return (
			<View style={styles.container}>
				<View style={styles.headerImageWrapper}>
					<Image source={require("../../assets/images/headerWave.png")} resizeMode="contain" style={styles.headerImage}/>
				</View>
				<View style={styles.header}>
					<FlatBackButton color="white" onPress={() => {
						Keyboard.dismiss()
						this.props.navigation.goBack()
					}}/>
					<TouchableWithoutFeedback onPress={handleBalancePress}>
						<View style={styles.balance}>
							{balance != null && <Text style={styles.balanceText}>{balance[this.state.currency]}</Text>}
							{balance == null && <LoadingCircle size={30}/>}
							<View style={styles.balanceCurrencyWrapper}>
								<Image source={icons.refresh} style={styles.refreshIcon}/>
								<Text style={styles.balanceCurrencyText}>{this.state.currency}</Text>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
				<View style={styles.body}>
					<Text style={styles.sendText}>Send bitcoin</Text>
					<Text style={styles.inputText}>To address</Text>
                    <Field name='address' component={Input} autoFocus={true}
                        autoCapitalize="none" autoCorrect={false} spellCheck={false}/>
					<Text style={styles.inputText}>{this.state.currency} amount</Text>
                    <Field name='amount' component={Input} keyboardType="numeric"
                        autoCapitalize="none" autoCorrect={false} spellCheck={false}/>
                    
					<Button style={styles.sendButton} title={'Send'} primary={true} onPress={handleSend}/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		...defaults.container
	},
	headerImageWrapper: {
		width: SCREEN_WIDTH,
		height: 240,
		overflow: "hidden",
		position: "absolute"
	},
	headerImage: {
		top: (isIphoneX()) ? -50 : -30,
		width: SCREEN_WIDTH,
		height: 240,
		overflow: "hidden",
		position: "absolute"
	},
	header: {
		height: 130,
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 35,
		paddingTop: 60
	},
	balance: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: (isIphoneX()) ? 60 : 40,
		width: SCREEN_WIDTH,
	},
	balanceText: {
		color: colors.white,
		fontWeight: "600",
		fontSize: 36,
		backgroundColor: "transparent"
	},
	balanceCurrencyWrapper: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "transparent"
	},
	balanceCurrencyText: {
		color: "rgba(255,255,255,0.7)",
		fontSize: 16,
		fontWeight: "600",
		marginLeft: 5
	},
	refreshIcon: {
		width: 16,
		height: 16
	},
	body: {
		flex: 1,
		padding: 20,
		marginTop: 0,
		flexDirection: "column",
	},
	sendText: {
		fontSize: 18,
		fontWeight: "700",
		color: colors.nearBlack
	},
	inputText: {
		fontSize: 15,
		fontWeight: "700",
		backgroundColor: 'rgba(0,0,0,0)',
		color: "#B3B3B3",
		paddingBottom: 8,
		paddingTop: 15
	},
	sendButton: {
		marginTop: 20
	}
});

export default reduxForm({
   form: 'sendForm',
   destroyOnUnmount: true,
})(Send)
