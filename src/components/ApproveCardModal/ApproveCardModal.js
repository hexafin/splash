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

	componentWillMount() {
		this.backgroundOpacity = new Animated.Value(0)
	}

	componentDidMount() {
		Animated.sequence([
		Animated.delay(300),
		Animated.timing(this.backgroundOpacity, {
 			toValue: 1,
 			easing: Easing.linear(),
 			duration: 200
 		}),
	 ]).start();
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
	    	exchangeRate
		} = this.props.navigation.state.params
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

		const dismiss = () => {
			Animated.timing(this.backgroundOpacity, {
				toValue: 0,
				duration: 200,
				easing: Easing.linear(),
			}).start(({finished}) => {
				if (finished) {
					this.props.navigation.goBack()
					this.props.DismissTransaction()
				}
			})
		}

	  const letter = domain[0].toUpperCase()
	  const rate = parseFloat(exchangeRate).toFixed(2)
	  const btcAmount = (1.0*relativeAmount/parseFloat(exchangeRate)).toFixed(5)
		const domainCapitalized = domain[0].toUpperCase() + domain.slice(1)

		return (
			<TouchableWithoutFeedback onPress={() => dismiss()}>
			<Animated.View style={[styles.container, {backgroundColor: this.backgroundOpacity.interpolate({
																																										        inputRange: [0, 1],
																																										        outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.2)']
																																										    })}]}>
				<View style={{ flexDirection: "row" }}>
					<TouchableWithoutFeedback onPress={() => {}}>
					<View style={styles.popup}>
						{ !this.props.error &&
								<View style={styles.content}>
	                <View style={styles.header}>
	                  <Text style={styles.title}>Transaction request</Text>
	                  <TouchableOpacity onPress={() => dismiss()}>
	                    <Image style={styles.closeButton} source={require('../../assets/icons/Xbutton.png')}/>
	                  </TouchableOpacity>
	                </View>
	                <View style={styles.information}>
	                  <Text style={styles.exchangeText}>1 BTC = ${rate} {relativeCurrency}</Text>
	                  <View style={styles.amountBox}>
	                    <Text style={{fontSize: 28, color: colors.white, fontWeight: '600'}}>{relativeCurrency} ${relativeAmount}</Text>
	                    <Text style={{fontSize: 18, opacity: 0.77, color: colors.white, fontWeight: '600'}}>{btcAmount} BTC</Text>
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
											checkmarkCallback={() => dismiss()}
											disabled={this.props.error}
											title={"Approve Transaction"} primary={true}/>
	                  <View style={{flexDirection: 'row', paddingTop: 10, alignSelf: 'center', alignItems: 'center'}}>
	                    <Image style={{height: 13, width: 10}} source={require('../../assets/icons/lockIcon.png')}/>
	                    <Text style={{paddingLeft: 10, backgroundColor: 'rgba(0,0,0,0)', color: colors.lightGray, fontSize: 15, fontWeight: '600'}}>Payment secured by Splash</Text>
	                  </View>
	                </View>
								</View>
	            }

						{this.props.error &&
							<View style={styles.content}>
							<View style={styles.header}>
								<Text style={styles.title}>Transaction request</Text>
								<TouchableOpacity onPress={() => dismiss()}>
									<Image style={{height: 14, width: 14}} source={require('../../assets/icons/Xbutton.png')}/>
								</TouchableOpacity>
							</View>
							<Text style={{justifyContent: 'center', alignItems: 'center'}}>
								Oops! something went wrong when processing your
								transaction
							</Text>
							</View>}
					</View>
					</TouchableWithoutFeedback>
				</View>
			</Animated.View>
			</TouchableWithoutFeedback>

		)
	}
}

export default ApproveCardModal

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0)",
    justifyContent: 'flex-end'
	},
  popup: {
    flex: 1,
    flexDirection: "column",
    height: 474,
    alignItems: "center",
    borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
    backgroundColor: colors.white
  },
  content: {
    flex: 1,
    paddingTop: 32,
    paddingBottom: 72,
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
    paddingBottom: 20,
  },
})
