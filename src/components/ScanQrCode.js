import React, { Component } from "react"
import {
	View,
	Text,
	Image,
	Dimensions,
	StyleSheet,
	Alert
} from "react-native"
import { colors } from "../lib/colors"
import { defaults, icons } from "../lib/styles"
import { isIphoneX } from "react-native-iphone-x-helper"
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import { captureQr } from "../redux/transactions/actions"
import QRCodeScanner from 'react-native-qrcode-scanner'
import CloseButton from "./universal/CloseButton"
import Button from "./universal/Button"

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class ScanQrCode extends Component {
	render() {
		return (
			<QRCodeScanner
				ref={(node) => { this.scanner = node }}
				onRead={e => {
					try {
						const network = (this.props.network == 'testnet') ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
						bitcoin.address.toOutputScript(address, network)
						this.props.captureQr(e.data)
						this.props.navigation.goBack(null)
					}
					catch (error) {
						Alert.alert("Invalid bitcoin address", null, [
							{text: "Dismiss", onPress: () => {
								this.scanner.reactivate()
							}}
						])
					}
				}}
				containerStyle={styles.container}
				topContent={
					<View style={styles.top}>
						<Image source={icons.qrIcon} resizeMode="contain" style={styles.icon}/>
						<Text style={styles.title}>Scan QR code</Text>
						<CloseButton onPress={() => {
							this.props.navigation.goBack(null)
						}}/>
					</View>
				}
				bottomContent={
					<View style={styles.bottom}>
						<Button title="Cancel" onPress={() => {
							this.props.navigation.goBack(null)
						}}/>
					</View>
				}/>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		height: SCREEN_HEIGHT,
		width: SCREEN_WIDTH,
		backgroundColor: colors.white
	},
	top: {
		flex: 1,
		width: SCREEN_WIDTH,
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center"
	},
	icon: {
		width: 40,
		height: 40,
		margin: 20,
	},
	title: {
		color: colors.white,
		fontSize: 24,
		fontWeight: "700"
	},
	bottom: {
		flex: 1,
		width: SCREEN_WIDTH,
		justifyContent: "center",
		padding: 20
	}
})

const mapStateToProps = state => {
	return {
		network: state.user.bitcoinNetwork
	}
}

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			captureQr
		},
		dispatch
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScanQrCode)