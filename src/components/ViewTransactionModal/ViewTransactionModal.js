import React, { Component } from "react"
import {
	Animated,
	Easing,
	View,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	StyleSheet,
	Image
} from "react-native";
import { colors } from "../../lib/colors"
import LoadingCircle from "../universal/LoadingCircle"
import LetterCircle from "../universal/LetterCircle"
import Button from "../universal/Button"

class ViewTransactionModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			backgroundOpacity: new Animated.Value(0.0)
		};
	}

	componentDidMount() {
		Animated.sequence([
			Animated.delay(300),
			Animated.timing(this.state.backgroundOpacity, {
				toValue: 1,
				easing: Easing.linear(),
				duration: 200
			})
		]).start();
	}

	render() {

		const dismiss = () => {
			Animated.timing(this.state.backgroundOpacity, {
				toValue: 0,
				duration: 200,
				easing: Easing.linear()
			}).start(({ finished }) => {
				if (finished) {
					this.props.navigation.goBack();
				}
			});
		};

		return (
			<Animated.View
				style={[styles.container, {
						backgroundColor: this.state.backgroundOpacity.interpolate(
							{inputRange: [0, 1], outputRange: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.2)"]}
						)
					}
				]}
			/>
		);
	}
}

export default ViewTransactionModal;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0)",
		justifyContent: "flex-end"
	}
});
