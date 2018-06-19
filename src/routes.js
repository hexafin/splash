import React, { Component } from "react"
import { createBottomTabNavigator, createStackNavigator } from "react-navigation"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import { colors } from "./lib/colors"

import Landing from "./components/Landing"
import ChooseSplashtag from "./components/ChooseSplashtag"
import EnterPhoneNumber from "./components/EnterPhoneNumber"
import VerifyPhoneNumber from "./components/VerifyPhoneNumber"
import Waitlisted from "./components/Waitlisted"
import UpdateUsername from "./components/UpdateUsername"
import ScanQrCode from "./components/ScanQrCode"
import Unlock from "./components/Unlock"
import ViewTransactionModal from "./components/ViewTransactionModal"
import SwipeApp from "./components/SwipeApp"
import ApproveTransactionModal from "./components/ApproveTransactionModal"
import ApproveCardModal from "./components/ApproveCardModal"


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


const OnboardingRouter = createBottomTabNavigator(
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
		initialRouteName: "Landing",
		activeBackgroundColor: colors.white,
		inactiveBackgroundColor: colors.white
	}
)

const AppRouter = createStackNavigator(
	{
		ScanQrCode: {
			screen: ScanQrCode
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
	return createStackNavigator(
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
