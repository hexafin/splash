import React, {Component} from "react"
import {
	View,
	Text,
	ScrollView,
	Animated,
	StyleSheet,
	Image,
	TouchableWithoutFeedback,
	TouchableOpacity,
	Linking,
	Alert,
	Clipboard,
	Share,
	Dimensions,
	TextInput
} from "react-native"
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import { isIphoneX } from "react-native-iphone-x-helper"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import api from '../../api'
import firebase from "react-native-firebase"
import LoadingCircle from "../universal/LoadingCircle"
import CurrencySwitcher from "../universal/CurrencySwitcher"
import { setActiveCurrency } from "../../redux/crypto/actions"
import { decimalLengths } from "../../lib/cryptos"

let firestore = firebase.firestore();

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class Balance extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false
		}
	}

	componentWillMount() {
		this.yOffset = new Animated.Value(0)
		this.animatedBalanceScale = new Animated.Value(1)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isLoadingTransactions || nextProps.isLoadingBalance || nextProps.isLoadingExchangeRates) {
			this.setState({loading: true})
		}
		else {
			this.setState({loading: false})
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.exchangeRates.BTC && nextProps.exchangeRates.BTC && nextProps.exchangeRates.BTC.USD != this.props.exchangeRates.BTC.USD) {
			return true
		}
		else if (nextProps.balance.BTC != this.props.balance.BTC) {
			return true
		}
		else if (nextState.loading != this.state.loading) {
			return true
		}
		else if (nextProps.currency != this.props.currency) {
			return true
		}
		else if (nextProps.cryptoCurrency != this.props.cryptoCurrency) {
			return true
		}
		else {
			return false
		}
	}
  
	render() {

		const {cryptoCurrency, currency, balance, exchangeRates} = this.props

		let relativeBalance
		if (currency == cryptoCurrency) {
			relativeBalance = balance[cryptoCurrency].toFixed(decimalLengths[cryptoCurrency])
		}
		else {
			if (exchangeRates[cryptoCurrency]) {
				relativeBalance = (balance[cryptoCurrency] * exchangeRates[cryptoCurrency].USD).toFixed(decimalLengths["USD"])
			}
			else {
				relativeBalance = 0
			}
		}

		const balanceTranslateY = Animated.add(
			Animated.multiply(
				this.props.xOffset.interpolate({
					inputRange: [0, SCREEN_WIDTH, SCREEN_WIDTH*2],
					outputRange: [0, 1, 0]
				}),
				this.props.yOffsets.home.interpolate({
					inputRange: [-1, 0, 120, 121],
					outputRange: [0, 0, -53, -53]
				}),
			),
			this.props.xOffset.interpolate({
				inputRange: [0, SCREEN_WIDTH, SCREEN_WIDTH*2],
				outputRange: [-40, 0, -40]
			}),
		)

		const balanceScale = Animated.add(
			Animated.multiply(
				this.props.xOffset.interpolate({
					inputRange: [0, SCREEN_WIDTH, SCREEN_WIDTH*2],
					outputRange: [0, 1, 0]
				}),
				this.props.yOffsets.home.interpolate({
					inputRange: [-81, -80, 0, 160, 161],
					outputRange: [0.2, 0.2, 0, -0.2, -0.2]
				})
			),
			this.props.xOffset.interpolate({
				inputRange: [0, SCREEN_WIDTH, SCREEN_WIDTH*2],
				outputRange: [0.8, 1, 0.8]
			}),
		)

		const balanceOpacity = this.props.xOffset.interpolate({
			inputRange: [SCREEN_WIDTH*0.7, SCREEN_WIDTH, SCREEN_WIDTH*1.3],
			outputRange: [0, 1, 0]
		})

		const balanceTranslateX = this.props.xOffset.interpolate({
			inputRange: [0, SCREEN_WIDTH*0.6, SCREEN_WIDTH, SCREEN_WIDTH*1.4, SCREEN_WIDTH*2],
			outputRange: [SCREEN_WIDTH*1.2, SCREEN_WIDTH*0.3, 0, -0.3*SCREEN_WIDTH, -1.2*SCREEN_WIDTH]
		})

		const animatedBalance = {
			transform: [
				{
					scale: balanceScale
				},
				{
					translateY: balanceTranslateY,
				},
				{
					translateX: balanceTranslateX
				}
			],
			opacity: balanceOpacity,
		}

		const animatedBalanceView = {
			transform: [
				{scale: this.animatedBalanceScale}
			]
		}

		return (
			
			<Animated.View pointerEvents="box-none" style={[
				animatedBalance,
				styles.balanceWrapper
			]}>
				<Animated.View style={[styles.balance, animatedBalanceView]} pointerEvents="box-none">
					<Text style={styles.balanceText}>{this.state.loading ? " " : relativeBalance}</Text>
					<View style={[styles.balanceRefresh, {
						opacity: this.state.loading ? 100 : 0
					}]}>
						<LoadingCircle size={30} restart={this.state.loading}/>
					</View>
					<CurrencySwitcher
						fiat="USD"
						crypto={cryptoCurrency}
						textColor={"rgba(255, 255, 255, 0.7)"}
						switcherColor={"white"}
						activeCurrencySize={24}
						switcherBottom={32}
						style={{marginTop: -25}}
						onPressIn={() => {
							Animated.spring(this.animatedBalanceScale, {
								toValue: 0.8,
								bounciness: 6,
								speed: 8,
							}).start()
						}}
						onPressOut={() => {
							Animated.spring(this.animatedBalanceScale, {
								toValue: 1,
								bounciness: 6,
								speed: 8,
							}).start()
						}}/>
				</Animated.View>
			</Animated.View>
			
		)
	}
}

const styles = StyleSheet.create({
	balanceWrapper: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: (isIphoneX()) ? 90 : 70,
		width: SCREEN_WIDTH,
		// backgroundColor: colors.gray,
	},
	balance: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	balanceRefresh: {
		position: "absolute",
		width: "100%",
		flexDirection: "row",
		justifyContent: "center",
		top: 0
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
})

const mapStateToProps = state => {
	return {
		currency: state.crypto.activeCurrency,
		cryptoCurrency: state.crypto.activeCryptoCurrency,
		balance: state.crypto.balance,
		exchangeRates: state.crypto.exchangeRates,
		isLoadingExchangeRates: state.crypto.isLoadingExchangeRates,
		isLoadingTransactions: state.transactions.isLoadingTransactions,
        isLoadingBalance: state.crypto.isLoadingBalance,
        loadingBalanceCurrency: state.crypto.loadingBalanceCurrency,
        successLoadingBalance: state.crypto.successLoadingBalance,
	}
}

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			setActiveCurrency
		},
		dispatch
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(Balance)