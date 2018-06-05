import api from "../../api"
import axios from "axios"
import firebase from "react-native-firebase"
import { Sentry } from "react-native-sentry"
import FCM, {
	FCMEvent,
	RemoteNotificationResult,
	WillPresentNotificationResult,
	NotificationType
} from "react-native-fcm"
import NavigatorService from "../navigator"
let firestore = firebase.firestore()
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

export const ActionTypes = {
	CLAIM_USERNAME_INIT: "CLAIM_USERNAME_INIT",
	CLAIM_USERNAME_SUCCESS: "CLAIM_USERNAME_SUCCESS",
	CLAIM_USERNAME_FAILURE: "CLAIM_USERNAME_FAILURE"
}

export function claimUsernameInit() {
	return { type: ActionTypes.CLAIM_USERNAME_INIT }
}

export function claimUsernameSuccess(userId, entity, bitcoin) {
	return {
		type: ActionTypes.CLAIM_USERNAME_SUCCESS,
		userId,
		entity,
		bitcoin
	}
}

export function claimUsernameFailure(error) {
	return { type: ActionTypes.CLAIM_USERNAME_FAILURE, error }
}

export const ClaimUsername = user => {
	return (dispatch, getState) => {
		const state = getState()
		let splashtag = state.onboarding.splashtagOnHold
		const phoneNumber = state.onboarding.phoneNumber
		const bitcoinData = api.NewBitcoinWallet()

		if (
			typeof state.form.chooseSplashtag !== "undefined" &&
			state.form.chooseSplashtag.values.splashtag
		) {
			splashtag = state.form.chooseSplashtag.values.splashtag
		}

		dispatch(claimUsernameInit())
		// check to see if username is available
		api
			.UsernameExists(splashtag)
			.then(data => {
				if (!data.availableUser) {
					dispatch(claimUsernameFailure("Error: Username taken"))
				} else {
					Sentry.setUserContext({
						userId: user.uid,
						username: splashtag
					})

					const entity = {
						splashtag: splashtag,
						phoneNumber,
			            defaultCurrency: "USD",
			            bitcoinAddress: bitcoinData.address
					}

					api.CreateUser(user.uid, entity).then(userEntity => {
						dispatch(claimUsernameSuccess(user.uid, userEntity, bitcoinData))
						NavigatorService.navigate("Home")

						FCM.requestPermissions()
							.then(() =>
								FCM.getFCMToken().then(token => {
									api.UpdateAccount(user.uid, {push_token: token})
								})
							)
							.catch(() =>
								console.log("notification permission rejected")
							)
				
					})
					.catch(error => {
						dispatch(claimUsernameFailure(error))
					})
				}
			})
			.catch(error => {
				dispatch(claimUsernameFailure(error))
			})
	}
}
