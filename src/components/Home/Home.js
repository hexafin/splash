import React, { Component } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableWithoutFeedback,
	Linking,
	Alert,
	Share
} from "react-native";
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import FCM, { FCMEvent } from "react-native-fcm";
import TransactionLine from "../universal/TransactionLine"

class Home extends Component {

	constructor(props) {
		super(props)
		this.state = {
			currency: "USD"
		}
		this.handleBalancePress = this.handleBalancePress.bind(this)
	}

	componentWillMount() {
        if (!this.props.loggedIn) {
            this.props.navigation.navigate("Landing");
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
				this.props.navigation.navigate("ApproveModal", {
					transactionId,
					relativeAmount,
					domain,
					relativeCurrency
				});
			}
		});
	}

	handleBalancePress() {
		this.setState(prevState => {
			return {
				...prevState,
				currency: (prevState.currency == "BTC") ? "USD" : "BTC"
			}
		})
	}

	render() {

		const currencyPrefix = {
			BTC: "BTC ",
			USD: "$"
		}

		const transactions = [
			{
				id: 1,
				type: "card",
				domain: "apple.com",
				date: "Jan 04, 2018",
				amount: {
					USD: 999.99,
					BTC: 0.00023
				}
			},
			{
				id: 2,
				type: "fund",
				date: "Jan 04, 2018",
				amount: {
					USD: 999.99,
					BTC: 0.00023
				}
			},
		]

		return (
			<View style={styles.container}>
				<Image source={require("../../assets/images/header.png")} style={styles.headerImage}/>
				<View style={styles.header}>
					<View style={styles.topbar}>
						<TouchableWithoutFeedback>
							<Image source={icons.whiteSplash} style={styles.headerLogoButton}/>
						</TouchableWithoutFeedback>
					</View>
					<TouchableWithoutFeedback onPress={this.handleBalancePress}>
						<View style={styles.balanceWrapper}>
							<Text style={styles.balanceText}>25.59</Text>
							<View style={styles.balanceCurrencyWrapper}>
								<Image source={icons.refresh} style={styles.refreshIcon}/>
								<Text style={styles.balanceCurrencyText}>{this.state.currency}</Text>
							</View>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback>
						<View style={styles.addCryptoButton}>
							<Text style={styles.addCryptoText}>Add crypto</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
				<View style={styles.history}>
					<Text style={styles.historyTitle}>Your history</Text>
					{transactions.map(transaction => {
						return (
							<TransactionLine 
								key={"transactionLine"+transaction.id}
								direction={(transaction.type == "card") ? "out" : "in"} 
								amount={currencyPrefix[this.state.currency] + transaction.amount[this.state.currency]}
								date={transaction.date}
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
		backgroundColor: colors.primary
	},
	headerImage: {
		position: "absolute",
		width: 400,
		height: 300,
		top: -60
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
		backgroundColor: colors.primary
	},
	balanceCurrencyWrapper: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.primary
	},
	balanceCurrencyText: {
		color: "rgba(255,255,255,0.7)",
		fontSize: 14,
		fontWeight: "600",
		marginLeft: 5
	},
	refreshIcon: {
		width: 13,
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