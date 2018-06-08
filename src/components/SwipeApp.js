import React, { Component } from "react"
import {
	Dimensions,
	ScrollView,
	Image,
	View,
	Text,
	Animated,
	StyleSheet,
	TouchableWithoutFeedback
} from "react-native"
import firebase from "react-native-firebase"
import { colors } from "../lib/colors"
import { defaults, icons } from "../lib/styles"
import { isIphoneX } from "react-native-iphone-x-helper"
import { connect } from "react-redux";
import { bindActionCreators } from "redux"
import PropTypes from "prop-types"
import Account from "./Account"
import Receive from "./Receive"
import Home from "./Home"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height

const xOffset = new Animated.Value(0)
const _onScroll = Animated.event(
	[{ nativeEvent: { contentOffset: { x: xOffset } } }],
	{
		useNativeDriver: true
	}
)

function Page(props: { children?: ReactElement<*> }) {
	return (
		<View style={{ flex: 1, width: SCREEN_WIDTH }}>{props.children}</View>
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
					outputRange: [198, 0, -198]
				})
			}
		]
	}
}

function headerTransform() {
	return {
		transform: [
			{
				translateY: xOffset.interpolate({
					inputRange: [
						0,
						1 * SCREEN_WIDTH,
						2 * SCREEN_WIDTH
					],
					outputRange: [-20, 0, -20]
				})
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
		this.state = {
			activePage: this.props.activePage ? this.props.activePage : "Home",
			activeIndex: 1,
			isScrolling: false
		}
		this.pages = [
			{
				name: "Account",
				component: Account,
				image: icons.whiteSplash
			},
			{
				name: "Home",
				component: Home,
				image: null
			},
			{
				name: "Receive",
				component: Receive,
				image: icons.qrIcon
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
			this.setState(prevState => {
				return {
					...prevState,
					activePage: pageName,
					activeIndex: this.pageIndices[pageName]
				}
			})
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
				this.setState(prevState => {
					return {
						...prevState,
						activePage: this.pages[index].name,
						activeIndex: index
					}
				})
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
	}

	render() {

		const Pages = []
		const Icons = []
		for (let i = 0; i < this.pages.length; i++) {
			const page = this.pages[i]
			Pages.push(
				<Page key={"page-" + i}>
					{React.createElement(page.component, {
						...this.props,

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
								height: (page.name == "Receive") ? 40 : 45,
								width: (page.name == "Receive") ? 40 : 45,
							}
						]}
					/>
				</TouchableWithoutFeedback>
			)
		}

		return (
			<View style={styles.container}>
				<Animated.Image
					source={require("../assets/images/headerWave.png")}
					resizeMode="contain"
					style={[headerTransform(), styles.headerImage]}/>
				<Animated.ScrollView
					horizontal
					pagingEnabled
					// ref={ref => (this.tabBar = ref._component)}
					ref={this.refScrollView}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					automaticallyAdjustContentInsets={false}
					onScrollBeginDrag={event => {
						this.setState(prevState => {
							return {
								...prevState,
								isScrolling: true
							}
						})
					}}
					onMomentumScrollEnd={event => {
						try {
							const xOffset = event.nativeEvent.contentOffset.x
							const activePageName = this.pages[
								xOffset / SCREEN_WIDTH
							].name
							this.setState(prevState => {
								return {
									...prevState,
									activePage: activePageName,
									activeIndex: this.pageIndices[activePageName],
									isScrolling: false
								}
							})
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
				
				{Icons}
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
		shadowRadius: 12
	},
	headerImage: {
		top: (isIphoneX()) ? -30 : -50,
		width: SCREEN_WIDTH,
		height: 240,
		position: "absolute"
	}
})


const mapStateToProps = state => {
	return {
		
	}
}

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			
		},
		dispatch
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(SwipeApp)
