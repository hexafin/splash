import React, { Component } from "react"
import { TabNavigator, StackNavigator } from "react-navigation"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

import Landing from "./components/Landing"
import ChooseSplashtag from "./components/ChooseSplashtag"
import EnterPhoneNumber from "./components/EnterPhoneNumber"
import VerifyPhoneNumber from "./components/VerifyPhoneNumber"
import Waitlisted from "./components/Waitlisted"
import UpdateUsername from "./components/UpdateUsername"
import Send from "./components/Send"
import Unlock from "./components/Unlock"
import ViewTransactionModal from "./components/ViewTransactionModal"
import SwipeApp from "./components/SwipeApp"
import ApproveTransactionModal from "./components/ApproveTransactionModal"
import ApproveCardModal from "./components/ApproveCardModal"

const fade = props => {
	const { position, scene } = props

	const index = scene.index

	const opacity = position.interpolate({
		inputRange: [index - 0.7, index, index + 0.7],
		outputRange: [0.1, 1, 0.1]
	})

	return {
		opacity
	}
}

function forVertical(props) {
	const { layout, position, scene } = props

	const index = scene.index
	const height = layout.initHeight

	const translateX = 0
	const translateY = position.interpolate({
		inputRange: ([index - 1, index, index + 1]: Array<number>),
		outputRange: ([height, 0, 0]: Array<number>)
	})

	return {
		transform: [{ translateX }, { translateY }]
	}
}

// const FadeRouter = StackNavigator(
// 	{
// 		Unlock: {
// 			screen: Unlock
// 		},
// 		Home: {
// 			screen: Home
// 		}
// 	},
// 	{
// 		headerMode: "none",
// 		initialRouteName: "Unlock",
// 		transitionConfig: () => ({
// 			screenInterpolator: props => {
// 				return fade(props);
// 			}
// 		})
// 	}
// );

const OnboardingRouter = TabNavigator(
	{
		Landing: {
			screen: Landing,
			navigationOptions: {
				tabBarVisible: false
			}
		},
		ChooseSplashtag: {
			screen: ChooseSplashtag,
			navigationOptions: {
				tabBarVisible: false
			}
		},
		EnterPhoneNumber: {
			screen: EnterPhoneNumber,
			navigationOptions: {
				tabBarVisible: false
			}
		},
		VerifyPhoneNumber: {
			screen: VerifyPhoneNumber,
			navigationOptions: {
				tabBarVisible: false
			}
		}
	},
	{
		animationEnabled: true,
		swipeEnabled: false,
		initialRouteName: "Landing"
	}
)

const AppRouter = StackNavigator(
	{
		ApproveCardModal: {
			screen: ApproveCardModal
		},
		ApproveTransactionModal: {
			screen: ApproveTransactionModal
		},
		ViewTransactionModal: {
			screen: ViewTransactionModal
		},
		Send: {
			screen: Send
		},
		UpdateUsername: {
			screen: UpdateUsername
		},
		SwipeApp: {
			screen: SwipeApp
		},
	},
	{
		headerMode: "none",
		mode: "modal",
		swipeEnabled: false,
		initialRouteName: "SwipeApp",
		transitionConfig: () => ({ screenInterpolator: forVertical }),
		cardStyle: {
			backgroundColor: "rgba(0,0,0,0)"
		}
	}
)

export default (loggedIn) => {
	return StackNavigator(
		{
			AppRouter: {
				screen: AppRouter
			},
			OnboardingRouter: {
				screen: OnboardingRouter
			}
		},
		{
			headerMode: "none",
			mode: "modal",
			swipeEnabled: false,
			initialRouteName: loggedIn ? "AppRouter" : "OnboardingRouter",
			transitionConfig: () => ({ screenInterpolator: forVertical }),
			cardStyle: {
				backgroundColor: "rgba(0,0,0,0)"
			}
		}
	)
}
