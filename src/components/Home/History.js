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
	Modal,
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
import ViewTransactionModal from "../ViewTransactionModal"
import moment from "moment"

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class History extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			modalVisible: false,
			modalProps: null,
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
		if (nextProps.exchangeRates.BTC.USD != this.props.exchangeRates.BTC.USD) {
			return true
		}
		else if (nextState.loading != this.state.loading) {
			return true
		}
		else if (nextState.modalVisible != this.state.modalVisible) {
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
					console.log(this.props.exchangeRates["USD"], cryptoAmount)
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
								this.setState(prevState => {
									return {
										...prevState,
										modalVisible: true,
										modalProps: {
										  transaction,
										  direction,
						                  address: transaction.type == 'blockchain' ? transaction[direction+'Address'] : null,
					                      exchangeRate: this.props.exchangeRates,
					                      dismiss: () => {
					                      	this.setState({modalVisible: false})
					                      }
										}
									}
								})
							}}
						/>
					)
				})}
				<Modal
				    animationType="none"
			        transparent={true}
			        visible={this.state.modalVisible}>
			        {this.state.modalVisible && <ViewTransactionModal {...this.state.modalProps}/>}
			    </Modal>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	history: {
		padding: 20,
		// backgroundColor: colors.white
	},
	sectionTitle: {
		color: colors.primaryDarkText,
		fontSize: 20,
		fontWeight: "700"
	},
})

const mapStateToProps = state => {
	return {
		exchangeRates: state.crypto.exchangeRates.BTC,
		currency: state.crypto.activeCurrency,
		transactions: state.transactions.transactions,
		isLoadingTransactions: state.transactions.isLoadingTransactions,
		isLoadingExchangeRates: state.crypto.isLoadingExchangeRates,
	}
}

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			
		},
		dispatch
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(History)