import React, { Component } from "react";
import { Animated, Easing, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Image } from "react-native"
import { colors } from "../../lib/colors"
import LoadingCircle from "../universal/LoadingCircle"
import LetterCircle from "../universal/LetterCircle"
import Checkmark from "../universal/Checkmark"
import TouchID from "react-native-touch-id"
import Button from "../universal/Button"

class ApproveCardModal extends Component {

	constructor(props) {
		super(props)
		this.state = {
			success: false,
			wasLoading: false,
		}
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
			transactionId,
			relativeAmount,
			domain,
			relativeCurrency,
	    	exchangeRate,
	    	activeCryptoCurrency,
		} = this.props
		const transaction = {
			transactionId,
			relativeAmount,
			domain,
			relativeCurrency
		}

		const approve = transaction => {
			TouchID.authenticate("Approve Card")
				.then(success => {
					if (success) {
						this.props.ApproveTransaction(transaction)
					}
				})
				.catch(error => {
					console.log("TouchID Error:", error)
				})
		}


	  const letter = domain[0].toUpperCase()
	  const rate = parseFloat(exchangeRate).toFixed(2)
	  const btcAmount = (1.0*relativeAmount/parseFloat(exchangeRate)).toFixed(5)
		const domainCapitalized = domain[0].toUpperCase() + domain.slice(1)

		return (
				<View style={styles.content}>
	                <View style={styles.header}>
	                  <Text style={styles.title}>Transaction request</Text>
	                  <TouchableOpacity onPress={() => this.props.dismiss(false)}>
	                    <Image style={styles.closeButton} source={require('../../assets/icons/Xbutton.png')}/>
	                  </TouchableOpacity>
	                </View>
	                <View style={styles.information}>
	                  <Text style={styles.exchangeText}>1 {activeCryptoCurrency} = ${rate} {relativeCurrency}</Text>
	                  <View style={styles.amountBox}>
	                    <Text style={{fontSize: 28, color: colors.white, fontWeight: '600'}}>{relativeCurrency} ${relativeAmount}</Text>
	                    <Text style={{fontSize: 18, opacity: 0.77, color: colors.white, fontWeight: '600'}}>{btcAmount} {activeCryptoCurrency}</Text>
	                  </View>
	                  <View style={styles.domainInfo}>
	                    <Text style={{paddingRight: 10, fontSize: 12, fontWeight: '700', color: colors.nearBlack}}>on</Text>
	                    <LetterCircle size={32} letter={letter}/>
	                    <View style={styles.domain}>
	                      <Text style={{color: colors.nearBlack, fontSize: 15, fontWeight: '600'}}>{domainCapitalized}</Text>
	                      <Text style={{color: colors.gray, fontSize: 12, fontWeight: '600'}}>via Splash Chrome extension</Text>
	                    </View>
	                  </View>
	                </View>
	                <View style={styles.footer}>
	                  <Text style={styles.description}>We will load {relativeCurrency} ${relativeAmount} onto a temporary {'\n'} “magic” credit card you can use in your browser.</Text>
	                  <Button
	                  	onPress={() => approve(transaction)}
	                  	style={styles.button} 
	                  	loading={this.props.loading && !this.state.success}
	                  	checkmark={this.state.success && !this.props.loading}
	                  	checkmarkPersist={true}
											checkmarkCallback={() => this.props.dismiss(false)}
											disabled={this.props.error !== null}
											title={"Approve Transaction"} primary={true}/>
	                  <View style={{flexDirection: 'row', paddingTop: 10, alignSelf: 'center', alignItems: 'center'}}>
	                    <Image style={{height: 13, width: 10}} source={require('../../assets/icons/lockIcon.png')}/>
	                    <Text style={{paddingLeft: 10, backgroundColor: 'rgba(0,0,0,0)', color: colors.lightGray, fontSize: 15, fontWeight: '600'}}>Payment secured by Splash</Text>
	                  </View>
	                </View>
				</View>
		)
	}
}

export default ApproveCardModal

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 35,
    paddingHorizontal: 25,
    justifyContent: 'space-between',
    alignSelf: "stretch",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  closeButton: {
  	height: 20,
  	width: 20,
  	margin: 8,
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
		color: colors.gray
	},
  amountBox: {
    height: 83,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 8,
    backgroundColor: '#6364F1',
  },
  domainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
  },
  domain: {
    paddingLeft: 10,
    flexDirection: 'column'
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
		paddingTop: 10,
    paddingBottom: 15,
  },
})
