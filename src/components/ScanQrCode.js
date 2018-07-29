import React, { Component } from "react"
import {
	View,
	Text,
	Image,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	Animated,
	Alert
} from "react-native"
import { colors } from "../lib/colors"
import { defaults, icons } from "../lib/styles"
import { isIphoneX } from "react-native-iphone-x-helper"
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import { captureQr } from "../redux/payFlow"
import QRCodeScanner from 'react-native-qrcode-scanner'
import CloseButton from "./universal/CloseButton"
import Button from "./universal/Button"

import api from '../api'

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class ScanQrCode extends Component {
	constructor(props) {
	  super(props);
	  this.animation = new Animated.Value(0)	
	}

	componentDidMount() {
		Animated.sequence([
			Animated.delay(2000),
			Animated.spring(this.animation, {
				toValue: 1,
				friction: 20,
				useNativeDriver: true,
			})
		]).start()
	}

	render() {

		const boxTransform = () => {
			return {
				transform: [
					{
						scale: this.animation.interpolate({
							inputRange: [0, 1],
							outputRange: [0, 1]
						})
					}
				]
			}
		}

		return (
			<QRCodeScanner
				ref={(node) => { this.scanner = node }}
				onRead={e => {
					const address = (e.data.slice(0,8) == 'bitcoin:') ? e.data.slice(8) : e.data
					if (api.IsValidAddress(address, this.props.network)) {
						this.props.captureQr(address)
						this.props.navigation.goBack(null)
					} else {
						Alert.alert("Invalid bitcoin address", null, [
							{text: "Dismiss", onPress: () => {
								this.scanner.reactivate()
							}}
						])
					}
				}}
				cameraStyle={styles.camera}
				containerStyle={{backgroundColor: colors.white}}
				bottomViewStyle={{position: 'absolute'}}
				bottomContent={
					<View>
						<View style={{overflow: 'hidden', width: SCREEN_WIDTH}}>
							<Image
							source={require("../assets/images/headerWave.png")}
							resizeMode="contain"
							style={styles.headerImage}/>
						</View>
						<View style={styles.topContent}>
							<Text style={styles.title}>Point at QR Code</Text>
							<Image source={icons.qrIcon} style={styles.qrIcon} resizeMode={'contain'}/>
						</View>
						<Animated.View style={[styles.box, boxTransform()]}>
							<View>
								<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
									<View style={styles.horizontalRect}/>
									<View style={styles.horizontalRect}/>
								</View>
								<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
									<View style={styles.verticalRect}/>
									<View style={styles.verticalRect}/>
								</View>
							</View>
							<View>
								<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
									<View style={styles.verticalRect}/>
									<View style={styles.verticalRect}/>
								</View>
								<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
									<View style={styles.horizontalRect}/>
									<View style={styles.horizontalRect}/>
								</View>
							</View>
						</Animated.View>
						<TouchableOpacity style={styles.button} onPress={() => this.props.navigation.goBack(null)}>
							<Image source={icons.crossPrimary} style={styles.closeIcon} resizeMode={'contain'}/>
						</TouchableOpacity>
					</View>
				}
				/>
		)
	}
}

const styles = StyleSheet.create({
	camera: {
		height: SCREEN_HEIGHT,
	},
	headerImage: {
		top: (isIphoneX()) ? -285 : -305,
		width: SCREEN_WIDTH,
		shadowOffset: {
			width: 0,
			height: 5
		},
		shadowOpacity: 0.12,
		shadowRadius: 12,
		overflow: "hidden",
	},
	topContent: {
		opacity: 0.75,
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'center',
		position: 'absolute',
		top:(isIphoneX()) ? 65 : 45,
	},
	title: {
		fontSize: 25,
		color: colors.white,
		paddingRight: 15,
	},
	qrIcon: {
		height: 30,
		width: 30,
	},
	box: {
		top: (isIphoneX()) ? -275 : -325,
		height: 270,
		width: 270,
		justifyContent: 'space-between',
		alignSelf: 'center'
	},	
	horizontalRect: {
		height: 12,
		width: 50,
		backgroundColor: colors.white,
	},
	verticalRect: {
		height: 38,
		width: 12,
		backgroundColor: colors.white,
	},
	button: {
		height: 98,
		width: 98,
		borderRadius: 49,
		top: (isIphoneX()) ? SCREEN_HEIGHT-975 : SCREEN_HEIGHT-975,
		backgroundColor: colors.white,
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center'
	},
	closeIcon: {
		height: 25,
		width: 25,
	},
})

const mapStateToProps = state => {
	return {
		network: state.crypto.wallets.BTC.network
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