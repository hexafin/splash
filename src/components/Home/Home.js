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
			currency: "USD",
			balance: null,
			exchangeRate: null,
			transactions: props.transactions,
			loadingExchangeRate: true,
			loadingBalance: true,
			yOffset: new Animated.Value(0),
			pulledToRefresh: false,
			refreshing: false
		}
		this.loadBalance = this.loadBalance.bind(this)
		this.loadExchangeRate = this.loadExchangeRate.bind(this)
		this.refresh = this.refresh.bind(this)
	}

	loadBalance() {
		this.setState(prevState => {
			return {
				...prevState,
				loadingBalance: true,
				balance: null
			}
		})
		api.GetAddressBalance(this.props.bitcoinAddress, this.props.bitcoinNetwork).then(balance => {
			this.setState(prevState => {
				return {
					...prevState,
					balance,
					loadingBalance: false
				}
			})
		}).catch(error => {
			Sentry.messageCapture(error)
			this.setState(prevState => {
				return {
					...prevState,
					balance: null,
					loadingBalance: false
				}
			})
		})
	}

	loadExchangeRate() {
		this.setState(prevState => {
			return {
				...prevState,
				loadingExchangeRate: true,
				exchangeRate: null
			}
		})
		// get exchange rate
        api.GetExchangeRate().then(exchangeRate => {
        	this.setState(prevState => {
        		return {
        			...prevState,
        			exchangeRate,
        			loadingExchangeRate: false
        		}
        	})
        	this.props.UpdateExchangeRate(exchangeRate)
        }).catch(error => {
        	this.setState(prevState => {
        		return {
        			...prevState,
        			exchangeRate: null,
        			loadingExchangeRate: false
        		}
        	})
        })
	}

	refresh() {
		if (!this.state.pulledToRefresh) {
			this.setState(prevState => {
				return {
					...prevState,
					pulledToRefresh: true,
					refreshing: true
				}
			})
			setTimeout(() => {
				this.setState(prevState => {
					return {
						...prevState,
						refreshing: false
					}
				})
			}, 500)
			ReactNativeHapticFeedback.trigger("impactHeavy", true)
			this.loadBalance()
			this.loadExchangeRate()
			this.props.LoadTransactions()
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState(prevState => {
			return {
				...prevState,
				transactions: nextProps.transactions
			}
		})
		this.loadBalance()
	}

	componentWillMount() {
        if (!this.props.loggedIn) {
            this.props.navigation.navigate("Landing")
        }

		FCM.on(FCMEvent.Notification, async notif => {
			console.log("Notification", notif);
			// reload on notifications
			const {
				transactionId,
				relativeAmount,
				domain,
				relativeCurrency
			} = notif;
			if (transactionId && relativeAmount && domain && relativeCurrency) {
				api.GetExchangeRate().then(exchangeRate => {
					this.props.navigation.navigate("ApproveCardModal", {
						transactionId,
						relativeAmount,
						domain,
						relativeCurrency,
						exchangeRate: exchangeRate[relativeCurrency]
					});
				}).catch(error => {
					// Alert.alert("Could not load exchange rate")
					// TODO: better visual error handling
				})
			}
		});
	}
  
  componentDidMount() {

		this.props.LoadTransactions()

		this.loadExchangeRate()

		// get balance
        this.loadBalance()

	}

	render() {

		const handleBalancePress = () => {
			this.setState(prevState => {
				return {
					...prevState,
					currency: (prevState.currency == "BTC") ? "USD" : "BTC"
				}
			})
		}

		const currencyPrefix = {
			BTC: "BTC ",
			USD: "$"
		}

		let balance = null
		if (this.state.exchangeRate != null && this.state.balance != null) {
			const rate = this.state.exchangeRate[this.state.currency]
			balance = {
				BTC: this.state.balance,
				USD: parseFloat(this.state.balance * rate).toFixed(2)
			}
		}

		let rate = {'USD': 0, 'BTC': 0}
		if (!!this.state.exchangeRate) {
			rate = this.state.exchangeRate
		} else if (!!this.props.exchangeRates) {
			rate = this.props.exchangeRates
		}

		const animatedHeader = {
			opacity: this.state.yOffset.interpolate({
				inputRange: [75, 76, 100, 101],
				outputRange: [0, 0, 1, 1]
			})
		}

		const animatedBalance = {
			transform: [
				{
					scale: this.state.yOffset.interpolate({
						inputRange: [-81, -80, 0, 55, 56],
						outputRange: [1.2, 1.2, 1, 0.8, 0.8]
					})
				},
				{
					translateY: this.state.yOffset.interpolate({
						inputRange: [-1, 0, 53, 54],
						outputRange: [0, 0, -53, -53]
					})
				}
			]
		}

		return (
			<View style={{flex: 1}}>
				<Animated.ScrollView
					scrollEventThrottle={16}
					contentContainerStyle={styles.scrollContainer}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: this.state.yOffset } } }],
						{
							listener: event => {
								const currentY = event.nativeEvent.contentOffset.y
								if (currentY < -80) {
									this.refresh()
								}
								if (currentY >= 0) {
									this.setState(prevState => {
										return {
											...prevState,
											pulledToRefresh: false
										}
									})
								}
							},
							useNativeDriver: true
						}
					)}>
					<View style={styles.container}>
						<Image
							source={require("../../assets/images/headerWaveInverse.png")}
							style={styles.waveInverse}
							resizeMode="contain"/>
						<PayFlow reset={this.state.refreshing}
								 currency={this.state.currency}
								 network={this.props.bitcoinNetwork}
								 exchangeRate={rate}
								 balance={balance}
								 navigation={this.props.navigation}/>
						<View style={styles.history}>
							<Text style={styles.sectionTitle}>Your history</Text>
							{this.state.transactions.map(transaction => {
								const cryptoAmount = transaction.type == 'card' ? transaction.amount/cryptoUnits.BTC : transaction.amount.subtotal/cryptoUnits.BTC
								const amount = this.state.currency == "BTC" ? parseFloat(cryptoAmount*rate[this.state.currency]).toFixed(5) : parseFloat(cryptoAmount*rate[this.state.currency]).toFixed(2)
								const direction = (transaction.type == "card" || typeof transaction.to !== 'undefined') ? "to" : "from"

								return (
									<TransactionLine
										key={"transactionLine"+transaction.id}
										direction={direction}
										amount={currencyPrefix[this.state.currency] + amount}
										date={moment.unix(transaction.timestamp).fromNow()}
										loading={!rate || this.props.isLoadingTransactions}
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
	  						                      address: transaction.type == 'blockchain' ? transaction[direction].address : null,
							                      exchangeRate: rate[this.state.currency],
										  })
										}}
									/>
								)
							})}
						</View>
					</View>
				</Animated.ScrollView>
				<Animated.View style={[styles.header]}/>
				<Animated.View style={[animatedHeader, styles.headerShadow]}/>
				
				<TouchableWithoutFeedback keyboardShouldPersistTaps={"always"} onPress={handleBalancePress}>
					<Animated.View pointerEvents="box-only" style={[animatedBalance, styles.balance]}>
						<Text style={styles.balanceText}>{!(this.state.refreshing || this.state.loadingExchangeRate || this.state.loadingBalance) ? balance[this.state.currency] : " "}</Text>
						<View style={[styles.balanceRefresh, {
							opacity: (this.state.refreshing || this.state.loadingExchangeRate || this.state.loadingBalance) ? 100 : 0
						}]}>
							<LoadingCircle size={30}/>
						</View>
						<View pointerEvents="none" style={styles.balanceCurrencyWrapper}>
							<Image source={icons.refresh} style={styles.refreshIcon}/>
							<Text style={styles.balanceCurrencyText}>{this.state.currency}</Text>
						</View>
					</Animated.View>
				</TouchableWithoutFeedback>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	scrollContainer: {
		marginTop: 0,
		paddingTop: 0,
		position: "relative"
	},
	container: {
		marginTop: 210,
		paddingTop: 0,
		position: "relative",
		backgroundColor: colors.white
	},
	header: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		height: (isIphoneX()) ? 120 : 100,
		width: SCREEN_WIDTH,
		position: "absolute",
		top: 0,
		backgroundColor: colors.primary,
	},
	headerShadow: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		height: (isIphoneX()) ? 120 : 100,
		width: SCREEN_WIDTH,
		position: "absolute",
		top: 0,
		backgroundColor: colors.primary,
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowRadius: 12,
		shadowOpacity: 0.2
	},
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
	waveInverse: {
		width: SCREEN_WIDTH,
		height: 200,
		position: "absolute",
		top: -70
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
