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
	}

	componentWillMount() {
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

	render() {

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
				<View style={styles.header}>
					<View style={styles.topbar}>
						<TouchableWithoutFeedback>
							<Image source={icons.whiteSplash} style={styles.headerLogoButton}/>
						</TouchableWithoutFeedback>
					</View>
					<TouchableWithoutFeedback>
						<View style={styles.balanceWrapper}>
							<Text style={styles.balanceText}></Text>
							<View style={styles.balanceCurrencyWrapper}>
								<Image source={icons.refresh} style={styles.refreshIcon}/>
								<Text style={styles.balanceCurrencyText}>{this.state.relativeCurrency}</Text>
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
								amount={transaction.amount[this.state.currency]}
								date={transaction.date}
								title={(transaction.type == "card") ? transaction.domain : "A bitcoin wallet"}
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
		backgroundColor: colors.purple
	},
	header: {},
	topbar: {},
	headerLogoButton: {
		width: 50,
		height: 50,
	},
	balanceWrapper: {},
	balanceText: {},
	balanceCurrencyWrapper: {},
	balanceCurrencyText: {},
	addCryptoButton: {},
	addCryptoText: {},
	history: {},
	historyTitle: {}
});

export default Home;