import React, { Component } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Animated,
	Dimensions
} from "react-native";
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import { isIphoneX } from "react-native-iphone-x-helper";
import Keypad from "../universal/Keypad";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import LinearGradient from "react-native-linear-gradient";

/*
Page where you set passcode for securing Wallet
*/

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class SetPasscode extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: "",
			confirmValue: null
		};
		this.onChangeText = this.onChangeText.bind(this);
		this.close = this.close.bind(this);
		this.shakeAnimation = new Animated.Value(0);
	}

	onChangeText(char) {
		if (this.state.value.length < 4 && char != "delete") {
			const newValue = this.state.value + char;
			this.setState({ value: newValue });
			ReactNativeHapticFeedback.trigger("impactLight", true);

			if (newValue.length == 4 && !this.state.confirmValue) {
				setTimeout(() => this.setState({ confirmValue: newValue, value: "" }), 150);
			} else if (newValue.length == 4 && newValue == this.state.confirmValue) {
				setTimeout(() => this.props.navigation.state.params.successCallback(newValue), 100);
			} else if (newValue.length == 4 && newValue != this.state.confirmValue) {
				Animated.spring(this.shakeAnimation, {
					toValue: 1,
					useNativeDriver: true
				}).start(() => {
					this.shakeAnimation.setValue(0);
					this.setState({ value: "", confirmValue: null });
				});
				ReactNativeHapticFeedback.trigger("impactHeavy", true);
			}
		} else if (char == "delete") {
			this.setState({ value: this.state.value.slice(0, -1) });
		}
	}

	close() {
		this.props.navigation.goBack();
		this.setState({
			value: "",
			confirmValue: null
		});
	}

	render() {
		const dropIcon = index =>
			this.state.value.length >= index ? (
				<Image source={icons["whiteDrop"]} style={styles.drop} resizeMode={"contain"} />
			) : (
				<Image source={icons["purpleDrop"]} style={styles.drop} resizeMode={"contain"} />
			);
		const shakeTransform = {
			transform: [
				{
					translateX: this.shakeAnimation.interpolate({
						inputRange: [0, 0.25, 0.5, 0.75, 1],
						outputRange: [0, 40, 0, -40, 0]
					})
				}
			]
		};

		return (
			<LinearGradient colors={["#5759D5", "#4E50E6"]} style={styles.container}>
				<View>
					<TouchableOpacity style={styles.closeButton} onPress={this.close}>
						<Image style={styles.closeIcon} source={require("../../assets/icons/Xbutton.png")} />
					</TouchableOpacity>
					{!this.state.confirmValue && (
						<View>
							<Text style={styles.title}>Type your new passcode</Text>
							<Text style={styles.subtitle}>Splash will lock when you leave</Text>
							<Text style={[styles.subtitle, { marginBottom: 49 }]}>for more than 5 minutes.</Text>
						</View>
					)}
					{this.state.confirmValue && (
						<Text style={[styles.title, { marginBottom: 88 }]}>Confirm your passcode</Text>
					)}
					<Animated.View style={[styles.drops, shakeTransform]}>
						{dropIcon(1)}
						{dropIcon(2)}
						{dropIcon(3)}
						{dropIcon(4)}
					</Animated.View>
				</View>
				<Keypad
					primaryColor={"#484AD4"}
					pressColor={"#6466F6"}
					textColor={"white"}
					onChange={char => this.onChangeText(char)}
					disabled={this.state.value.length >= 4 ? true : false}
					decimal={false}
					delete={true}
					arrow={"white"}
				/>
				{/*<TouchableOpacity onPress={() => console.log('forgot')}>
					<Text style={styles.forgotText}>Forgot?</Text>
				</TouchableOpacity>*/}
			</LinearGradient>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignContent: "center",
		flexDirection: "column",
		paddingVertical: isIphoneX() ? 50 : 30,
		justifyContent: "space-between"
	},
	closeButton: {
		paddingHorizontal: 43,
		alignSelf: "flex-end"
	},
	closeIcon: {
		height: 20,
		width: 20
	},
	title: {
		paddingTop: 20,
		paddingBottom: 20,
		fontSize: 20,
		fontWeight: "600",
		color: colors.white,
		alignSelf: "center"
	},
	subtitle: {
		fontSize: 16,
		color: "#A4A5F6",
		alignSelf: "center"
	},
	drops: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 105,
		width: SCREEN_WIDTH,
		paddingBottom: 40
	},
	drop: {
		height: 15,
		width: 12
	},
	forgotText: {
		fontSize: 14,
		color: colors.white,
		paddingTop: 38,
		alignSelf: "center"
	}
});

export default SetPasscode;
