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
	Clipboard,
	Share,
	Dimensions,
	TextInput
} from "react-native";
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import { erc20Names } from "../../lib/cryptos";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { isIphoneX } from "react-native-iphone-x-helper";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import TransactionLine from "../universal/TransactionLine";
import { cryptoUnits, decimalToUnits, unitsToDecimal } from "../../lib/cryptos";
import { showViewModal } from "../../redux/modal";

/*
History of all users' transactions
<History />
*/

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export class History extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			height: SCREEN_HEIGHT
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isLoadingTransactions || nextProps.isLoadingExchangeRates) {
			this.setState({ loading: true });
		} else {
			this.setState({ loading: false });
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		const activeCryptoCurrency = this.props.activeCryptoCurrency;
		if (
			!nextProps.isLoadingExchangeRates &&
			nextProps.exchangeRates[activeCryptoCurrency] &&
			this.props.exchangeRates[activeCryptoCurrency] &&
			nextProps.exchangeRates[activeCryptoCurrency].USD !=
				this.props.exchangeRates[activeCryptoCurrency].USD
		) {
			return true;
		} else if (nextProps.currency != this.props.currency) {
			return true;
		} else if (nextState.loading != this.state.loading) {
			return true;
		} else if (
			nextState.modalVisible != this.state.modalVisible ||
			nextState.modalProps != this.state.modalProps
		) {
			return true;
		} else if (nextProps.transactions.length != this.props.transactions.length) {
			return true;
		} else if (nextProps.network != this.props.network) {
			return true;
		} else {
			return false;
		}
	}

	dynamicHeight(event, stateProp) {
		this.setState({ [stateProp]: event.nativeEvent.layout.height });
	}

	render() {
		const currencyPrefix = {
			BTC: "BTC ",
			ETH: "ETH ",
			GUSD: "GUSD ",
			USD: "$"
		};

		return (
			<View
				style={[
					styles.history,
					{
						minHeight: this.state.height,
						paddingBottom: this.props.transactions.length == 0 ? 20 : isIphoneX() ? 140 : 120
					}
				]}
				onLayout={event => this.dynamicHeight(event, "height")}
			>
				<View style={styles.sectionHeader}>
					<Text style={styles.sectionTitle}>Your history</Text>
					{this.props.network == "testnet" && (
						<View style={styles.testnetBox}>
							<Text style={styles.testnetText}>Testnet</Text>
						</View>
					)}
				</View>
				{this.props.transactions.map(transaction => {
					const unitAmount =
						transaction.type == "card" ? transaction.amount : transaction.amount.subtotal;
					let amount;
					if (this.props.exchangeRates[this.props.activeCryptoCurrency]) {
						const rate = decimalToUnits(
							this.props.exchangeRates[this.props.activeCryptoCurrency].USD,
							"USD"
						);
						amount =
							this.props.currency != "USD"
								? unitsToDecimal(unitAmount, this.props.activeCryptoCurrency)
								: unitsToDecimal(
										Math.round((unitAmount / cryptoUnits[this.props.activeCryptoCurrency]) * rate),
										"USD"
								  );
					} else {
						amount = 0;
					}

					let direction;
					if (
						transaction.fromAddress == this.props.address ||
						(this.props.activeCryptoCurrency != "BTC" &&
							transaction.fromAddress == this.props.address.toLowerCase())
					) {
						direction = "to";
					} else {
						direction = "from";
					}

					return (
						<TransactionLine
							key={"transactionLine" + transaction.id}
							transaction={transaction}
							direction={direction}
							amount={currencyPrefix[this.props.currency] + amount}
							loading={false}
							onPress={() => {
								this.props.showViewModal({
									transaction,
									direction,
									address:
										transaction.type == "blockchain" ? transaction[direction + "Address"] : null,
									exchangeRate: this.props.exchangeRates[this.props.activeCryptoCurrency].USD
								});
							}}
						/>
					);
				})}
				{this.props.transactions.length == 0 && (
					<View style={styles.noTransactions}>
						<Text style={styles.noTransactionsText}>
							No transactions yet.{"\n"}
							Here{"'"}s what it could look like...
						</Text>

						<Image
							resizeMode="contain"
							style={styles.noTransactionsImage}
							source={require("../../assets/images/empty_state.png")}
						/>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	noTransactions: {
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "center",
		// backgroundColor: colors.gray,
		flex: 1
	},
	noTransactionsText: {
		color: colors.lightGray,
		fontSize: 18,
		fontWeight: "400",
		lineHeight: 30,
		textAlign: "center",
		marginTop: 36
	},
	noTransactionsImage: {
		width: SCREEN_WIDTH - 20,
		height: 200,
		marginTop: 5
	},
	history: {
		padding: 20
		// backgroundColor: colors.primary
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	testnetBox: {
		backgroundColor: colors.lighterGray,
		paddingHorizontal: 15,
		paddingVertical: 2,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center"
	},
	testnetText: {
		color: colors.white,
		fontSize: 16,
		fontWeight: "600"
	},
	sectionTitle: {
		color: colors.primaryDarkText,
		fontSize: 20,
		fontWeight: "700"
	}
});

const mapStateToProps = state => {
	let activeCryptoCurrency;
	if (erc20Names.indexOf(state.crypto.activeCryptoCurrency) > -1) {
		activeCryptoCurrency = "ETH";
	} else {
		activeCryptoCurrency = state.crypto.activeCryptoCurrency;
	}

	return {
		exchangeRates: state.crypto.exchangeRates,
		currency: state.crypto.activeCurrency,
		activeCryptoCurrency: state.crypto.activeCryptoCurrency,
		transactions: state.transactions.transactions[state.crypto.activeCryptoCurrency]
			? state.transactions.transactions[state.crypto.activeCryptoCurrency]
			: state.transactions.transactions.ETH,
		isLoadingTransactions: state.transactions.isLoadingTransactions,
		isLoadingExchangeRates: state.crypto.isLoadingExchangeRates,
		address: state.crypto.wallets[activeCryptoCurrency].address,
		network: state.crypto.wallets[activeCryptoCurrency].network
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			showViewModal
		},
		dispatch
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(History);
