import React, { Component } from "react";
import { Animated, View, Text, TouchableWithoutFeedback, Image, StyleSheet } from "react-native";
import { colors } from "../../lib/colors";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

/*
Button in SendTo page with option for finding recipient
<SendButton
	image={image}
	title={text}
	onPress={function}
/>
*/

class SendButton extends Component {
	componentWillMount() {
		this.scale = new Animated.Value(1);
	}
	render() {
		return (
			<TouchableWithoutFeedback
				onPressIn={() => {
					ReactNativeHapticFeedback.trigger("impactLight", true);
					Animated.spring(this.scale, {
						toValue: 0.8
					}).start();
				}}
				onPressOut={() => {
					ReactNativeHapticFeedback.trigger("impactLight", true);
					Animated.spring(this.scale, {
						toValue: 1.0
					}).start();
				}}
				onPress={this.props.onPress}
			>
				<Animated.View
					style={[
						styles.wrapper,
						{
							transform: [{ scale: this.scale }]
						}
					]}
				>
					<Image source={this.props.image} style={styles.image} resizeMode="contain" />
					<Text style={styles.title}>{this.props.title}</Text>
				</Animated.View>
			</TouchableWithoutFeedback>
		);
	}
}

export default SendButton;

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: 150,
		height: 65,
		borderRadius: 3,
		backgroundColor: colors.primaryLight2,
		shadowOffset: {
			width: 0,
			height: 10
		},
		shadowOpacity: 0.1,
		shadowColor: colors.shadowPrimary,
		shadowRadius: 12
	},
	image: {
		width: 25,
		height: 25,
		marginRight: 15
	},
	title: {
		color: colors.white,
		// opacity: 0.9,
		fontSize: 16,
		textAlign: "left",
		fontWeight: "600"
	}
});
