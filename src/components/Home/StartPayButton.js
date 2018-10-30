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

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

class StartPayButton extends Component {
	componentWillMount() {
		this.animatedScale = new Animated.Value(1);
	}

	render() {
		const animatedPayScale = {
			transform: [{ scale: this.animatedScale }]
		};

		return (
			<Animated.View
				style={[styles.payButtonWrapper, animatedPayScale]}
				pointerEvents="box-none">
				<TouchableWithoutFeedback
					onPress={this.props.onPress}>
					<View style={styles.payButton}>
						<Image
							style={styles.payButtonIcon}
							source={icons.startPay}
							resizeMode="contain"
						/>
					</View>
				</TouchableWithoutFeedback>
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	payButtonWrapper: {
		position: "absolute",
		bottom: isIphoneX() ? 40 : 20,
		width: SCREEN_WIDTH,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	payButton: {
		width: 70,
		height: 70,
		borderRadius: 35,
		shadowOffset: {
			width: 0,
			height: 10
		},
		shadowOpacity: 0.1,
		shadowRadius: 24,
		justifyContent: "center",
		alignItems: "center",
		overflow: "visible"
	},
	payButtonIcon: {
		width: 30,
		height: 30
	}
});

export default StartPayButton;
