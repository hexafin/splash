import React, { Component } from "react";
import {
	Animated,
	Dimensions,
	TouchableWithoutFeedback,
	View,
	StyleSheet,
	Image
} from "react-native";
import { defaults, icons } from "../../lib/styles";
import { colors } from "../../lib/colors";
import { isIphoneX } from "react-native-iphone-x-helper";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Keypad from "../universal/Keypad";
import CloseButton from "../universal/CloseButton";
import NavigatorService from "../../redux/navigator";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class EnterAmount extends Component {
	constructor(props) {
		super(props)
		this.state = {
			amount: ""
		}
	}
	render() {
		const btcBalance = this.props.balance.BTC
		const balance = {
			BTC: btcBalance,
			USD: btcBalance * (this.props.exchangeRates.BTC ? this.props.exchangeRates.BTC.USD : 0)
		}
		return (
			<View style={styles.wrapper}>

				<View style={styles.header}>
					<View style={styles.headerRow}>
						<View style={styles.title}>Sending {this.props.activeCurrency}</View>
						<Image source={icons.arrow[direction]} style={styles.arrow} resizeMode="contain"/>
					</View>
					<Text style={styles.balance}>Balance: {balance[this.props.activeCurrency]} {this.props.activeCurrency}</Text>
				</View>

				<Keypad
					primaryColor={"#EEEEFC"}
					pressColor={"#6466F6"}
					textColor={"#3F41FA"}
					onChange={text => this.setState({amount: text})}
					decimal={true}
					arrow={"purple"}
				/>

				<CloseButton
					color="primary"
					onPress={() => {
						this.props.screenProps.rootNavigation.goBack(null);
					}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		paddingTop: isIphoneX() ? 140 : 120,
		backgroundColor: colors.white
	},
	header: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		color: colors.darkGray,
		fontSize: 16,

	},
	balance: {
		color: colors.gray,
		fontSize: 14,
	},
	arrow: {
		width: 40,
		height: 20
	}
});

export default EnterAmount;
