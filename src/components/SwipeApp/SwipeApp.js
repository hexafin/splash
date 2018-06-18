import React, { Component } from "react"
import {
	Dimensions,
	ScrollView,
	Image,
	View,
	Text,
	Keyboard,
	Animated,
	StyleSheet,
	TouchableWithoutFeedback
} from "react-native"
import firebase from "react-native-firebase"
import { colors } from "../../lib/colors"
import { defaults, icons } from "../../lib/styles"
import { isIphoneX } from "react-native-iphone-x-helper"
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import { LoadExchangeRates, LoadBalance } from "../../redux/crypto/actions"
import PropTypes from "prop-types"
import Account from "../Account"
import Wallet from "../Wallet"
import Home from "../Home"
import Balance from "./Balance"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

const xOffset = new Animated.Value(0)
const yOffsets = {
	home: new Animated.Value(0)
}
const _onScroll = Animated.event(
	[{ nativeEvent: { contentOffset: { x: xOffset } } }],
	{
		listener: event => {
			Keyboard.dismiss()
		},
		useNativeDriver: true
	}
)

function Page(props: { children?: ReactElement<*> }) {
	return (
		<View style={{ flex: 1, width: SCREEN_WIDTH }}>
			{props.children}
		</View>
	)
}

function iconTransform(index: number) {
	return {
		transform: [
			{
				scale: xOffset.interpolate({
					inputRange: [
						(index - 1) * SCREEN_WIDTH,
						index * SCREEN_WIDTH,
						(index + 1) * SCREEN_WIDTH
					],
					outputRange: [0.75, 1, 0.75]
				})
			},
			{
				translateX: xOffset.interpolate({
					inputRange: [
						(index - 1) * SCREEN_WIDTH,
						index * SCREEN_WIDTH,
						(index + 1) * SCREEN_WIDTH
					],
					outputRange: [200, 0, -200]
				})
			}
		]
	}
}

function titleTransform(index: number) {
	return {
		transform: [
			{
				scale: xOffset.interpolate({
					inputRange: [
						(index - 1) * SCREEN_WIDTH,
						index * SCREEN_WIDTH,
						(index + 1) * SCREEN_WIDTH
					],
					outputRange: [0.75, 1, 0.75]
				})
			},
			{
				translateX: xOffset.interpolate({
					inputRange: [
						(index - 1) * SCREEN_WIDTH,
						index * SCREEN_WIDTH,
						(index + 1) * SCREEN_WIDTH
					],
					outputRange: [380, 0, -380]
				})
			}
		]
	}
}

const headerTranslateY = Animated.add(
	xOffset.interpolate({
		inputRange: [0, 1 * SCREEN_WIDTH, 2 * SCREEN_WIDTH],
		outputRange: [-20, 0, -20]
	}),
	Animated.multiply(
		xOffset.interpolate({
			inputRange: [0, 1 * SCREEN_WIDTH, 2 * SCREEN_WIDTH],
			outputRange: [0, 1, 0]
		}),
		yOffsets.home.interpolate({
			inputRange: [-41, -40, 0, 70, 71],
			outputRange: [40, 40, 0, -70, -70]
		})
	)
)

function headerTransform() {
	return {
		transform: [
			{
				translateY: headerTranslateY
			}
		]
	}
}

class SwipeApp extends Component {
	refScrollView = view => {
		if (view) {
			this.scrollView = view.getNode()
		}
	}

	constructor(props) {
		super(props)
		this.pages = [
			{
				name: "account",
				component: Account,
				image: icons.whiteSplash,
				title: `@${this.props.splashtag}`,
			},
			{
				name: "home",
				component: Home,
				image: null
			},
			{
				name: "wallet",
				component: Wallet,
				image: icons.qrIcon,
				title: "You splash wallet"
			}
		]
		this.pageIndices = {}
		for (let i = 0; i < this.pages.length; i++) {
			const page = this.pages[i]
			this.pageIndices[page.name] = i
		}
		this.goToPage = this.goToPage.bind(this)
		this.goToPageByIndex = this.goToPageByIndex.bind(this)
	}

	goToPage = (scrollView, pageName) => {
		try {
			const xOffset = SCREEN_WIDTH * this.pageIndices[pageName]
			scrollView.scrollTo({ x: xOffset, y: 0, animated: true })
		}
		catch (error) {
			console.log(error)
		}
	}

	goToPageByIndex = (scrollView, index) => {
		try {
			if (index >= 0 && index < this.pages.length) {
				// console.log(index)
				const xOffset = SCREEN_WIDTH * index
				scrollView.scrollTo({ x: xOffset, y: 0, animated: true })
			}
		}
		catch (error) {
			console.log(error)
		}
	}

	componentDidMount() {
		this.goToPageByIndex(this.scrollView, 1)
		// initialize swipe app to center page
		xOffset.setValue(SCREEN_WIDTH)

		// load
		this.props.LoadBalance()
		this.props.LoadExchangeRates()
		this.props.LoadTransactions()
	}

