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
import { resetQr } from "../../redux/transactions/actions"
import PayButton from "./PayButton"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

let bitcoin = require('bitcoinjs-lib')

class PayFlow extends Component {
	constructor(props) {
		super(props)
		this.state = {
			amount: "",
			address: "",
			currency: props.currency,
			activeSection: "chooseType"
		}
		this.handleChooseType = this.handleChooseType.bind(this)
		this.handleSend = this.handleSend.bind(this)
		this.reset = this.reset.bind(this)
		this.dynamicHeight = this.dynamicHeight.bind(this)
	}

	componentWillMount() {
		this.chooseTypeOpacity = new Animated.Value(1)
		this.enterAmountOpacity = new Animated.Value(0)
		this.wrapperHeight = new Animated.Value(217)
		this.findSplashtagOpacity = new Animated.Value(0)
	}

	dynamicHeight(event, stateProp) {
		this.setState({[stateProp]: event.nativeEvent.layout.height})
	}

	reset() {
		this.setState({amount: "", currency: "BTC", activeSection: "chooseType"})
		this.props.resetQr()
		Animated.sequence([
			Animated.parallel([
				// fade out enter amount
				Animated.timing(this.enterAmountOpacity, {
					toValue: 0,
					duration: 500
				}),
				Animated.timing(this.findSplashtagOpacity, {
					toValue: 0,
					duration: 500
				})
			]),
			Animated.parallel([
				// fade in choose type
				Animated.timing(this.chooseTypeOpacity, {
					toValue: 1,
					duration: 500
				}),
				// change height to choose type height
				Animated.timing(this.wrapperHeight, {
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
		this.setState({currency: nextProps.currency})

		if (nextProps.qrAddress != null) {
			// just captured a qr address => move the flow along
			this.setState({activeSection: "enterAmount", address: nextProps.qrAddress})
			this.props.resetQr()
			Animated.sequence([
				// fade out choose type
				Animated.timing(this.chooseTypeOpacity, {
					toValue: 0,
					duration: 500
				}),
				Animated.parallel([
					Animated.timing(this.enterAmountOpacity, {
						toValue: 1,
						duration: 500
					}),
					Animated.timing(this.wrapperHeight, {
						toValue: this.state.enterAmountHeight,
						duration: 500
					})
				])
			]).start()
		}
	}

	handleSend() {

		const amount = parseFloat(this.state.amount)
		const address = this.state.address
		const network = (this.props.network == 'testnet') ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
		try {

			bitcoin.address.toOutputScript(address, network)

			if (!this.props.balance) {
				Alert.alert("Unable to load balance")
			} else if (!this.props.exchangeRate) {
				Alert.alert("Unable to load exchange rate")
			} else if (!amount) {
				Alert.alert("Please enter amount")
			} else if (!address) {
				Alert.alert("Please enter address")
			} else if (parseFloat(amount) >= this.props.balance[this.state.currency]) {
				Alert.alert("Not enough balance")
			} else {
				this.props.navigation.navigate("ApproveTransactionModal", {
					address,
					amount: parseFloat(amount),
					currency: this.state.currency,
					exchangeRate: this.props.exchangeRate['USD']
				});
			}

		} catch(e) {
			Alert.alert("Invalid bitcoin address")
		}
	}

	handleChooseType(key) {

		switch(key) {
			case "clipboard":
				Clipboard.getString().then(address => {
					console.log(address)
					this.setState({address: address})
				})
				this.setState({activeSection: "enterAmount"})
				Animated.sequence([
					// fade out choose type
					Animated.timing(this.chooseTypeOpacity, {
						toValue: 0,
						duration: 500
					}),
					Animated.parallel([
						Animated.timing(this.enterAmountOpacity, {
							toValue: 1,
							duration: 500
						}),
						Animated.timing(this.wrapperHeight, {
							toValue: this.state.enterAmountHeight,
							duration: 500
						})
					])
				]).start()
				break
			case "qr":
				this.props.navigation.navigate("ScanQrCode")
				break
		}
	}

	render() {
		
		if (this.chooseTypeHeight) {
			this.wrapperHeight.setValue(this.state.chooseTypeHeight)
		}

		return (
			<Animated.View keyboardShouldPersistTaps={true} style={[styles.wrapper, {
				height: this.wrapperHeight
			}]}>
				<Animated.View
					style={[styles.section, {
						opacity: this.chooseTypeOpacity
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
						opacity: this.enterAmountOpacity
					}]}
					pointerEvents={this.state.activeSection == "enterAmount" ? "auto" : "none"}
					onLayout={event => this.dynamicHeight(event, "enterAmountHeight")}>

					<Text style={styles.title}>Sending to bitcoin address</Text>
					<Text style={styles.subTitle}>{this.state.address}</Text>

					<View style={styles.amountInputWrapper}>
						<Text style={styles.inputPrefix}>{ this.state.currency }</Text>
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
						onPress={this.handleSend}/>
					
				</Animated.View>

				<Animated.View 
					style={[styles.section, {
						opacity: this.findSplashtagOpacity
					}]}
					pointerEvents={this.state.activeSection == "findSplashtag" ? "auto" : "none"}
					onLayout={event => this.dynamicHeight(event, "findSplashtagHeight")}>

					
					
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
		color: colors.gray,
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
        paddingLeft: 50,
        backgroundColor: colors.white
	}
})

const mapStateToProps = state => {
	return {
		qrAddress: state.transactions.qrAddress
	}
}

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			resetQr
		},
		dispatch
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(PayFlow)