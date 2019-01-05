import React, { Component } from "react"
import {
	Dimensions,
	ScrollView,
	Image,
	View,
	Text,
	Keyboard,
	Alert,
	Animated,
	StyleSheet,
	TouchableWithoutFeedback,
	AppState,
	Platform,
} from "react-native"
import firebase from "react-native-firebase"
import { Sentry } from "react-native-sentry";
import { colors } from "../../lib/colors"
import { defaults, icons } from "../../lib/styles"
import { isIphoneX } from "react-native-iphone-x-helper"
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import { cryptoNames, cryptoColors, cryptoImages, cryptoNameDict } from "../../lib/cryptos"
import { LoadExchangeRates, LoadBalance } from "../../redux/crypto/actions"
import { startLockoutClock, resetLockoutClock } from "../../redux/user/actions"
import PropTypes from "prop-types"
import Account from "../Account"
import Wallet from "../Wallet"
import Home from "../Home"
import Balance from "./Balance"
import CurrencySwitch from "./CurrencySwitch"
import ReturnToHome from "./ReturnToHome"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import codePush from "react-native-code-push";
import moment from "moment"
import ModalRoot from '../Modals/ModalRoot'
import Header from "./Header"

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

let currencies = []
let currencyIndex = {}
let i = 0
let snapPoints = []
const snapPointFromIndex = j => -1 * (SCREEN_WIDTH/2-45) * j
cryptoNames.forEach(crypto => {
  currencyIndex[crypto] = i
  currencies.push({
    index: i,
    name: cryptoNameDict[crypto],
    code: crypto,
    image: cryptoImages[crypto]
  })
  snapPoints.push({
    x: snapPointFromIndex(i)
  })
  i++
})

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
					outputRange: [SCREEN_WIDTH*0.55, 0, -0.55*SCREEN_WIDTH]
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
					outputRange: [SCREEN_WIDTH*1.2, 0, -1.2 * SCREEN_WIDTH]
				})
			}
		]
	}
}

