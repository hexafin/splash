import api from "../../api"
var axios = require("axios")
import firebase from "react-native-firebase"
let firestore = firebase.firestore()
let analytics = firebase.analytics()
import { Sentry } from "react-native-sentry"
import FCM, {
	FCMEvent,
	RemoteNotificationResult,
	WillPresentNotificationResult,
	NotificationType
} from "react-native-fcm"
analytics.setAnalyticsCollectionEnabled(true)
import NavigatorService from "../navigator"
import {reset} from 'redux-form';

export const ActionTypes = {
	CLAIM_USERNAME_INIT: "CLAIM_USERNAME_INIT",
	CLAIM_USERNAME_SUCCESS: "CLAIM_USERNAME_SUCCESS",
	CLAIM_USERNAME_FAILURE: "CLAIM_USERNAME_FAILURE",
	UPDATE_USERNAME_INIT: "UPDATE_USERNAME_INIT",
	UPDATE_USERNAME_SUCCESS: "UPDATE_USERNAME_SUCCESS",
	UPDATE_USERNAME_FAILURE: "UPDATE_USERNAME_FAILURE",
	RESET_USER: "RESET_USER"
}

export function claimUsernameInit() {
	return { type: ActionTypes.CLAIM_USERNAME_INIT }
}

export function claimUsernameSuccess(uid, username, phoneNumber, bitcoin) {
	return {
		type: ActionTypes.CLAIM_USERNAME_SUCCESS,
		uid,
		username,
		phoneNumber,
		bitcoin
	}
}

export function claimUsernameFailure(error) {
	return { type: ActionTypes.CLAIM_USERNAME_FAILURE, error }
}

export function updateUsernameInit() {
	return { type: ActionTypes.UPDATE_USERNAME_INIT }
}

export function updateUsernameSuccess(entity) {
	return {type: ActionTypes.UPDATE_USERNAME_SUCCESS, entity}
}

export function updateUsernameFailure(error) {
	return { type: ActionTypes.UPDATE_USERNAME_FAILURE, error }
}

export function resetUser() {
	return { type: ActionTypes.RESET_USER, }
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
						userID: user.uid,
						username: splashtag
					})

					FCM.requestPermissions()
						.then(() =>
							console.log("notification permission granted")
						)
						.catch(() =>
							console.log("notification permission rejected")
						)

					FCM.getFCMToken().then(async token => {
						api
							.NewAccount(user.uid, {
								username: splashtag,
								phoneNumber: phoneNumber,
								push_token: token,
								bitcoin: bitcoinData
							})
							.then(person => {
								NavigatorService.navigate("Home")

								FCM.on(FCMEvent.Notification, async notif => {
									console.log("Notification", notif)
									// reload on notifications
									if (
										!notif.local_notification ||
										notif.opened_from_tray
									) {
										FCM.presentLocalNotification({
											title: notif.title,
											body: notif.body,
											data: notif.data,
											priority: "high",
											sound: "default",
											vibrate: 300,
											show_in_foreground: true
										})
									}
								})

								dispatch(
									claimUsernameSuccess(
										user.uid,
										splashtag,
										phoneNumber,
										bitcoinData
									)
								)
							})
							.catch(error => {
								dispatch(claimUsernameFailure(error))
							})
					})
				}
			})
			.catch(error => {
				dispatch(claimUsernameFailure(error))
			})
	}
}

export const ChangeUsername = () => {
	return (dispatch, getState) => {
		dispatch(updateUsernameInit())
		const state = getState()
		const uid = state.user.entity.uid
		const updatedUsername = state.form.updateSplashtag.values.updateUsername
		api.UpdateAccount(uid, {username: updatedUsername}).then(() => {
			const entity = {uid: uid, username: updatedUsername, phoneNumber: state.user.entity.phoneNumber}
			dispatch(updateUsernameSuccess(entity))
			NavigatorService.navigate("Account")
			dispatch(reset('updateSplashtag'))
		}).catch(error => {
			dispatch(updateUsernameFailure(error))
			dispatch(reset('updateSplashtag'))
		})
	}
}

export const LoadApp = () => {
	return (dispatch, getState) => {
		const state = getState()
		console.log("load app", state)

		if (state.user.loggedIn) {
			NavigatorService.navigate("Home")
		}
	}
}
