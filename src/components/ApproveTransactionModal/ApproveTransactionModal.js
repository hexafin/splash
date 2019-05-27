import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { colors } from "../../lib/colors";
import LoadingCircle from "../universal/LoadingCircle";
import Checkmark from "../universal/Checkmark";
import TouchID from "react-native-touch-id";
import Button from "../universal/Button";
import {
	erc20Names,
	cryptoUnits,
	decimalToUnits,
	unitsToDecimal,
	cryptoTitleDict
} from "../../lib/cryptos";
import { BITCOIN_ERRORS, GetBitcoinFees } from "../../bitcoin-api";
import { getGasLimit, ETHEREUM_ERRORS } from "../../ethereum-api";

/*
Popup confirming transaction in SendTransaction flow
*/

class ApproveTransactionModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			success: false,
			wasLoading: false,
			unitFee: null
		};
	}

	componentDidMount() {
		const { toAddress, amount, currency, exchangeRate, activeCryptoCurrency, network } = this.props;

		const rate = decimalToUnits(exchangeRate, "USD");
		const unitAmount =
			currency == "USD" ? Math.round((amount / rate) * cryptoUnits[activeCryptoCurrency]) : amount;
		const feeApi =
			activeCryptoCurrency == "BTC"
				? GetBitcoinFees({ network: network, from: this.props.userAddress, amtSatoshi: unitAmount })
				: getGasLimit({
						fromAddress: this.props.userAddress,
						toAddress,
						weiAmount: unitAmount,
						currency: activeCryptoCurrency,
						network
				  });

		feeApi.then(unitFee => {
			this.setState(prevState => {
				return {
					...prevState,
					unitFee
				};
			});
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.loading == true) {
			this.setState(prevState => {
				return {
					...prevState,
					wasLoading: true
				};
			});
		}

		if (nextProps.loading == false && this.state.wasLoading == true && !nextProps.error) {
			this.setState(prevState => {
				return {
					...prevState,
					wasLoading: false,
					success: true
				};
			});
		}
	}

	render() {
		const {
			toAddress,
			toId,
			toSplashtag,
			amount,
			currency,
			exchangeRate,
			biometricEnabled,
			activeCryptoCurrency
		} = this.props;

		const rate = decimalToUnits(exchangeRate, "USD");
		const unitAmount =
			currency == "USD" ? Math.round((amount / rate) * cryptoUnits[activeCryptoCurrency]) : amount;
		const relativeAmount =
			currency == "USD" ? amount : Math.round((amount / cryptoUnits[activeCryptoCurrency]) * rate);

		let fee = 0;
		let relativeFee = 0;
		let totalUnitAmount = unitAmount;
		if (this.state.unitFee) {
			if (erc20Names.indexOf(activeCryptoCurrency) > -1) {
				fee = unitsToDecimal(this.state.unitFee, "ETH");
				relativeFee = unitsToDecimal(
					Math.round((this.state.unitFee / cryptoUnits.ETH) * rate),
					"USD"
				);
			} else {
				fee = unitsToDecimal(this.state.unitFee, activeCryptoCurrency);
				relativeFee = unitsToDecimal(
					Math.round((this.state.unitFee / cryptoUnits[activeCryptoCurrency]) * rate),
					"USD"
				);
				totalUnitAmount = unitAmount + this.state.unitFee;
			}
		}
		const totalRelativeAmount = Math.round(
			(totalUnitAmount / cryptoUnits[activeCryptoCurrency]) * rate
		);

		const runTransaction = () => {
			this.props
				.SendTransaction(
					toAddress,
					unitAmount,
					this.state.unitFee,
					relativeAmount,
					toId,
					toSplashtag,
					activeCryptoCurrency
				)
				.then(() => this.props.dismiss(true))
				.catch(error => {
					if (error == BITCOIN_ERRORS.BALANCE || error == ETHEREUM_ERRORS.BALANCE) {
						Alert.alert("Insufficient balance", null, [
							{
								text: "Dismiss",
								onPress: () => {
									this.props.dismiss(false);
								}
							}
						]);
					} else if (error == BITCOIN_ERRORS.UTXOS) {
						Alert.alert(
							"Sorry! We're waiting for Blockchain confirmations. Please try again later.",
							null,
							[
								{
									text: "Dismiss",
									onPress: () => {
										this.props.dismiss(false);
									}
								}
							]
						);
					} else if (error == BITCOIN_ERRORS.FEE) {
						Alert.alert(
							cryptoTitleDict[activeCryptoCurrency] +
								" fee is greater than balance. Try lowering the fee in settings.",
							null,
							[
								{
									text: "Dismiss",
									onPress: () => {
										this.props.dismiss(false);
									}
								}
							]
						);
					}
				});

			// 5 second timeout
			setTimeout(() => {
				if (this.props.loading) {
					this.props.showTimeoutModal();
				}
			}, 15000);
		};

		const confirm = () => {
			if (totalUnitAmount) {
				if (biometricEnabled) {
					TouchID.authenticate("Sign transaction biometrically")
						.then(() => {
							runTransaction();
						})
						.catch(error => {
							this.props.dismiss(false);
						});
				} else {
					runTransaction();
				}
			} else {
				Alert.alert("Unable to calculate fee. Please try again");
			}
		};

		return (
			<View style={styles.content}>
				<View style={styles.header}>
					<Text style={styles.title}>Confirm transaction</Text>
					<TouchableOpacity onPress={() => this.props.dismiss(false)}>
						<Image style={styles.closeButton} source={require("../../assets/icons/Xbutton.png")} />
					</TouchableOpacity>
				</View>
				<View style={styles.information}>
					<Text style={styles.exchangeText}>
						1 {activeCryptoCurrency} = ${unitsToDecimal(rate, "USD")} USD
					</Text>
					<View style={styles.amountBox}>
						<Text style={styles.relativeText}>
							USD ${unitsToDecimal(totalRelativeAmount, "USD")}
						</Text>
						<Text style={styles.amountText}>
							{unitsToDecimal(totalUnitAmount, activeCryptoCurrency)} {activeCryptoCurrency}
						</Text>
					</View>
				</View>
				<View style={styles.feeBox}>
					<Text style={styles.description}>
						Blockchain fee —— {fee} {activeCryptoCurrency} (${relativeFee})
					</Text>
					<Text style={styles.description}>
						They receive —— {unitsToDecimal(unitAmount, activeCryptoCurrency)}{" "}
						{activeCryptoCurrency} (${unitsToDecimal(relativeAmount, "USD")})
					</Text>
				</View>
				<Text style={[styles.description, { paddingBottom: 15 }]}>To {toAddress}</Text>
				<Button
					onPress={confirm}
					style={styles.button}
					loading={this.props.loading && !this.state.success}
					checkmark={this.state.success && !this.props.loading}
					checkmarkPersist={true}
					checkmarkCallback={() => {
						this.props.dismiss(true);
					}}
					disabled={this.props.error != null ? true : false}
					title={"Send Transaction"}
					primary={true}
				/>
			</View>
		);
	}
}

