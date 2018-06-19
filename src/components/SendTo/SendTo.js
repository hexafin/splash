import React, {Component} from "react"
import {
	Animated,
	Dimensions,
	TouchableWithoutFeedback,
	View,
	StyleSheet,
	Image
} from "react-native"
import { defaults, icons } from "../../lib/styles"
import { colors } from "../../lib/colors"
import { isIphoneX } from "react-native-iphone-x-helper"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import CloseButton from "../universal/CloseButton"
import NavigatorService from "../../redux/navigator";

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

class SendTo extends Component {

	render() {
		console.log(this.props)
		return (
			<View style={styles.wrapper}>
				<CloseButton color="primary" onPress={() => {
					this.props.screenProps.rootNavigation.goBack(null)
				}}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		backgroundColor: colors.white,
	}
})

export default SendTo