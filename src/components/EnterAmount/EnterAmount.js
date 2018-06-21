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
import NavigatorService from "../../redux/navigator";
import { cryptoTitleDict } from "../../lib/cryptos"

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class EnterAmount extends Component {
	constructor(props) {
		super(props)
		this.state = {
			amount: "",
			activeCurrency: props.activeCurrency,
		}
	}

	componentWillMount() {
		this.amountScale = new Animated.Value(1)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeCurrency != this.state.activeCurrency) {
			this.setState({activeCurrency: nextProps.activeCurrency})
		}
	}

	shouldComponentUpdate(nextProps, nextState) {

		if (nextState.amount.length > 5) {
			Animated.timing(this.amountScale, {
				toValue: 1 - (nextState.amount.length-5)*0.1,
				duration: 100,
			}).start()
		}
		else if (nextState.amount.length <= 5 && this.state.amount.length > 5) {
			Animated.timing(this.amountScale, {
				toValue: 1,
				duration: 100,
			}).start()
		}

		if (nextState.activeCurrency != this.state.activeCurrency) {
			// update amount with exchange rate
			let newAmount
			if (this.state.amount != "") {
				newAmount = nextState.activeCurrency == "USD" 
					? (parseFloat(this.state.amount) * this.props.exchangeRates.BTC.USD).toFixed(2).slice(0, 7)
					: (parseFloat(this.state.amount) / this.props.exchangeRates.BTC.USD).toFixed(5).slice(0, 7)
			}
			else {
				newAmount = ""
			}
			this.setState({amount: newAmount.toString() })
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
		const btcBalance = this.props.balance.BTC
		const balance = {
			BTC: btcBalance.toFixed(5),
			USD: (btcBalance * (this.props.exchangeRates.BTC ? this.props.exchangeRates.BTC.USD : 0)).toFixed(2)
		}
		const amountOverBalance = (this.state.activeCurrency == "USD" 
			? balance.USD < parseFloat(this.state.amount)
			: balance.BTC < parseFloat(this.state.amount))
		return (
			<View style={styles.wrapper}>

				<View style={styles.header}>
					<Text style={styles.title}>Sending Bitcoin</Text>
				</View>

				<View style={styles.bodyWrapper}>
					<CurrencySwitcherLight
						fiat="USD" 
						crypto="BTC" 
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
								opacity: this.state.amount == "" ? 0.8 : 1.0,
								color: amountOverBalance ? colors.red : colors.primary,
							}]}>
								{this.state.amount == "" ? 0 : this.state.amount}
							</Text>

							{this.state.activeCurrency == "BTC" && 
								<Text style={[styles.amountSuffix, {
									fontSize: 30, 
									paddingLeft: 5,
									color: amountOverBalance ? colors.red : colors.primary,
								}]}>BTC</Text>}
						</Animated.View>
						<Text style={[styles.balance, {
							color: amountOverBalance ? colors.red : colors.gray,
						}]}>
							Balance: {this.state.activeCurrency == "USD" && "$"}{balance[this.state.activeCurrency]} 
							{this.state.activeCurrency == "BTC" && " BTC"}
						</Text>
					</View>
				</View>

				<Keypad
					primaryColor={"#EEEEFC"}
					pressColor={"#CFCFFF"}
					textColor={"#3F41FA"}
					onChange={text => this.setState({amount: text})}
					decimal={true}
					arrow={"purple"}
					value={this.state.amount}
					maxLength={7}
					noLeadingZeros={true}
				/>

				<NextButton
					title="Choose recipient"
					disabled={
						// this.state.amount.length == 0 || amountOverBalance
						false
					}
					onPress={() => {
						this.props.enterAmount(this.state.activeCurrency, parseFloat(this.state.amount))
						this.props.navigation.navigate("SendTo")
					}}/>

				<CloseButton
					color="primary"
					onPress={() => {
						this.props.screenProps.rootNavigation.goBack(null);
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