export default ApproveTransactionModal;

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingTop: 25,
		paddingBottom: 65,
		paddingHorizontal: 25,
		justifyContent: "space-between",
		alignSelf: "stretch"
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingBottom: 10
	},
	closeButton: {
		height: 20,
		width: 20,
		margin: 8
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
		color: colors.nearBlack
	},
	information: {
		flex: 1,
		paddingHorizontal: 32,
		justifyContent: "space-around",
		alignItems: "center"
	},
	exchangeText: {
		fontSize: 14,
		fontWeight: "500",
		color: colors.gray,
		paddingBottom: 5
	},
	amountBox: {
		height: 83,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "stretch",
		borderRadius: 8,
		backgroundColor: "#6364F1"
	},
	relativeText: {
		fontSize: 28,
		color: colors.white,
		fontWeight: "600"
	},
	amountText: {
		fontSize: 18,
		opacity: 0.77,
		color: colors.white,
		fontWeight: "600"
	},
	feeBox: {
		padding: 10
	},
	description: {
		textAlign: "center",
		fontSize: 11,
		color: colors.gray,
		fontWeight: "500"
	},
	footer: {
		flexDirection: "row",
		paddingTop: 10,
		alignSelf: "center",
		alignItems: "center"
	},
	lockIcon: {
		height: 13,
		width: 10
	},
	securedText: {
		paddingLeft: 10,
		backgroundColor: "rgba(0,0,0,0)",
		color: colors.lightGray,
		fontSize: 15,
		fontWeight: "600"
	}
});
