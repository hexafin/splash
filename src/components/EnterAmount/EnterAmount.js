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
					? (parseFloat(this.state.amount) * this.props.exchangeRates.BTC.USD).toFixed(2)
					: (parseFloat(this.state.amount) / this.props.exchangeRates.BTC.USD).toFixed(5)
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
						style={{position: "absolute", left: 20, top: 20}}/>

					<View style={styles.amountWrapper}>
						<Animated.View style={[styles.amountTextWrapper, {
							transform: [{scale: this.amountScale}]
						}]}>
							{this.state.activeCurrency == "USD" && 
								<Text style={[
									styles.amountSuffix, 
									{fontSize: 32, paddingRight: 3}
								]}>
									$
								</Text>}

							<Text style={styles.amount}>
								{this.state.amount == "" ? 0 : this.state.amount}
							</Text>

							{this.state.activeCurrency == "BTC" && 
								<Text style={[styles.amountSuffix, {fontSize: 26, paddingLeft: 5}]}>BTC</Text>}
						</Animated.View>
						<Text style={styles.balance}>
							Balance: {this.state.activeCurrency == "USD" && "$"}{balance[this.state.activeCurrency]} 
							{this.state.activeCurrency == "BTC" && " BTC"}
						</Text>
					</View>
				</View>

				<Keypad
					primaryColor={"#EEEEFC"}
					pressColor={"#6466F6"}
					textColor={"#3F41FA"}
					onChange={text => this.setState({amount: text})}
					decimal={true}
					arrow={"purple"}
					value={this.state.amount}
				/>

				<NextButton title="Choose recipient" onPress={() => {
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
		paddingBottom: isIphoneX() ? 40 : 20,
	},
	header: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		color: colors.darkGray,
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 4
	},
	balance: {
		color: colors.gray,
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
		height: 48,
	},
	amount: {
		color: colors.primary,
		fontWeight: "700",
		fontSize: 40,
	},
	amountSuffix: {
		color: colors.primary,
		fontWeight: "700",
		paddingBottom: 20,
	},
});

export default EnterAmount;
