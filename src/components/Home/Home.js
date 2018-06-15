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
import api from '../../api'
import { isIphoneX } from "react-native-iphone-x-helper"
import { Sentry } from "react-native-sentry";
import LoadingCircle from "../universal/LoadingCircle"
import PayFlow from "./PayFlow"
import History from "./History"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height


class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isLoadingTransactions || nextProps.isLoadingBalance || nextProps.isLoadingExchangeRates) {
			this.setState({loading: true})
		}
		else {
			this.setState({loading: false})
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false
	}

	componentWillMount() {
        if (!this.props.loggedIn) {
            this.props.navigation.navigate("Landing")
        }
	}

	render() {

		console.log("home render")

		return (
			<View style={styles.wrapper}>
				<Animated.ScrollView
					scrollEventThrottle={16}
					contentContainerStyle={styles.scrollContainer}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: this.props.yOffset } } }],
						{
							listener: event => {
								const currentY = event.nativeEvent.contentOffset.y

								if (currentY < -80 && !this.state.loading) {
									this.setState({loading: true})
									this.props.LoadBalance("BTC")
									this.props.LoadExchangeRates("BTC")
									this.props.LoadTransactions()
									ReactNativeHapticFeedback.trigger("impactHeavy", true)
								}
							},
							useNativeDriver: true
						}
					)}>
					<View style={styles.container}>
						<PayFlow/>
						<View style={{flex: 1, minHeight: 800}}>
							<History/>
						</View>
					</View>
				</Animated.ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1
	},
	scrollContainer: {
		position: "relative",
		overflow: "hidden",
		paddingTop: 210
	},
	container: {
		position: "relative",
		overflow: "hidden"
	},
});

export default Home;
