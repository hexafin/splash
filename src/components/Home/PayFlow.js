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
import { showApproveModal } from '../../redux/modal'
import PayButton from "./PayButton"
import SearchBox from "./SearchBox"
import Hits from "./Hits"
import SplashtagButton from "./SplashtagButton"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import { InstantSearch } from 'react-instantsearch/native';
import api from '../../api'
import firebase from "react-native-firebase";
let firestore = firebase.firestore();

import { algoliaKeys } from '../../../env/keys.json'

class PayFlow extends Component {
	constructor(props) {
		super(props)
		this.state = {
			amount: "",
			address: null,
			currency: props.currency,
			activeSection: "chooseType",
			splashtagSearch: "",
			splashtagSearchResults: [],
			splashtag: null,
			selectedId: null,
			exchangeRates: props.exchangeRates,
			captureQr: false,
		}
		this.handleChooseType = this.handleChooseType.bind(this)
		this.handleSplashtagClick = this.handleSplashtagClick.bind(this)
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
		this.setState({
			amount: "", 
			currency: "BTC", 
			activeSection: "chooseType", 
			splashtagSearch: "",
			splashtagSearchResults: [],
			splashtag: null,
			selectedId: null,
			modalVisible: false,
			modalProps: null
		})
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
		this.setState({
			currency: nextProps.currency, 
			exchangeRates: nextProps.exchangeRates,
			balance: nextProps.balance
		})

		if (nextProps.qrAddress != null) {
			const address = nextProps.qrAddress
			if (api.IsValidAddress(address, nextProps.bitcoinNetwork)) {

				// just captured a qr address => move the flow along if its a real address
				this.setState({activeSection: "enterAmount", address: address})
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
			} else {
				Alert.alert("Invalid bitcoin address")
			}
		}
	}

	handleSend() {

		const amount = parseFloat(this.state.amount)
		const address = this.state.address
		const userId = this.state.selectedId

		const btcAmount = this.state.currency == "BTC" ? amount : amount / this.props.exchangeRates.BTC.USD

		if (!api.IsValidAddress(address, this.props.bitcoinNetwork)) {
			Alert.alert("Invalid bitcoin address")
		} else if (!this.props.balance) {
			Alert.alert("Unable to load balance")
		} else if (!this.props.exchangeRates) {
			Alert.alert("Unable to load exchange rate")
		} else if (!amount) {
			Alert.alert("Please enter amount")
		} else if (!address) {
			Alert.alert("Please enter address")
		} else if (btcAmount >= this.props.balance.BTC) {
			Alert.alert("Not enough balance")
		} else {
			this.props.showApproveModal({
				address,
				userId,
				amount,
				currency: this.state.currency,
				successCallback: () => {
					this.reset()
				},
        	})
     	}
	}

	handleSplashtagClick(user) {
		this.setState({
			activeSection: "enterAmount",
			address: user.wallets.BTC.address,
			splashtag: user.splashtag,
			selectedId: user.objectID,
		})
		Animated.sequence([
			// fade out choose type
			Animated.timing(this.findSplashtagOpacity, {
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

	handleChooseType(key) {

		switch(key) {

			case "clipboard":
				Clipboard.getString().then(address => {
					if (api.IsValidAddress(address, this.props.bitcoinNetwork)) {
						this.setState({address})
					} else {
						Alert.alert("Invalid bitcoin address")
					}
				}).catch(error => {
					Alert.alert("Could not get copied address")
				})
				
				break

			case "splashtag":
				this.setState({activeSection: "findSplashtag"})
				Animated.sequence([
					// fade out choose type
					Animated.timing(this.chooseTypeOpacity, {
						toValue: 0,
						duration: 500
					}),
					Animated.parallel([
						Animated.timing(this.findSplashtagOpacity, {
							toValue: 1,
							duration: 500
						}),
						Animated.timing(this.wrapperHeight, {
							toValue: this.state.findSplashtagHeight,
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

		return (
			<Animated.View keyboardShouldPersistTaps={true} style={[styles.wrapper, {
				height: this.wrapperHeight
			}]}>
				<InstantSearch {...algoliaKeys}>
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

						<Text style={styles.title}>
							Sending to {this.state.splashtag != null ? `@${this.state.splashtag}` : "bitcoin address"}
						</Text>
						<Text style={styles.subTitle}>
							{this.state.address}
						</Text>

						<View style={styles.amountInputWrapper}>
							<Text style={styles.inputPrefix}>{this.state.currency}</Text>
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
						style={[styles.section, styles.findSplashtag, {
							opacity: this.findSplashtagOpacity
						}]}
						pointerEvents={this.state.activeSection == "findSplashtag" ? "auto" : "none"}
						onLayout={event => this.dynamicHeight(event, "findSplashtagHeight")}>

						<Text style={styles.title}>Search for splashtag</Text>
						<SearchBox />
						<Hits callback={this.handleSplashtagClick}/>
					</Animated.View>
				</InstantSearch>
			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		margin: 20,
		position: "relative",
	},
	section: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
	},
	findSplashtag: {
		minHeight: 280
	},
	splashtagSearchButton: {
		position: "absolute",
		right: 10,
		top: 10,
		justifyContent: "center",
		alignItems: "center",
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.primary
	},
	splashtagSearchButtonIcon: {
		width: 20,
		height: 20,
		marginRight: 3,
		marginTop: 1
	},
	splashtagResult: {
		backgroundColor: colors.primary,
		padding: 20,
		shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
	},
	splashtagResultTitle: {
		color: colors.white,
		fontSize: 20,
		fontWeight: "700"
	},
	splashtagResultSubTitle: {
		color: colors.white,
		fontSize: 18,
		fontWeight: "700"
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
	},
	splashtagInput: {
		padding: 20,
		fontSize: 22,
		fontWeight: "600"
	},
	splashtagInputWrapper: {
		shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        marginTop: 10,
        marginBottom: 15,
        borderRadius: 5,
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: colors.white
	}
})

const mapStateToProps = state => {
	return {
		qrAddress: state.transactions.qrAddress,
		balance: state.crypto.balance,
		exchangeRates: state.crypto.exchangeRates,
		currency: state.crypto.activeCurrency,
		bitcoinNetwork: state.crypto.wallets.BTC.network,
		currency: state.crypto.activeCurrency,
	}
}

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			resetQr,
			showApproveModal
		},
		dispatch
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(PayFlow)