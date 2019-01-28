import { createBottomTabNavigator, createStackNavigator, createAppContainer } from "react-navigation"
import { colors } from "./lib/colors"

import Landing from "./components/Landing"
import ChooseSplashtag from "./components/ChooseSplashtag"
import EnterPhoneNumber from "./components/EnterPhoneNumber"
import VerifyPhoneNumber from "./components/VerifyPhoneNumber"
import UpdateUsername from "./components/UpdateUsername"
import ScanQrCode from "./components/ScanQrCode"
import Unlock from "./components/Unlock"
import ViewTransactionModal from "./components/ViewTransactionModal"
import SwipeApp from "./components/SwipeApp"
import ApproveTransactionModal from "./components/ApproveTransactionModal"
import ApproveCardModal from "./components/ApproveCardModal"
import EnterAmount from "./components/EnterAmount"
import SendTo from "./components/SendTo"
import SetPasscode from "./components/SetPasscode"


// vertical slide transition
function forVertical(props) {
	const { layout, position, scene } = props

	const index = scene.index
	const height = layout.initHeight

	const translateX = 0
	const translateY = position.interpolate({
		inputRange: ([index - 1, index, index + 1]: Array<number>),
		outputRange: ([height, 0, 0]: Array<number>)
	})

	// if screen is unlock use abrupt transition
	if (scene.route.routeName == 'Unlock') {
		return null
	} else { // otherwise use vertical slide
		return {
			transform: [{ translateX }, { translateY }]
		}
	}
}


// define app layout
const cointainer = (loggedIn) => {
	return createStackNavigator(
		{
			AppRouter: {
				screen: createStackNavigator(
					{
						ScanQrCode: {
							screen: ScanQrCode
						},
						UpdateUsername: {
							screen: UpdateUsername
						},
						Unlock: {
							screen: Unlock
						},
						SetPasscode: {
							screen: SetPasscode
						},
						PayFlow: {
							screen: createStackNavigator(
								{
									EnterAmount: {
										screen: EnterAmount,
									},
									SendTo: {
										screen: SendTo,
									}
								},
								{
									initialRouteName: "EnterAmount",
									activeBackgroundColor: colors.white,
									inactiveBackgroundColor: colors.white,
									headerMode: "none",
									lazy: true,
								}
							)
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
			},
			OnboardingRouter: {
				screen: createBottomTabNavigator(
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
			},
		},
		{
			headerMode: "none",
			mode: "modal",
			swipeEnabled: false,
			initialRouteName: loggedIn ? "AppRouter" : "OnboardingRouter", // show initial route based on loggedIn
			cardStyle: {
				backgroundColor: "rgba(0,0,0,0)"
			}
		}
	)
}

export default (loggedIn) => {
	return createAppContainer(cointainer(loggedIn))
}
