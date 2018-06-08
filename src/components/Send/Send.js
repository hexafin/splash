import React, { Component } from "react";
import {
	View,
	KeyboardAvoidingView,
	Alert,
	Text,
	StyleSheet,
	Image,
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

let bitcoin = require('bitcoinjs-lib')

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
				<Image source={require("../../assets/images/header.png")} resizeMode="cover" style={styles.headerImage}/>
				<View style={styles.header}>
					<FlatBackButton color="white" onPress={() => {
						this.props.navigation.goBack()
					}}/>
					<TouchableWithoutFeedback onPress={handleBalancePress}>
						<View style={styles.balanceWrapper}>
							{balance != null && <Text style={styles.balanceText}>{balance[this.state.currency]}</Text>}
							<View style={styles.balanceCurrencyWrapper}>
								<Image source={icons.refresh} style={styles.refreshIcon}/>
								<Text style={styles.balanceCurrencyText}>{this.state.currency}</Text>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
				<View style={styles.body}>
					<Text style={styles.SendText}>Send bitcoin</Text>
					<Text style={styles.inputText}>To address</Text>
                    <Field name='address' component={Input}
                        autoCapitalize="none" autoCorrect={false} spellCheck={false}/>
					<Text style={styles.inputText}>{this.state.currency} amount</Text>
                    <Field name='amount' component={Input}
                        autoCapitalize="none" autoCorrect={false} spellCheck={false}/>
					<Button style={{marginTop: 10}} title={'Send'} primary={true} onPress={handleSend}/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		...defaults.container
	},
	headerImage: {
		position: "absolute",
		width: Dimensions.get('window').width,
		height: 300,
		top: (isIphoneX()) ? -120 : -140
	},
	header: {
		height: 130,
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 35,
		paddingTop: 60
	},
	headerLogo: {
		width: 24,
		height: 32,
	},
	balanceWrapper: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	balanceText: {
		color: colors.white,
		fontWeight: "600",
		fontSize: 34,
		backgroundColor: 'rgba(0,0,0,0)'
	},
	balanceCurrencyWrapper: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: 'rgba(0,0,0,0)'
	},
	balanceCurrencyText: {
		color: "rgba(255,255,255,0.7)",
		fontSize: 14,
		fontWeight: "600",
		marginLeft: 5
	},
	refreshIcon: {
		width: 15,
		height: 13
	},
	body: {
		flex: 1,
		paddingHorizontal: 24,
		flexDirection: "column",
	},
	SendText: {
		fontSize: 18,
		fontWeight: "700",
		color: colors.nearBlack
	},
	inputText: {
		fontSize: 15,
		fontWeight: "700",
		backgroundColor: 'rgba(0,0,0,0)',
		color: "#B3B3B3",
		paddingBottom: 6,
		paddingTop: 7
	},
	logoutText: {
		fontSize: 17,
		fontWeight: "700",
		color: '#3F41FA',
		alignSelf: 'center',
		backgroundColor: 'rgba(0,0,0,0)'
	}
});

export default reduxForm({
   form: 'sendForm',
   destroyOnUnmount: true,
})(Send)
