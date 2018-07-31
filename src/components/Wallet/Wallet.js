import React, { Component } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	Share,
	ScrollView,
	Animated,
	Clipboard,
	TouchableWithoutFeedback,
	Dimensions
} from "react-native";
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import FlatBackButton from "../universal/FlatBackButton"
import Button from "../universal/Button"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class Wallet extends Component {

	constructor(props) {
		super(props)
		this.state = {
			isCopying: false
		}
		this.handleCopy = this.handleCopy.bind(this)
	}

	componentWillMount() {
        if (!this.props.loggedIn) {
            this.props.navigation.navigate("Landing");
        }
        this.animatedAddressCopy = new Animated.Value(1)
	}

	handleCopy() {
		this.setState(prevState => {
			return {
				...prevState,
				isCopying: true
			}
		})
		
		Clipboard.setString(this.props.address)
		ReactNativeHapticFeedback.trigger("impactLight", true)

		setTimeout(() => {
			this.setState(prevState => {
				return {
					...prevState,
					isCopying: false
				}
			})
		}, 1000)
	}

	render() {
		const { address, splashtag } = this.props

		const qrCode = "https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl="+address

		return (
			<View style={styles.container}>
				<ScrollView>
					<View style={styles.header}>
						<Text style={styles.title}>Your splash wallet</Text>
					</View>
					<View style={styles.body}>
						<View style={styles.bodyTitleWrapper}>
							<Text style={styles.bodyTitle}>Receive bitcoin here</Text>
						</View>
						<TouchableWithoutFeedback
							onPress={this.handleCopy}
							onPressIn={() => {
								Animated.spring(this.animatedAddressCopy, {
									toValue: .8
								}).start()
							}}
							onPressOut={() => {
								Animated.spring(this.animatedAddressCopy, {
									toValue: 1,
									friction: 3,
									tension: 40
								}).start()
							}}>
							<Animated.View style={[styles.addressCopyWrapper, {
								transform: [{scale: this.animatedAddressCopy}]
							}]}>
								<Image source={{uri: qrCode}} style={styles.qr}/>
								<View style={styles.addressWrapper}>
									<Text style={styles.addressText}>{address}</Text>
								</View>
								<Text style={styles.addressCopyText}>
									{this.state.isCopying && "Copied!"}
									{!this.state.isCopying && "Tap to copy"}
								</Text>
							</Animated.View>
						</TouchableWithoutFeedback>
						<Button small title="Share" onPress={() => {
							Share.share({
								title: `@${splashtag} bitcoin wallet`,
								message: address
							})
						}} style={{
							marginTop: 30,
							width: 200
						}}/>
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		...defaults.container,
		backgroundColor: "transparent"
	},
	header: {
		height: 150,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 40,
		paddingTop: 60
	},
	title: {
		color: colors.white,
		fontSize: 24,
		fontWeight: "700"
	},
	body: {
		flex: 1,
		padding: 20,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "flex-start",
	},
	bodyTitleWrapper: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "flex-start",
		marginBottom: 10
	},
	bodyTitle: {
		color: colors.primaryDarkText,
		fontSize: 20,
		fontWeight: "700",
		textAlign: "left"
	},
	qr: {
		width: 240,
		height: 240,
		padding: 40
	},
	addressCopyWrapper: {
		flexDirection: "column",
		alignItems: "center",
	},
	addressWrapper: {
		backgroundColor: colors.primaryLight,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 6,
		paddingBottom: 6,
		borderRadius: 3,
		marginBottom: 10
	},
	addressText: {
		color: colors.primary,
		fontSize: 14,
		fontWeight: "700"
	},
	addressCopyText: {
		fontSize: 14,
		fontWeight: "600",
		color: colors.lightGray
	}
});

export default Wallet;