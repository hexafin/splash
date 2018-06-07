import React, { Component } from "react";
import {
	View,
	Text,
	ScrollView,
	Animated,
	StyleSheet,
	Image,
	TouchableWithoutFeedback,
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

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

const yOffset = new Animated.Value(0)
const _onScroll = Animated.event(
	[{ nativeEvent: { contentOffset: { y: yOffset } } }],
	{
		useNativeDriver: true
	}
)


class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currency: "USD",
			balance: null,
			exchangeRate: null,
			transactions: props.transactions
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState(prevState => {
			return {
				...prevState,
				transactions: nextProps.transactions
			}
		})
		api.GetAddressBalance(this.props.bitcoinAddress).then(balance => {
			this.setState(prevState => {
				return {
					...prevState,
					balance
				}
			})
		}).catch(error => {
			Sentry.messageCapture(error)
			this.setState(prevState => {
				return {
					...prevState,
					balance: null
				}
			})
		})
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
					this.props.navigation.navigate("ApproveModal", {
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

		// get balance
        api.GetAddressBalance(this.props.bitcoinAddress).then(balanceBtc => {
			this.setState(prevState => {
				return {
					...prevState,
					balanceBtc
				}
			})
		}).catch(error => {
			console.log(error)
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

		const handleBalancePress = () => {
			this.setState(prevState => {
				return {
					...prevState,
					currency: (prevState.currency == "BTC") ? "USD" : "BTC"
				}
			})
		}

		const handleReceive = () => {
			this.props.navigation.navigate("Receive")
		}

		const handleAccount = () => {
			this.props.navigation.navigate("Account")
		}

		const currencyPrefix = {
			BTC: "BTC ",
			USD: "$"
		}

		let balance = null
		if (this.state.exchangeRate != null && this.state.balanceBtc != null) {
			const rate = this.state.exchangeRate[this.state.currency]
			balance = {
				BTC: this.state.balanceBtc,
				USD: this.state.balanceBtc * rate
			}
		}

		const animatedHeader = {
			opacity: yOffset.interpolate({
				inputRange: [50, 51, 80, 81],
				outputRange: [0, 0, 1, 1]
			})
		}

		const animatedBalance = {
			transform: [
				{
					scale: yOffset.interpolate({
						inputRange: [-1, 0, 55, 56],
						outputRange: [1, 1, 0.7, 0.7]
					})
				},
				{
					translateY: yOffset.interpolate({
						inputRange: [-1, 0, 55, 56],
						outputRange: [0, 0, -55, -55]
					})
				}
			]
		}

		return (
			<View style={{flex: 1}}>
				<Animated.ScrollView
					scrollEventThrottle={16}
					contentContainerStyle={styles.container}
					onScroll={_onScroll}>
					<Image
						source={require("../../assets/images/headerWaveInverse.png")}
						style={styles.waveInverse}
						resizeMode="contain"/>
					<View style={styles.history}>
						<Text style={styles.historyTitle}>Your history</Text>
						<View style={{height: 1000}}/>
						{this.state.transactions.map(transaction => {
							const amount = this.state.currency == "BTC" ? transaction.amount : transaction.relativeAmount
							return (
								<TransactionLine
									key={"transactionLine"+transaction.id}
									direction={(transaction.type == "card") ? "out" : "in"}
									amount={currencyPrefix[this.state.currency] + amount}
									date={moment.unix(transaction.timestampApproved).fromNow()}
									title={
										(transaction.type == "card")
										? transaction.domain[0].toUpperCase() + transaction.domain.slice(1)
										: "A bitcoin wallet"
									}
									onPress={() => {
										console.log("press:", transaction)
									}}
								/>
							)
						})}
					</View>
				</Animated.ScrollView>
				<Animated.View style={[animatedHeader, styles.header]}/>
				
				<TouchableWithoutFeedback onPress={handleBalancePress}>
					<Animated.View pointerEvents="box-only" style={[animatedBalance, styles.balance]}>
						{balance != null && <Text style={styles.balanceText}>{balance[this.state.currency]}</Text>}
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
	container: {
		justifyContent: "space-between",
		backgroundColor: "transparent",
		marginTop: 210,
		paddingTop: 0,
		position: "relative"
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
	history: {
		flex: 1,
		padding: 20,
		backgroundColor: colors.white
	},
	historyTitle: {
		color: colors.primaryDarkText,
		fontSize: 18,
		fontWeight: "700"
	}
});

export default Home;
