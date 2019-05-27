import React, { Component } from "react";
import {
	View,
	Text,
	ScrollView,
	Animated,
	StyleSheet,
	Image,
	TouchableWithoutFeedback,
	TouchableOpacity,
	Linking,
	Alert,
	Clipboard,
	Share,
	Dimensions,
	TextInput
} from "react-native";
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { isIphoneX } from "react-native-iphone-x-helper";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

/*
Button in the SwipeApp that navigates you back to the center screen
<ReturnToHome
	yOffsets={array of animated values for page y offsets}
	xOffset={animated value for swiped x offset}
	onPress={function called on press}
/>
*/
export class ReturnToHome extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}

	render() {
		const translateY = this.props.xOffset.interpolate({
			inputRange: [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
			outputRange: [-30, 0, -30]
		});

		const opacity = this.props.xOffset.interpolate({
			inputRange: [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
			outputRange: [1, 0, 1]
		});

		const rotate = this.props.xOffset.interpolate({
			inputRange: [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
			outputRange: ["180deg", "90deg", "0deg"]
		});

		const translateX = this.props.xOffset.interpolate({
			inputRange: [0, SCREEN_WIDTH, SCREEN_WIDTH * 2],
			outputRange: [SCREEN_WIDTH * 0.4, 0, -0.4 * SCREEN_WIDTH]
		});

		const animatedView = {
			transform: [{ translateX }, { translateY }, { rotate }],
			opacity: opacity
		};

		return (
			<TouchableWithoutFeedback onPress={this.props.onPress}>
				<Animated.View style={[animatedView, styles.wrapper]}>
					<Image
						source={require("../../assets/icons/leftCarrotWhite.png")}
						style={styles.image}
						resizeMode="contain"
					/>
				</Animated.View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		position: "absolute",
		alignSelf: "center",
		top: isIphoneX() ? 70 : 50,
		padding: 20
		// backgroundColor: colors.red,
	},
	image: {
		width: 14,
		height: 28
	}
});

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({}, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ReturnToHome);
