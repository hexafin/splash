import React, { Component } from "react";
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
	Share,
	Dimensions
} from "react-native";
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import FCM, { FCMEvent } from "react-native-fcm";
import TransactionLine from "../universal/TransactionLine"
import api from '../../api'
import { isIphoneX } from "react-native-iphone-x-helper"
import moment from "moment"
import { Sentry } from "react-native-sentry";
import LoadingCircle from "../universal/LoadingCircle"
import PayFlow from "./PayFlow"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { cryptoUnits } from '../../lib/cryptos'

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height


class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false
		}
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
		if (nextProps.transactions.length > this.props.transactions.length) {
			return true
		}
		else if (nextProps.currency != this.props.currency) {
			return true
		}
		else if (nextState.loading != this.state.loading) {
			return true
		}
		else {
			return false
		}
	}

	componentWillMount() {
        if (!this.props.loggedIn) {
            this.props.navigation.navigate("Landing")
        }
	}

	render() {

		const currencyPrefix = {
			BTC: "BTC ",
			USD: "$"
		}

		return (
			<View style={styles.wrapper}>
				<Animated.ScrollView
					scrollEventThrottle={16}
					contentContainerStyle={styles.scrollContainer}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: this.props.yOffset } } }],
						{
							listener: event => {
								const currentY = event.nativeEvent.contentOffset.y

								if (currentY < -80 && !this.state.loading) {
									this.setState({loading: true})
									this.props.LoadBalance("BTC")
									this.props.LoadExchangeRates("BTC")
									this.props.LoadTransactions()
									ReactNativeHapticFeedback.trigger("impactHeavy", true)
								}
							},
							useNativeDriver: true
						}
					)}>
					<View style={styles.container}>
						<PayFlow
								 currency={this.props.activeCurrency}
								 network={this.props.bitcoinNetwork}
								 navigation={this.props.navigation}/>
						<View style={styles.history}>
							<Text style={styles.sectionTitle}>Your history</Text>
							{this.props.transactions.map(transaction => {
								const cryptoAmount = transaction.type == 'card' ? transaction.amount/cryptoUnits.BTC : transaction.amount.subtotal/cryptoUnits.BTC
								let amount
								if (this.props.exchangeRates) {
									amount = this.props.currency == "BTC"
										? parseFloat(cryptoAmount).toFixed(5)
										: parseFloat(cryptoAmount*this.props.exchangeRates[this.props.currency]).toFixed(2)
								}
								else {
									amount = 0
								}
									
								const direction = (transaction.type == "card" || transaction.fromAddress == this.props.bitcoinAddress) ? "to" : "from"

								return (
									<TransactionLine
										key={"transactionLine"+transaction.id}
										direction={direction}
										amount={currencyPrefix[this.props.currency] + amount}
										date={moment.unix(transaction.timestamp).fromNow()}
										loading={this.state.loading}
										pending={transaction.pending}
										title={
											(transaction.type == "card")
											? transaction.domain[0].toUpperCase() + transaction.domain.slice(1)
											: "A bitcoin wallet"
										}
										currency={(transaction.type == 'blockchain' ? transaction.currency : null)}
										onPress={() => {
											this.props.navigation.navigate("ViewTransactionModal", {
												  transaction,
												  direction,
                          address: transaction.type == 'blockchain' ? transaction[direction+'Address'] : null,
                          exchangeRate: rate['USD'],
										  })
										}}
									/>
								)
							})}
						</View>
					</View>
				</Animated.ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1
	},
	scrollContainer: {
		position: "relative",
		overflow: "hidden",
		paddingTop: 210
	},
	container: {
		position: "relative",
		overflow: "hidden"
	},
	sectionTitle: {
		color: colors.primaryDarkText,
		fontSize: 20,
		fontWeight: "700"
	},
	history: {
		padding: 20,
		// backgroundColor: colors.white
	},
	sendButton: {
		position: "absolute",
		right: 20,
		bottom: (isIphoneX()) ? 40 : 20,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'flex-end',
		width: 60,
		height: 60,
		borderRadius: 37.5,
		backgroundColor: '#6364F1',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.1,
		shadowRadius: 10,
	},
	sendButtonIcon: {
		width: 30,
		height: 30,
		marginRight: 6,
		marginTop: 2
	}
});

export default Home;
