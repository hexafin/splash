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
import { setActiveCurrency } from "../../redux/crypto/actions"
let firestore = firebase.firestore();

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class Balance extends Component {
	constructor(props) {
		super(props)
		this.state = {
			balance: props.balance,
			exchangeRates: props.exchangeRates,
			currency: props.currency,
			refreshing: props.refreshing,
			isLoadingBalance: props.isLoadingBalance,
			isLoadingExchangeRates: props.isLoadingExchangeRates,
			isLoadingTransactions: props.isLoadingTransactions,
		}
	}

	componentWillMount() {
		this.yOffset = new Animated.Value(0)
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			currency: nextProps.currency, 
			exchangeRates: nextProps.exchangeRates,
			balance: nextProps.balance,
			refreshing: nextProps.refreshing,
			isLoadingBalance: nextProps.isLoadingBalance,
			isLoadingExchangeRates: nextProps.isLoadingExchangeRates,
			isLoadingTransactions: nextProps.isLoadingTransactions,
		})
	}
  
	render() {

		let relativeBalance
		if (this.state.currency == "BTC") {
			relativeBalance = this.state.balance.BTC
		}
		else {
			if (this.state.exchangeRates.BTC) {
				relativeBalance = this.state.balance.BTC * this.state.exchangeRates.BTC.USD
			}
			else {
				relativeBalance = 0
			}
		}

		const animatedBalance = {
			transform: [
				{
					scale: this.props.yOffsets.home.interpolate({
						inputRange: [-81, -80, 0, 55, 56],
						outputRange: [1.2, 1.2, 1, 0.8, 0.8]
					})
				},
				{
					translateY: this.props.yOffsets.home.interpolate({
						inputRange: [-1, 0, 53, 54],
						outputRange: [0, 0, -53, -53]
					})
				},
				{
					translateX: this.props.xOffset.interpolate({
						inputRange: [0, SCREEN_WIDTH, SCREEN_WIDTH*2],
						outputRange: [160, 0, -160]
					})
				}
			]
		}

		const isLoading = (
			this.state.refreshing 
			|| this.state.isLoadingExchangeRates
			|| this.state.isLoadingBalance
			|| this.state.isLoadingTransactions
		)

		return (
			<TouchableWithoutFeedback keyboardShouldPersistTaps={"always"} onPress={() => {
				if (this.state.currency == "USD") {
					this.props.setActiveCurrency("BTC")
				}
				else {
					this.props.setActiveCurrency("USD")
				}
			}}>
				<Animated.View pointerEvents="box-only" style={[animatedBalance, styles.balance]}>
					<Text style={styles.balanceText}>{isLoading ? " " : relativeBalance}</Text>
					<View style={[styles.balanceRefresh, {
						opacity: isLoading ? 100 : 0
					}]}>
						<LoadingCircle size={30} restart={isLoading}/>
					</View>
					<View pointerEvents="none" style={styles.balanceCurrencyWrapper}>
						<Image source={icons.refresh} style={styles.refreshIcon}/>
						<Text style={styles.balanceCurrencyText}>{this.state.currency}</Text>
					</View>
				</Animated.View>
			</TouchableWithoutFeedback>
		)
	}
}

const styles = StyleSheet.create({
	balance: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: (isIphoneX()) ? 90 : 70,
		width: SCREEN_WIDTH,
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