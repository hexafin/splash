import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native"
import { colors } from "../../lib/colors"
import LoadingCircle from "../universal/LoadingCircle"
import Checkmark from "../universal/Checkmark"
import TouchID from "react-native-touch-id"
import Button from "../universal/Button"
import { cryptoUnits } from '../../lib/cryptos'
import { BITCOIN_ERRORS } from '../../bitcoin-api'

class ApproveTransactionModal extends Component {

	constructor(props) {
		super(props)
		this.state = {
			success: false,
			wasLoading: false,
			feeSatoshi: null,
		}
	}

	componentDidMount() {

		const {
			address,
			amount,
			currency,
		    exchangeRate
		} = this.props

	    const rate = parseFloat(exchangeRate).toFixed(2)
	    const btcAmount = (currency == 'USD') ? (1.0*amount/parseFloat(exchangeRate)) : amount
	
		api.GetBitcoinFees({network: this.props.bitcoinNetwork, from: this.props.userBitcoinAddress, amtSatoshi: btcAmount*cryptoUnits.BTC}).then(feeSatoshi => {
			this.setState(prevState => {
				return {
					...prevState,
					feeSatoshi,
				}
			})			
		})
	}

	componentWillReceiveProps(nextProps) { 
		if(nextProps.loading == true) {
			this.setState(prevState => {
				return {
					...prevState,
					wasLoading: true
				}
			})			
		}

		if(nextProps.loading == false && this.state.wasLoading == true) {
			this.setState(prevState => {
				return {
					...prevState,
					wasLoading: false,
					success: true,
				}
			})			
		}
	}

	render() {

		const {
			address,
			toId,
			toSplashtag,
			amount,
			currency,
		    exchangeRate,
		} = this.props


	    const rate = parseFloat(exchangeRate).toFixed(2)
	    const btcAmount = (currency == 'USD') ? (1.0*amount/parseFloat(exchangeRate)) : parseFloat(amount)

		const fee = (1.0*this.state.feeSatoshi/cryptoUnits.BTC).toFixed(5)
		const totalBtcAmount = (parseFloat(btcAmount)+parseFloat(fee)).toFixed(5)
		const totalRelativeAmount = (1.0*totalBtcAmount*parseFloat(rate)).toFixed(2)

		const confirm = () => {
			if (totalBtcAmount) {
				const relativeAmount = (1.0*btcAmount*parseFloat(rate)).toFixed(2)
				TouchID.authenticate("Confirm Transaction").then(success => {
					if (success) {
						this.props.SendTransaction(address, btcAmount, this.state.feeSatoshi, relativeAmount, toId, toSplashtag)
							.then(() => this.props.dismiss(true))
							.catch(error => {
								if (error == BITCOIN_ERRORS.BALANCE) {
									Alert.alert("Insufficient balance", null, [
													{text: "Dismiss", onPress: () => {
														this.props.dismiss()
													}}
												])
								} else if (error == BITCOIN_ERRORS.UTXOS) {
									Alert.alert("Insufficient available balance. Please wait for your transactions to be confirmed before sending more.", null, [
													{text: "Dismiss", onPress: () => {
														this.props.dismiss()
													}}
												])
								} else if (error == BITCOIN_ERRORS.FEE) {
									Alert.alert("Bitcoin fee is greater than balance. Try lowering the fee in settings.", null, [
													{text: "Dismiss", onPress: () => {
														this.props.dismiss()
													}}
												])
								}
							})

						// 5 second timeout	
						setTimeout(() => {
							if (this.props.loading) {
								this.props.showTimeoutModal()								
							}
						}, 5000)
					}
				})
				.catch(error => {
					console.log("TouchID Error:", error)
				})
			} else {
				Alert.alert("Unable to calculate fee. Please try again")
			}
		}

		return (
				<View style={styles.content}>
	                <View style={styles.header}>
	                  <Text style={styles.title}>Confirm transaction</Text>
	                  <TouchableOpacity onPress={() => this.props.dismiss(false)}>
	                    <Image style={styles.closeButton} source={require('../../assets/icons/Xbutton.png')}/>
	                  </TouchableOpacity>
	                </View>
	                <View style={styles.information}>
	                  <Text style={styles.exchangeText}>1 BTC = ${rate} USD</Text>
	                  <View style={styles.amountBox}>
	                    <Text style={styles.relativeText}>USD ${totalRelativeAmount}</Text>
	                    <Text style={styles.amountText}>{totalBtcAmount} BTC</Text>
	                  </View>
	                </View>
	                <View style={styles.feeBox}>
	                    <Text style={styles.description}>Blockchain fee —— {fee} BTC</Text>
	                    <Text style={styles.description}>They receive —— {(btcAmount.toFixed(5))} BTC</Text>
	                </View>
	                <Text style={[styles.description, {paddingBottom: 15}]}>To {address}</Text>
	                  <Button
	                  	onPress={confirm}
	                  	style={styles.button} 
	                  	loading={this.props.loading && !this.state.success}
	                  	checkmark={this.state.success && !this.props.loading}
	                  	checkmarkPersist={true}
						checkmarkCallback={() => this.props.dismiss(true)}
						disabled={(this.props.error != null) ? true : false}
						title={"Send Transaction"} primary={true}/>
				</View>
		)
	}
}

export default ApproveTransactionModal

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 65,
    paddingHorizontal: 25,
    justifyContent: 'space-between',
    alignSelf: "stretch",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  closeButton: {
	height: 20,
	width: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.nearBlack,
  },
  information: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  exchangeText: {
	fontSize: 14,
	fontWeight: '500',
	color: colors.gray,
	paddingBottom: 5,
  },
  amountBox: {
    height: 83,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 8,
    backgroundColor: '#6364F1',
  },
  relativeText: {
  	fontSize: 28,
  	color: colors.white,
  	fontWeight: '600'
  },
  amountText: {
  	fontSize: 18,
  	opacity: 0.77,
  	color: colors.white,
  	fontWeight: '600'
  },
  feeBox: {
  	padding: 10
  },
  description: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.gray,
    fontWeight: '500',
  },
  footer: {
  	flexDirection: 'row',
  	paddingTop: 10,
  	alignSelf: 'center',
  	alignItems: 'center'
  },
  lockIcon: {
  	height: 13,
  	width: 10
  },
  securedText: {
  	paddingLeft: 10,
  	backgroundColor: 'rgba(0,0,0,0)',
  	color: colors.lightGray,
  	fontSize: 15,
  	fontWeight: '600'
  }
})