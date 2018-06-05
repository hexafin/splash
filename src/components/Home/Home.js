import React, { Component } from "react";
import {
	View,
	Text,
	ScrollView,
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
			Alert.alert("Could not load balance")
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
					Alert.alert("Could not load exchange rate")
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

		const handleAddCrypto = () => {
			this.props.navigation.navigate("AddCrypto")
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

		return (
			<View style={styles.container}>
				<Image source={require("../../assets/images/header.png")} style={styles.headerImage}/>
				<View style={styles.header}>
					<View style={styles.topbar}>
						<TouchableWithoutFeedback onPress={handleAccount}>
							<Image source={icons.whiteSplash} style={styles.headerLogoButton}/>
						</TouchableWithoutFeedback>
					</View>
					<TouchableWithoutFeedback onPress={handleBalancePress}>
						<View style={styles.balanceWrapper}>
							{balance != null && <Text style={styles.balanceText}>{balance[this.state.currency]}</Text>}
							<View style={styles.balanceCurrencyWrapper}>
								<Image source={icons.refresh} style={styles.refreshIcon}/>
								<Text style={styles.balanceCurrencyText}>{this.state.currency}</Text>
							</View>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback onPress={handleAddCrypto}>
						<View style={styles.addCryptoButton}>
							<Text style={styles.addCryptoText}>Add crypto</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
				<ScrollView style={styles.history}>
					<Text style={styles.historyTitle}>Your history</Text>
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
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		...defaults.container,
		justifyContent: "space-between"
	},
	header: {
		flexDirection: "column",
		alignItems: "center",
		height: 200,
		marginBottom: 40,
		backgroundColor: 'rgba(0,0,0,0)'
	},
	headerImage: {
		position: "absolute",
		width: Dimensions.get('window').width,
		height: 300,
		top: (isIphoneX()) ? -40 : -60
	},
	topbar: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		width: "100%",
		paddingTop: 40,
		paddingRight: 30
	},
	headerLogoButton: {
		width: 24,
		height: 32,
	},
	balanceWrapper: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		padding: 15,
		marginBottom: 5
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
	addCryptoButton: {
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 8,
		paddingBottom: 8,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.primaryDark,
		borderRadius: 5
	},
	addCryptoText: {
		color: colors.white,
		fontSize: 14,
		fontWeight: "600"
	},
	history: {
		flex: 1,
		padding: 20
	},
	historyTitle: {
		color: colors.primaryDarkText,
		fontSize: 18,
		fontWeight: "700"
	}
});

export default Home;
