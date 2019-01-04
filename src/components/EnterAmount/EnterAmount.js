import React, { Component } from "react";
import {
	Animated,
	Dimensions,
	TouchableWithoutFeedback,
	View,
	StyleSheet,
	Text,
	Image,
	Easing,
} from "react-native";
import { defaults, icons } from "../../lib/styles";
import { colors } from "../../lib/colors";
import { isIphoneX } from "react-native-iphone-x-helper";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Keypad from "../universal/Keypad";
import CloseButton from "../universal/CloseButton";
import NextButton from "../universal/NextButton";
import CurrencySwitcherLight from "../universal/CurrencySwitcherLight";

import { cryptoTitleDict, cryptoUnits, decimalToUnits, unitsToDecimal, decimalLengths } from "../../lib/cryptos"

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class EnterAmount extends Component {
	constructor(props) {
		super(props)
		this.state = {
			value: "",
			amount: 0,
			decimal: false,
			activeCurrency: 'USD',
		}
	}

	componentWillMount() {
		this.amountScale = new Animated.Value(1)
	}

	shouldComponentUpdate(nextProps, nextState) {

		if (nextState.value.length > 5) {
			Animated.timing(this.amountScale, {
				toValue: 1 - (nextState.value.length-5)*0.1,
				duration: 100,
			}).start()
		}
		else if (nextState.value.length <= 5 && this.state.value.length > 5) {
			Animated.timing(this.amountScale, {
				toValue: 1,
				duration: 100,
			}).start()
		}

		if (nextState.activeCurrency != this.state.activeCurrency) {
			// update amount with exchange rate
			let newAmount
			let newValue
			if (typeof this.state.amount == "number" && this.state.amount > 0) {
				const exchangeRate = decimalToUnits(this.props.exchangeRates[this.props.activeCryptoCurrency].USD, 'USD')
				newAmount = nextState.activeCurrency == "USD" 
					? Math.round((this.state.amount/cryptoUnits[this.props.activeCryptoCurrency]) * exchangeRate)
					: Math.round((this.state.amount/exchangeRate)*cryptoUnits[this.props.activeCryptoCurrency])
				newValue = unitsToDecimal(newAmount, nextState.activeCurrency)

			}
			else {
				newAmount = 0
				newValue = ""
			}
			this.setState({amount: newAmount, value: newValue })
			return true
		}
		else if (nextState.value != this.state.value) {
			return true
		}
		else if (nextState.amount != this.state.amount) {
			return true
		}
		else {
			return false
		}
	}

	render() {
		const cryptoBalance = this.props.balance[this.props.activeCryptoCurrency]
		const exchangeRates = this.props.exchangeRates[this.props.activeCryptoCurrency]
		const balance = {
			[this.props.activeCryptoCurrency]: cryptoBalance.toFixed(decimalLengths[this.props.activeCryptoCurrency]),
			USD: (cryptoBalance * (exchangeRates ? exchangeRates.USD : 0)).toFixed(2)
		}
		const amountOverBalance = (this.state.activeCurrency == "USD") 
			? balance.USD*cryptoUnits.USD <= this.state.amount
			: balance[this.props.activeCryptoCurrency]*cryptoUnits[this.props.activeCryptoCurrency] <= this.state.amount
		return (
			<View style={styles.wrapper}>

				<View style={styles.header}>
					<Text style={styles.title}>Sending {cryptoTitleDict[this.props.activeCryptoCurrency]}</Text>
				</View>

				<View style={styles.bodyWrapper}>
					<CurrencySwitcherLight
						fiat="USD" 
						crypto={this.props.activeCryptoCurrency}
						activeCurrency={this.state.activeCurrency}
						textColor={colors.primary} 
						switcherColor={"purple"}
						textSize={16}
						onSwitch={currency => {
							this.setState({activeCurrency: currency})
						}}
						style={{position: "absolute", left: 20, top: 40}}/>

					<View style={styles.amountWrapper} pointerEvents="none">
						<Animated.View style={[styles.amountTextWrapper, {
							transform: [{scale: this.amountScale}]
						}]}>
							{this.state.activeCurrency == "USD" && 
								<Text style={[styles.amountSuffix, {
									fontSize: 34, 
									paddingRight: 3,
									color: amountOverBalance ? colors.red : colors.primary,
								}]}>
									$
								</Text>}

							<Text style={[styles.amount, {
								opacity: this.state.value == "" ? 0.8 : 1.0,
								color: amountOverBalance ? colors.red : colors.primary,
							}]}>
								{this.state.value == "" ? 0 : this.state.value}
							</Text>

							{this.state.activeCurrency == this.props.activeCryptoCurrency && 
								<Text style={[styles.amountSuffix, {
									fontSize: 30, 
									paddingLeft: 5,
									color: amountOverBalance ? colors.red : colors.primary,
								}]}>{this.props.activeCryptoCurrency}</Text>}
						</Animated.View>
						<Text style={[styles.balance, {
							color: amountOverBalance ? colors.red : colors.gray,
						}]}>
							Balance: {this.state.activeCurrency == "USD" && "$"}{balance[this.state.activeCurrency]} 
							{this.state.activeCurrency == this.props.activeCryptoCurrency && " " + this.props.activeCryptoCurrency}
						</Text>
					</View>
				</View>

				<Keypad
					primaryColor={"#EEEEFC"}
					pressColor={"#CFCFFF"}
					textColor={"#3F41FA"}
					onChange={char => {
						if (char == "delete") {
							this.setState(prevState => {
								const deletedChar = prevState.value[prevState.value.length-1]
								const newValue = prevState.value.length > 0 ? prevState.value.slice(0, prevState.value.length-1) : ""
								return {
									...prevState,
									value: newValue,
									decimal: deletedChar == "." ? false : prevState.decimal,
									amount: decimalToUnits(newValue, this.state.activeCurrency),
								}
							})
						}
						else if (this.state.value.length >= 8) {
							return
						}
						else if (char == ".") {
							this.setState(prevState => {
								const newValue = prevState.decimal ? prevState.value : prevState.value + char
								return {
									...prevState,
									decimal: true,
									value: newValue,
									amount: decimalToUnits(newValue, this.state.activeCurrency),
								}
							})
						}
						else {
							this.setState(prevState => {
								const newValue = prevState.value.length > 0 || char != "0"
										? prevState.value + char : prevState.value
								return {
									...prevState,
									value: newValue,
									amount: decimalToUnits(newValue, this.state.activeCurrency),
								}
							})
						}
					}}
					decimal={true}
					arrow={"purple"}
					value={this.state.value}
					delete={true}
				/>

				<NextButton
					title="Choose recipient"
					disabled={
						this.state.value.length == 0 
						|| amountOverBalance 
						|| this.state.value == "." 
						|| parseFloat(this.state.value) == 0
						|| (this.state.amount) == 0
					}
					onPress={() => {
						this.props.enterAmount(this.state.activeCurrency, this.state.amount)
						this.props.navigation.navigate("SendTo")
					}}/>

				<CloseButton
					color="dark"
					onPress={() => {
						this.props.navigation.goBack(null);
					}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		paddingTop: isIphoneX() ? 60 : 40,
		backgroundColor: colors.white,
		flexDirection: "column",
		justifyContent: "space-between",
		paddingBottom: isIphoneX() ? 140 : 120,
	},
	header: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		color: colors.darkGray,
		fontSize: 24,
		fontWeight: "600",
		marginBottom: 4
	},
	balance: {
		fontSize: 18,
	},
	bodyWrapper: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		// backgroundColor: colors.gray,
		position: "relative",
	},
	amountWrapper: {
		// backgroundColor: colors.gray,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	amountTextWrapper: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		height: 80,
	},
	amount: {
		fontWeight: "700",
		fontSize: 54,
	},
	amountSuffix: {
		fontWeight: "700",
		paddingBottom: 15,
	},
});

export default EnterAmount;