const headerTranslateY = Animated.add(
	xOffset.interpolate({
		inputRange: [0, 1 * SCREEN_WIDTH, 2 * SCREEN_WIDTH],
		outputRange: [-160, 0, -160]
	}),
	Animated.multiply(
		xOffset.interpolate({
			inputRange: [0, 1 * SCREEN_WIDTH, 2 * SCREEN_WIDTH],
			outputRange: [0, 1, 0]
		}),
		yOffsets.home.interpolate({
			inputRange: [-41, -40, 0, 200, 201],
			outputRange: [40, 40, 0, -200, -200]
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

const switchXOffset = new Animated.Value(0)

let switchCryptoColors = [cryptoColors[cryptoNames[0]]]
let switchInputRange = [1]
let j = 0
let lastColor
cryptoNames.forEach(crypto => {
	switchInputRange.push(-1 * (SCREEN_WIDTH/2-45) * j)
  	switchCryptoColors.push(cryptoColors[crypto])
  	j++
  	lastColor = cryptoColors[crypto]
})
switchCryptoColors.push(lastColor)
switchInputRange.push(switchInputRange[j]-1)
switchInputRange.reverse()
switchCryptoColors.reverse()

const switchColor = switchXOffset.interpolate({
	inputRange: switchInputRange,
	outputRange: switchCryptoColors
})


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
				title: "Your splash wallet"
			}
		]
		this.state = {
			appState: AppState.currentState
		}
		this.pageIndices = {}
		for (let i = 0; i < this.pages.length; i++) {
			const page = this.pages[i]
			this.pageIndices[page.name] = i
		}
		this.goToPage = this.goToPage.bind(this)
		this.goToPageByIndex = this.goToPageByIndex.bind(this)
		this.handleAppStateChange = this.handleAppStateChange.bind(this)
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

	handleAppStateChange = (nextAppState) => {
		// if app opens to foreground
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {

		  // if time is past lockout
		  if (this.props.lockoutEnabled && this.props.lockoutTime && moment().unix() >= this.props.lockoutTime) {
			this.props.navigation.navigate("Unlock", {
				successCallback: () => {
					this.props.resetLockoutClock()
					this.props.navigation.navigate('SwipeApp')
				}
			})
		  } else {
			  this.props.resetLockoutClock()
		  }
		//if app goes to background
		} else if (this.state.appState.match(/active/) && (nextAppState === 'background' || nextAppState === 'inactive')) {
		  this.props.startLockoutClock()
		}
		this.setState({appState: nextAppState});
	}

	componentWillMount() {
		// initialize swipe app to center page
		xOffset.setValue(SCREEN_WIDTH)

		// initialize currency
		switchXOffset.setValue(-1 * currencyIndex[this.props.activeCryptoCurrency] * (100 + (SCREEN_WIDTH - 100)/2 - 95))
	}

	componentDidMount() {

		Sentry.setUserContext({
			userId: this.props.userId,
			username: this.props.splashtag
		})

		// do code push sync after logged in
		codePush.sync({
			updateDialog: false,
			installMode: codePush.InstallMode.ON_NEXT_SUSPEND,
			mandatoryInstallMode: codePush.InstallMode.ON_NEXT_SUSPEND,
			minimumBackgroundDuration: 60, // must be in background for 60 seconds to sync
		});

		// if timeis past lockout
		if (this.props.lockoutEnabled && this.props.lockoutTime && moment().unix() >= this.props.lockoutTime) {
			this.props.navigation.navigate("Unlock", {
				successCallback: () => {
					this.props.resetLockoutClock()
					this.props.navigation.navigate('SwipeApp')
				}
			})
		}

		this.goToPageByIndex(this.scrollView, 1)

		// load
		for (var i = 0; i < cryptoNames.length; i++) {
			this.props.LoadBalance(cryptoNames[i])
			this.props.LoadExchangeRates(cryptoNames[i])
			this.props.LoadTransactions(cryptoNames[i])
		}

		// set up notification permissions and tokens
		firebase.messaging().hasPermission().then(async (enabled) => {
			if (!enabled && !this.props.notificationsRequested) {
				this.props.setNotifsRequested(true)
				this.props.notificationPermissionInfo(async () => {
					await firebase.messaging().requestPermission()
					const fcmToken = await firebase.messaging().getToken()
					if (fcmToken) {
						await firebase.firestore().collection('users').doc(this.props.userId).update({pushToken: fcmToken})
					}
				})
			} else {
				const doc = await firebase.firestore().collection('users').doc(this.props.userId).get()
				if (!doc.data().pushToken) {
					const fcmToken = await firebase.messaging().getToken()
					if (fcmToken) {
						await firebase.firestore().collection('users').doc(this.props.userId).update({pushToken: fcmToken})
					}
				}
			    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(async (fcmToken) => {
			        await firebase.firestore().collection('users').doc(this.props.userId).update({pushToken: fcmToken})
			    });
			}
		}).catch(e => console.log('Notification Error:', e))

		// display notification if in foreground
		this.notificationListener = firebase.notifications().onNotification((notif) => {
			const notification = new firebase.notifications.Notification()
			  .setNotificationId(notif.notificationId)
			  .setTitle(notif.title)
			  .setBody(notif.body)
			firebase.notifications().displayNotification(notification)
			ReactNativeHapticFeedback.trigger("impactLight", true)
			this.props.LoadTransactions(this.props.activeCryptoCurrency)
  	    });

  	    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(() => {
  	    	this.props.LoadTransactions(this.props.activeCryptoCurrency)
	    });

	    firebase.notifications().getInitialNotification().then(() => {
	    	this.props.LoadTransactions(this.props.activeCryptoCurrency)
	    })

	    AppState.addEventListener('change', this.handleAppStateChange);	    	
   	}

	componentWillUnmount() {
		xOffset.removeAllListeners()
		switchXOffset.removeAllListeners()
		this.onTokenRefreshListener();
		this.notificationListener()
		this.notificationOpenedListener()
		AppState.removeEventListener('change', this.handleAppStateChange);			
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.appState != this.state.appState) {
			return true
		} else if (nextProps.lockoutTime != this.props.lockoutTime) {
			return true
		} else if (nextProps.splashtag != this.props.splashtag) {
			this.pages[0].title = `@${nextProps.splashtag}`
			return true
		}
		else {
			return false
		}
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
						yOffset: yOffsets[page.name],
						switchColor: switchColor,
						switchXOffset: switchXOffset
					})}
				</Page>
			)
			if (page.image) {
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
			}
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

				<Animated.View
					style={[headerTransform(), styles.headerImage]}>
					<Header
						fillInput={switchXOffset}
						fill={switchColor}/>
				</Animated.View>
				
				{Icons}

				{Titles}

				<ReturnToHome yOffsets={yOffsets} xOffset={xOffset} onPress={() => {
					this.goToPageByIndex(this.scrollView, 1)
				}}/>
				<Balance yOffsets={yOffsets} xOffset={xOffset}/>
				<CurrencySwitch
					switchXOffset={switchXOffset}
					yOffsets={yOffsets} 
					xOffset={xOffset}/>
				<ModalRoot />
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
		paddingLeft: Platform.isPad ? 0 : 20,
		paddingRight: Platform.isPad ? 0 : 20,
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
		top: -40,
		width: SCREEN_WIDTH,
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

const notificationPermissionInfo = (buttonCallback) => {
  return {
    type: 'SHOW_MODAL',
    modalType: 'INFO',
    modalProps: {
        title: 'Turn On Notifications',
        body: 'Get notified when you receive money or a friend thanks you.',
        buttonTitle: 'Great',
        buttonCallback: buttonCallback,
    },   
  }
}

const setNotifsRequested = (requested) => {
  return {
    type: 'NOTIFICATIONS_REQUESTED',
    requested: requested,
  }
}

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
    	lockoutTime: state.user.lockoutTime,
    	lockoutEnabled: state.user.lockoutEnabled,
    	notificationsRequested: state.user.notificationsRequested,
	}
}

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			LoadBalance,
			LoadExchangeRates,
			resetLockoutClock,
			startLockoutClock,
			setNotifsRequested,
			notificationPermissionInfo
		},
		dispatch
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(SwipeApp)