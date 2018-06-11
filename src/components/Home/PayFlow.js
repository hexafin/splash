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
import PayButton from "../universal/PayButton"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

class PayFlow extends Component {
	constructor(props) {
		super(props)
		this.state = {
			chooseTypeOpacity: new Animated.Value(1),
			enterAmountOpacity: new Animated.Value(0),
			wrapperHeight: new Animated.Value(217),
			currencySelectScale: new Animated.Value(1),
			amount: "",
			address: "",
			currency: "BTC",
			activeSection: "chooseType"
		}
		this.handleChooseType = this.handleChooseType.bind(this)
		this.reset = this.reset.bind(this)
		this.dynamicHeight = this.dynamicHeight.bind(this)
	}

	dynamicHeight(event, stateProp) {
		this.setState({[stateProp]: event.nativeEvent.layout.height})
	}

	reset() {
		this.setState({amount: "", currency: "BTC", activeSection: "chooseType"})
		Animated.sequence([
			// fade out enter amount
			Animated.timing(this.state.enterAmountOpacity, {
				toValue: 0,
				duration: 500
			}),
			Animated.parallel([
				// fade in choose type
				Animated.timing(this.state.chooseTypeOpacity, {
					toValue: 1,
					duration: 500
				}),
				// change height to choose type height
				Animated.timing(this.state.wrapperHeight, {
					toValue: this.state.chooseTypeHeight,
					duration: 500
				})
			])
		]).start()
		
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.reset) {
			this.reset()
		}
	}

	handleChooseType(key) {

		let animationArray = []
		let address

		switch(key) {
			case "clipboard":
				Clipboard.getString().then(address => {
					console.log(address)
					this.setState({address: address})
				})
				this.setState({activeSection: "enterAmount"})
				animationArray.push(Animated.timing(this.state.enterAmountOpacity, {
					toValue: 1,
					duration: 500
				}))
				animationArray.push(Animated.timing(this.state.wrapperHeight, {
					toValue: this.state.enterAmountHeight,
					duration: 500
				}))
				break
			case "qr":
				// TODO: get address from QR code
				address = "sample-address"
				this.setState({address, activeSection: "enterAmount"})
				animationArray.push(Animated.timing(this.state.enterAmountOpacity, {
					toValue: 1,
					duration: 500
				}))
				animationArray.push(Animated.timing(this.state.wrapperHeight, {
					toValue: this.state.enterAmountHeight,
					duration: 500
				}))
				break
		}

		Animated.sequence([
			// fade out choose type
			Animated.timing(this.state.chooseTypeOpacity, {
				toValue: 0,
				duration: 500
			}),
			Animated.parallel(animationArray)
		]).start()
	}

	render() {

		console.log(this.state)
		
		// if (this.state.chooseTypeHeight) {
		// 	this.state.wrapperHeight.setValue(this.state.chooseTypeHeight)
		// }

		return (
			<Animated.View style={[styles.wrapper, {
				height: this.state.wrapperHeight
			}]}>
				<Animated.View
					style={[styles.section, {
						opacity: this.state.chooseTypeOpacity
					}]}
					pointerEvents={this.state.activeSection == "chooseType" ? "auto" : "none"}
					onLayout={event => this.dynamicHeight(event, "chooseTypeHeight")}>

					<Text style={styles.title}>Pay with bitcoin</Text>
					<PayButton
						title="Scan QR code"
						image={icons.qrIcon}
						onPress={() => this.handleChooseType("qr")}/>
					<PayButton
						title="Send to splashtag"
						image={icons.at}
						onPress={() => this.handleChooseType("splashtag")}/>
					<PayButton
						title="Send to copied address"
						textOnly={true}
						onPress={() => this.handleChooseType("clipboard")}/>

				</Animated.View>

				<Animated.View 
					style={[styles.section, {
						opacity: this.state.enterAmountOpacity
					}]}
					pointerEvents={this.state.activeSection == "enterAmount" ? "auto" : "none"}
					onLayout={event => this.dynamicHeight(event, "enterAmountHeight")}>

					<Text style={styles.title}>Sending to bitcoin address</Text>
					<Text style={styles.subTitle}>{this.state.address}</Text>

					<View style={styles.amountInputWrapper}>
						<TouchableWithoutFeedback
							onPress={() => {
								this.setState(prevState => {
									return {
										...prevState,
										currency: prevState.currency == "BTC" ? "USD" : "BTC"
									}
								})
							}}
							onPressIn={() => {
								ReactNativeHapticFeedback.trigger("impactLight", true)
						        Animated.spring(this.state.currencySelectScale, {
						            toValue: .8
						        }).start()
							}}
							onPressOut={() => {
								ReactNativeHapticFeedback.trigger("impactLight", true)
						        Animated.spring(this.state.currencySelectScale, {
						            toValue: 1,
						            friction: 3,
						            tension: 40
						        }).start()
							}}>
							<Animated.Text style={[styles.inputPrefix, {
								transform: [{scale: this.state.currencySelectScale}]
							}]}>{ this.state.currency }</Animated.Text>
						</TouchableWithoutFeedback>
						<TextInput
							onChangeText={value => {
								this.setState({amount: value})
							}}
							placeholder={"How much?"}
							style={styles.amountInput}
							keyboardType="numeric"
					        value={this.state.amount}
				        />
			        </View>

			        <PayButton
						title={"Send bitcoin"}
						image={icons.send}
						onPress={() => this.handleChooseType("clipboard")}/>
					
				</Animated.View>
			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		margin: 20,
		backgroundColor: colors.white,
		position: "relative",
	},
	section: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
	},
	title: {
		color: colors.primaryDarkText,
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 10
	},
	subTitle: {
		color: colors.gray,
		fontSize: 16,
		fontWeight: "600"
	},
	inputPrefix: {
		fontSize: 22,
		fontWeight: "600",
		color: colors.primary,
		position: "absolute",
		left: 20,
		top: 20
	},
	amountInput: {
		padding: 20,
		fontSize: 22,
		fontWeight: "600"
	},
	amountInputWrapper: {
		shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        marginTop: 15,
        marginBottom: 15,
        borderRadius: 5,
        paddingLeft: 50
	}
})

export default PayFlow