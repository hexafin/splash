import React, {Component} from "react"
import {
	Animated,
	Dimensions,
	TouchableWithoutFeedback,
	View,
	Text,
	Alert,
	Keyboard,
	ScrollView,
	StyleSheet,
	Image,
	TextInput,
	Clipboard,
} from "react-native"
import { defaults, icons } from "../../lib/styles"
import { colors } from "../../lib/colors"
import { isIphoneX } from "react-native-iphone-x-helper"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import CloseButton from "../universal/CloseButton"
import FlatBackButton from "../universal/FlatBackButton"
import NavigatorService from "../../redux/navigator";
import SendButton from "./SendButton"
import Hits from "./Hits"
import SendLineItem from "./SendLineItem"
import NextButton from "../universal/NextButton";
import { algoliaKeys } from '../../../env/keys.json'
import { InstantSearch } from 'react-instantsearch/native';
import SearchBox from "./SearchBox"
import api from "../../api"

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class SendTo extends Component {

	constructor(props) {
		super(props)
		this.state = {
			value: "",
			sendCurrency: props.sendCurrency,
			sendAmount: props.sendAmount,
			capturedQr: false,
			pastedAddress: false,
			selectedId: null,
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.address != this.props.address) {
			this.setState({
				value: nextProps.address, 
				capturedQr: nextProps.capturedQr,
				sendCurrency: nextProps.sendCurrency,
				sendAmount: nextProps.sendAmount,
			})
		}
		else if (nextProps.sendCurrency != this.props.sendCurrency || nextProps.sendAmount != this.props.sendAmount) {
			this.setState({
				value: nextProps.address, 
				capturedQr: nextProps.capturedQr,
				sendCurrency: nextProps.sendCurrency,
				sendAmount: nextProps.sendAmount,
			})
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.value != this.state.value) {
			return true
		}
		else {
			return false
		}
	}

	componentWillMount() {
		this.yOffset = new Animated.Value(0)
	}

	render() {

		const {
			sendCurrency,
			sendAmount,
			sendTo,
			userSplashtag,
		} = this.props

		const animatedHeader = {
			transform: [
				{translateY: this.yOffset.interpolate({
					inputRange: [-1, 0, 140, 141],
					outputRange: [0, 0, -140, -140]
				})}
			]
		}

		const animatedSendButtons = {
			opacity: this.yOffset.interpolate({
				inputRange: [-1, 0, 140, 141],
				outputRange: [1, 1, 0, 0]
			})
		}

		return (
			<View style={styles.wrapper}>

				<CloseButton color="primary" onPress={() => {
					Keyboard.dismiss()
					this.props.screenProps.rootNavigation.goBack(null)
				}}/>
				<FlatBackButton color="purple" onPress={() => {
					Keyboard.dismiss()
					this.props.navigation.goBack(null)
				}}/>

				<View style={styles.header} pointerEvents="none">
					<Text style={styles.title}>Sending Bitcoin</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionLabel}>AMOUNT</Text>
					<Text style={styles.amount}>{sendCurrency} {sendCurrency == "USD" && "$"}{sendAmount}{sendCurrency == "BTC"}</Text>
				</View>

				<InstantSearch {...algoliaKeys}>

					{(!this.state.pastedAddress && !this.state.capturedQr) && <View style={styles.section}>
						<Text style={styles.sectionLabel}>ADDRESS OR SPLASHTAG</Text>
						<SearchBox onChange={value => {
							this.setState({value})
						}}/>
					</View>}

					{(this.state.pastedAddress || this.state.capturedQr) && <View style={styles.section}>
						<Text style={styles.sectionLabel}>ADDRESS</Text>
						<View style={styles.inputWrapper}>
							<TextInput
								onChangeText={value => {
									this.setState({value: "", pastedAddress: false, capturedQr: false})
								}}
							    value={this.state.value}
								style={styles.input}/>
				        </View>
					</View>}

					<Animated.View style={[styles.sendButtons, animatedSendButtons]}>
						<SendButton
							image={icons.copyPaste} 
							title={"Paste\naddress"}
							onPress={() => {
								console.log("trying to paste")
								Clipboard.getString().then(address => {
									if (api.IsValidAddress(address, this.props.bitcoinNetwork)) {
										this.setState({value: address, pastedAddress: true})
									} else {
										Alert.alert("Invalid bitcoin address")
									}
								}).catch(error => {
									Alert.alert("Could not get copied address")
								})
							}}/>
						<SendButton 
							image={icons.qrIcon} 
							title={"Scan\nQR-Code"}
							onPress={() => {
								this.props.screenProps.rootNavigation.navigate("ScanQrCode")
							}}/>
					</Animated.View>

					{this.state.capturedQr && <View style={styles.section}>
						<Text style={styles.sectionLabel}>CAPTURED QR CODE</Text>
						<SendLineItem
							selected={true}
							title="A bitcoin wallet"
							subtitle="Valid Address"
							address={this.state.value}
							circleText="B"
							extraContent="From QR-Code Scan"/>
					</View>}

					{this.state.pastedAddress && <View style={styles.section}>
						<Text style={styles.sectionLabel}>SENDING TO</Text>
						<SendLineItem
							selected={true}
							title="A bitcoin wallet"
							subtitle="Valid Address"
							address={this.state.value}
							circleText="B"
							extraContent="From pasted address"/>
					</View>}

					{(!this.state.pastedAddress && !this.state.capturedQr) && <View style={styles.section}>
						<Text style={styles.sectionLabel}>YOUR CONTACTS</Text>
					</View>}

					{(!this.state.pastedAddress && !this.state.capturedQr && this.state.value != "") && <View style={styles.hits}>
						<Hits userSplashtag={userSplashtag} callback={() => {
							// user selected contact from algolia query
						}}/>
					</View>}

				</InstantSearch>

				<NextButton
					title="Preview Send"
					disabled={!(this.state.pastedAddress || this.state.capturedQr || this.state.selectedId)}
					onPress={() => {
						Alert.alert("send modal")
					}}/>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		paddingTop: isIphoneX() ? 60 : 40,
		backgroundColor: colors.white,
		flexDirection: "column",
		paddingBottom: isIphoneX() ? 40 : 20,
	},
	headerImage: {
		position: "absolute",
		width: SCREEN_WIDTH,
		height: 300,
		top: (isIphoneX()) ? -10 : -30,
	},
	header: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10
	},
	title: {
		color: colors.darkGray,
		fontSize: 24,
		fontWeight: "600",
		marginBottom: 4
	},
	section: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		// backgroundColor: colors.primary
	},
	sectionLabel: {
		color: colors.gray,
		fontSize: 18,
		fontWeight: "500",
		letterSpacing: 1,
		marginBottom: 2
	},
	hits: {
		// backgroundColor: colors.gray,
		minHeight: 400,
	},
	amount: {
		color: colors.darkGray,
		fontSize: 20,
		fontWeight: "700",
	},
	input: {
		padding: 20,
		fontSize: 20,
		fontWeight: "500",
		color: colors.gray,
	},
	inputWrapper: {
		shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        marginTop: 5,
        marginBottom: 15,
        borderRadius: 5,
        // paddingLeft: 50,
        backgroundColor: colors.white
	},
	sendButtons: {
		paddingBottom: 20,
		paddingHorizontal: 25,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: SCREEN_WIDTH,
	},
	scrollContainer: {
		position: "relative",
		// minHeight: SCREEN_HEIGHT,
	},
})

export default SendTo