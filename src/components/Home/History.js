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
import { cryptoUnits } from '../../lib/cryptos'
import { showViewModal } from '../../redux/modal'
import moment from "moment"

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class History extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
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
		else {
			return false
		}
	}
  
	render() {

		const currencyPrefix = {
			BTC: "BTC ",
			USD: "$"
		}

		return (
			<View style={styles.history}>
				<Text style={styles.sectionTitle}>Your history</Text>
				{this.props.transactions.map(transaction => {
					const cryptoAmount = transaction.type == 'card' ? transaction.amount/cryptoUnits.BTC : transaction.amount.subtotal/cryptoUnits.BTC
					let amount
					if (this.props.exchangeRates.BTC) {
						amount = this.props.currency == "BTC"
							? parseFloat(cryptoAmount).toFixed(5)
							: parseFloat(cryptoAmount*this.props.exchangeRates.BTC[this.props.currency]).toFixed(2)
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
									this.props.showViewModal({
											  transaction,
											  direction,
  						                      address: transaction.type == 'blockchain' ? transaction[direction+'Address'] : null,
						                      exchangeRate: this.props.exchangeRates.BTC["USD"],
						                	})
						             	}
						            }
								/>
						        )
							})
						}
					)
				})}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	history: {
		padding: 20,
		flex: 1,
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