	componentWillUnmount() {
		xOffset.removeAllListeners()
	}

	render() {

		const Pages = []
		const Icons = []
		const Titles = []
		for (let i = 0; i < this.pages.length; i++) {
			const page = this.pages[i]
			Pages.push(
				<Page key={"page-" + i}>
					{React.createElement(page.component, {
						...this.props,
						yOffset: yOffsets[page.name]
					})}
				</Page>
			)
			Icons.push(
				<TouchableWithoutFeedback
					key={"page-icon-" + i}
					onPressIn={() => {
						ReactNativeHapticFeedback.trigger("impactLight", true)
						this.goToPageByIndex(this.scrollView, i)
					}}>
					<Animated.Image
						source={page.image}
						resizeMode="contain"
						style={[
							styles.icon,
							iconTransform(i),
							{
								height: (page.name == "wallet") ? 37 : 45,
								width: (page.name == "wallet") ? 37 : 45,
							},
							(page.name == "wallet") ? {top: isIphoneX() ? 59 : 39} : {}
						]}
					/>
				</TouchableWithoutFeedback>
			)
			if (page.title) {
				Titles.push(
					<Animated.View
						key={"swipe-app-title-"+i}
						style={[
							styles.title,
							titleTransform(i)
						]}
					>
						<Text style={styles.titleText}>{page.title}</Text>
					</Animated.View>
				)
			}
		}

		return (
			<View style={styles.container}>
				<Animated.ScrollView
					horizontal
					pagingEnabled
					// ref={ref => (this.tabBar = ref._component)}
					ref={this.refScrollView}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					automaticallyAdjustContentInsets={false}
					// onScrollBeginDrag={event => {
					// 	this.setState(prevState => {
					// 		return {
					// 			...prevState,
					// 			isScrolling: true
					// 		}
					// 	})
					// }}
					onMomentumScrollEnd={event => {
						try {
							const xOffset = event.nativeEvent.contentOffset.x
							const activePageName = this.pages[
								xOffset / SCREEN_WIDTH
							].name
						}
						catch (error) {
							console.log(error)
						}
					}}
					contentOffset={{
						x: SCREEN_WIDTH
					}}
					scrollEventThrottle={16}
					bounces={false}
					onScroll={_onScroll}
					style={{ flex: 1, flexDirection: "row" }}>
					{Pages}
				</Animated.ScrollView>

				<Animated.Image
					source={require("../../assets/images/headerWave.png")}
					resizeMode="contain"
					style={[headerTransform(), styles.headerImage]}/>
				<View style={styles.header}/>
				
				{Icons}

				{Titles}

				<Balance yOffsets={yOffsets} xOffset={xOffset}/>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.white,
		flex: 1
	},
	icon: {
		position: "absolute",
		top: isIphoneX() ? 55 : 35,
		alignSelf: "center",
		overflow: "visible",
		marginBottom: 15,
		paddingLeft: 20,
		paddingRight: 20,
		shadowOffset: {
			width: 0,
			height: 5
		},
		shadowOpacity: 0.12,
		shadowRadius: 12,
	},
	header: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: 60,
		backgroundColor: colors.primary
	},
	headerImage: {
		top: (isIphoneX()) ? -30 : -50,
		width: SCREEN_WIDTH,
		height: 240,
		position: "absolute",
		shadowOffset: {
			width: 0,
			height: 5
		},
		shadowOpacity: 0.12,
		shadowRadius: 12,
		overflow: "visible"
	},
	title: {
		position: "absolute",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: SCREEN_WIDTH,
		top: isIphoneX() ? 115 : 95
	},
	titleText: {
		fontSize: 24,
		color: colors.white,
		fontWeight: "700"
	}
})


const mapStateToProps = state => {
	return {
		splashtag: state.user.entity.splashtag,
    	transactions: state.transactions.transactions,
    	isLoadingTransactions: state.transactions.isLoadingTransactions,
    	errorLoadingTransactions: state.transactions.errorLoadingTransactions,
        exchangeRates: state.crypto.exchangeRates,
        isLoadingExchangeRates: state.crypto.isLoadingExchangeRates,
        loadingExchangeRatesCurrency: state.crypto.loadingExchangeRatesCurrency,
        successLoadingExchangeRates: state.crypto.successLoadingExchangeRates,
    	errorLoadingExchangeRates: state.crypto.errorLoadingExchangeRates,
    	balance: state.crypto.balance,
        isLoadingBalance: state.crypto.isLoadingBalance,
        loadingBalanceCurrency: state.crypto.loadingBalanceCurrency,
        successLoadingBalance: state.crypto.successLoadingBalance,
    	errorLoadingBalance: state.crypto.errorLoadingBalance,
	}
}

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			LoadBalance,
			LoadExchangeRates
		},
		dispatch
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(SwipeApp)