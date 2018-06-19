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
		else {
			return false
		}
	}
  
	render() {

		let relativeBalance
		if (this.props.currency == "BTC") {
			relativeBalance = this.props.balance.BTC.toFixed(5)
		}
		else {
			if (this.props.exchangeRates.BTC) {
				relativeBalance = (this.props.balance.BTC * this.props.exchangeRates.BTC.USD).toFixed(2)
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
					inputRange: [-1, 0, 53, 54],
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
					inputRange: [-81, -80, 0, 70, 71],
					outputRange: [0.2, 0.2, 0, -0.2, -0.2]
				})
			),
			this.props.xOffset.interpolate({
				inputRange: [0, SCREEN_WIDTH, SCREEN_WIDTH*2],
				outputRange: [0.5, 1, 0.5]
			}),
		)

		const balanceOpacity = this.props.xOffset.interpolate({
			inputRange: [0, SCREEN_WIDTH, SCREEN_WIDTH*2],
			outputRange: [0, 1, 0]
		})

		const balanceTranslateX = this.props.xOffset.interpolate({
			inputRange: [0, SCREEN_WIDTH, SCREEN_WIDTH*2],
			outputRange: [220, 0, -220]
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
						crypto="BTC"
						textColor={"rgba(255, 255, 255, 0.7)"}
						switcherColor={"white"}
						activeCurrencySize={24}
						switcherBottom={32}
						style={{marginTop: -30}}
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
	},
	balance: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		width: 150,
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