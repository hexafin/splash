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
import TransactionLine from "../universal/TransactionLine"
import { cryptoUnits, decimalToUnits, unitsToDecimal } from '../../lib/cryptos'
import { showViewModal } from '../../redux/modal'

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class History extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			height: SCREEN_HEIGHT*3/5,
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isLoadingTransactions || nextProps.isLoadingExchangeRates) {
			this.setState({loading: true})
		}
		else {
			this.setState({loading: false})
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (!nextProps.isLoadingExchangeRates && nextProps.exchangeRates.BTC && this.props.exchangeRates.BTC && nextProps.exchangeRates.BTC.USD != this.props.exchangeRates.BTC.USD) {
			return true
		}
		else if (nextProps.currency != this.props.currency) {
			return true
		}
		else if (nextState.loading != this.state.loading) {
			return true
		}
		else if (nextState.modalVisible != this.state.modalVisible || nextState.modalProps != this.state.modalProps) {
			return true
		}
		else if (nextProps.transactions.length != this.props.transactions.length) {
			return true
		}
		else {
			return false
		}
	}

	dynamicHeight(event, stateProp) {
		this.setState({[stateProp]: event.nativeEvent.layout.height})
	}
  
	render() {

		const currencyPrefix = {
			BTC: "BTC ",
			USD: "$"
		}

		return (
			<View style={[styles.history, {
				minHeight: this.state.height,
				paddingBottom: this.props.transactions.length == 0 ? 20 : isIphoneX() ? 140 : 120,
			}]} onLayout={event => this.dynamicHeight(event, "height")}>
				<Text style={styles.sectionTitle}>Your history</Text>
				{this.props.transactions.map(transaction => {
					const satoshiAmount = transaction.type == 'card' ? transaction.amount : transaction.amount.subtotal
					let amount
					if (this.props.exchangeRates.BTC) {
						const rate = decimalToUnits(this.props.exchangeRates.BTC.USD, 'USD')
						amount = this.props.currency == "BTC"
							? unitsToDecimal(satoshiAmount, 'BTC')
							: unitsToDecimal( Math.round((satoshiAmount/cryptoUnits.BTC) * rate), 'USD')
					}
					else {
						amount = 0
					}
					const direction = (transaction.type == "card" || transaction.fromAddress == this.props.bitcoinAddress) ? "to" : "from"

					return (
						<TransactionLine
							key={"transactionLine"+transaction.id}
							transaction={transaction}
							direction={direction}
							amount={currencyPrefix[this.props.currency] + amount}
							loading={this.state.loading}
							onPress={() => {
									this.props.showViewModal({
									  transaction,
									  direction,
					                  address: transaction.type == 'blockchain' ? transaction[direction+'Address'] : null,
				                      exchangeRate: this.props.exchangeRates.BTC["USD"],
				                	})
			             	}}/>
					)
				})}
				{this.props.transactions.length == 0 && <View style={styles.noTransactions}>
					<Text style={styles.noTransactionsText}>
						Send or receive some bitcoin and it{"'"}ll show up here.
					</Text>
					<View style={styles.noTransactionsBottom}>
						<Text style={styles.noTransactionsBottomText}>
							Send some bitcoin!
						</Text>
						<Image resizeMode="contain" style={styles.noTransactionsBottomImage} source={require("../../assets/images/downArrow.png")}/>
					</View>
				</View>}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	noTransactions: {
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		// backgroundColor: colors.gray,
		flex: 1,
	},
	noTransactionsText: {
		color: colors.gray,
		fontSize: 18,
		fontWeight: "400",
		textAlign: "center",
		width: 200,
		marginTop: 36,
	},
	noTransactionsBottom: {
		flexDirection: "column",
		alignItems: "center",
	},
	noTransactionsBottomText: {
		color: colors.gray,
		fontSize: 18,
		fontWeight: "400",
		textAlign: "center",
	},
	noTransactionsBottomImage: {
		width: 12,
		height: 24,
		margin: 12,
	},
	history: {
		padding: 20,
		// backgroundColor: colors.primary
	},
	sectionTitle: {
		color: colors.primaryDarkText,
		fontSize: 20,
		fontWeight: "700"
	},
})

const mapStateToProps = state => {
	return {
		exchangeRates: state.crypto.exchangeRates,
		currency: state.crypto.activeCurrency,
		transactions: state.transactions.transactions,
		isLoadingTransactions: state.transactions.isLoadingTransactions,
		isLoadingExchangeRates: state.crypto.isLoadingExchangeRates,
		bitcoinAddress: state.crypto.wallets.BTC.address,
	}
}

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			showViewModal
		},
		dispatch
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(History)