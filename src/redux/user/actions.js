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
import {reset} from 'redux-form';
let firestore = firebase.firestore()
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

export const ActionTypes = {
	LOG_IN_INIT: "LOG_IN_INIT",
	LOG_IN_SUCCESS: "LOG_IN_SUCCESS",
	LOG_IN_FAILURE: "LOG_IN_FAILURE",
	UPDATE_USERNAME_INIT: "UPDATE_USERNAME_INIT",
	UPDATE_USERNAME_SUCCESS: "UPDATE_USERNAME_SUCCESS",
	UPDATE_USERNAME_FAILURE: "UPDATE_USERNAME_FAILURE",
	RESET_USER: "RESET_USER"
}

export function logInInit() {
	return { type: ActionTypes.LOG_IN_INIT }
}

export function logInSuccess(userId, entity, bitcoin) {
	return {
		type: ActionTypes.LOG_IN_SUCCESS,
		userId,
		entity,
		bitcoin
	}
}

export function logInFailure(error) {
	return { type: ActionTypes.LOG_IN_FAILURE, error }
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

export const LogIn = userId => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			const state = getState()

			dispatch(logInInit())

			firestore.collection("users").doc(userId).get().then(userDoc => {
				// TODO: watch user entity for changes to account
				const userData = userDoc.data()
				// create new bitcoin wallet on login
				const bitcoinData = api.NewBitcoinWallet()
				Sentry.setUserContext({
					userId: userId,
					username: userData.splashtag
				})
				dispatch(logInSuccess(userId, userData, bitcoinData))
				resolve()
			}).catch(error => {
				dispatch(logInFailure(error))
				reject(error)
			})
		})
	}
}

export const ChangeUsername = () => {
	return (dispatch, getState) => {
		dispatch(updateUsernameInit())
		const state = getState()
		const uid = state.user.entity.uid
		const updatedUsername = state.form.updateSplashtag.values.updateUsername
		api.UpdateAccount(uid, {username: updatedUsername}).then(userData => {
			dispatch(updateUsernameSuccess(userData))
			NavigatorService.navigate("Account")
			dispatch(reset('updateSplashtag'))
		}).catch(error => {
			dispatch(updateUsernameFailure(error))
			dispatch(reset('updateSplashtag'))
		})
	}
}
