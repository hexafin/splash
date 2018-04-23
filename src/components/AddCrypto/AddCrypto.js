import React, { Component } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	Clipboard,
	TouchableWithoutFeedback
} from "react-native";
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import FCM, { FCMEvent } from "react-native-fcm";
import FlatBackButton from "../universal/FlatBackButton"

class AddCrypto extends Component {

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

		FCM.on(FCMEvent.Notification, async notif => {
			console.log("Notification", notif);
			// reload on notifications
			const {
				transactionId,
				relativeAmount,
				domain,
				relativeCurrency
			} = notif;
			if (transactionId && relativeAmount && domain && relativeCurrency) {
				this.props.navigation.navigate("ApproveModal", {
					transactionId,
					relativeAmount,
					domain,
					relativeCurrency
				});
			}
		});
	}

	handleCopy() {
		this.setState(prevState => {
			return {
				...prevState,
				isCopying: true
			}
		})
		
		Clipboard.setString(this.props.address)

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
		const { address } = this.props

		const qrCode = "https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl="+address

		return (
			<View style={styles.container}>
				<Image source={require("../../assets/images/header.png")} resizeMode="cover" style={styles.headerImage}/>
				<View style={styles.header}>
					<FlatBackButton color="white" onPress={() => {
						this.props.navigation.goBack()
					}}/>
					<Text style={styles.title}>Your splash wallet</Text>
				</View>
				<View style={styles.logoWrapper}>
					<View style={styles.logoCircle}>
						<Image source={icons.primarySplash} style={styles.logo}/>
					</View>
				</View>
				<View style={styles.body}>
					<View style={styles.bodyTitleWrapper}>
						<Text style={styles.bodyTitle}>Add some Bitcoin</Text>
					</View>
					<Image source={{uri: qrCode}} style={styles.qr}/>
					<TouchableWithoutFeedback onPress={this.handleCopy}>
						<View style={styles.addressCopyWrapper}>
							<View style={styles.addressWrapper}>
								<Text style={styles.addressText}>{address}</Text>
							</View>
							<Text style={styles.addressCopyText}>
								{this.state.isCopying && "Copied!"}
								{!this.state.isCopying && "Tap to copy"}
							</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		...defaults.container
	},
	header: {
		height: 150,
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 50,
		paddingTop: 30
	},
	title: {
		color: colors.white,
		fontSize: 24,
		fontWeight: "700"
	},
	headerImage: {
		position: "absolute",
		width: 400,
		height: 300,
		top: -120
	},
	logoWrapper: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 140,
		justifyContent: "center",
		alignItems: "center"
	},
	logoCircle: {
		width: 60,
		height: 60,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.white,
		borderRadius: 30,
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.1,
		shadowRadius: 12,
	},
	logo: {
		width: 29,
		height: 38,
	},
	body: {
		flex: 1,
		padding: 20,
		flexDirection: "column",
		alignItems: "center"
	},
	bodyTitleWrapper: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "flex-start"
	},
	bodyTitle: {
		color: colors.primaryDarkText,
		fontSize: 18,
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

export default AddCrypto;