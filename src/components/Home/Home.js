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
	Share,
	Dimensions
} from "react-native";
import { colors } from "../../lib/colors";
import { defaults, icons } from "../../lib/styles";
import api, { Errors } from '../../api'
import { isIphoneX } from "react-native-iphone-x-helper"
import LoadingCircle from "../universal/LoadingCircle"
import History from "./History"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import StartPayButton from "./StartPayButton"

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height


class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isLoadingTransactions || nextProps.isLoadingBalance || nextProps.isLoadingExchangeRates) {
			this.setState({loading: true})
		}
		else {
			this.setState({loading: false})
		}

		if ((nextProps.errorLoadingTransactions == Errors.NETWORK_ERROR && nextProps.errorLoadingTransactions != this.props.errorLoadingTransactions)
			|| (nextProps.errorLoadingBalance == Errors.NETWORK_ERROR && nextProps.errorLoadingBalance != this.props.errorLoadingBalance)
			|| (nextProps.errorLoadingExchangeRates == Errors.NETWORK_ERROR && nextProps.errorLoadingExchangeRates != this.props.errorLoadingExchangeRates)) {
			this.props.showTimeoutModal()
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.loading != this.state.loading) {
			return true
		}
		else {
			return false
		}
	}

	componentWillMount() {

        this.animatedPayScale = new Animated.Value(1)
	}

	componentDidMount() {
		this.props.yOffset.addListener(data => {
			const currentY = data.value
			if (currentY < -80 && !this.state.loading) {
				this.setState({loading: true})
				this.props.LoadBalance("BTC")
				this.props.LoadExchangeRates("BTC")
				this.props.LoadTransactions()
				ReactNativeHapticFeedback.trigger("impactHeavy", true)
			}
		})
	}

	componentWillUnmount() {
		this.props.yOffset.removeAllListeners()
	}

	render() {

		const animatedPayButton = {
			transform: [
				{scale: this.animatedPayScale}
			]
		}

		return (
			<View style={styles.wrapper}>
				<Animated.ScrollView
					scrollEventThrottle={16}
					contentContainerStyle={styles.scrollContainer}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: this.props.yOffset } } }],
						{
							useNativeDriver: true
						}
					)}>
					<History/>
				</Animated.ScrollView>

				<StartPayButton onPress={() => {
					ReactNativeHapticFeedback.trigger("impactLight", true);
					this.props.navigation.navigate("PayFlow");
				}}/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
		// flex: 1,
		// backgroundColor: colors.red,
	},
	scrollContainer: {
		position: "relative",
		paddingTop: isIphoneX() ? 210 : 190,
		minHeight: SCREEN_HEIGHT,
		// backgroundColor: colors.red
	},
});

export default Home;
