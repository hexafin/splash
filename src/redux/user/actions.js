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
import * as Keychain from 'react-native-keychain';
import Contacts from 'react-native-contacts';

import { OpenWallet } from "../crypto/actions"

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
	LOAD_CONTACTS_INIT: "LOAD_CONTACTS_INIT",
	LOAD_CONTACTS_SUCCESS: "LOAD_CONTACTS_SUCCESS",
	LOAD_CONTACTS_FAILURE: "LOAD_CONTACTS_FAILURE",
	RESET_USER: "RESET_USER",
	START_LOCKOUT_CLOCK: 'START_LOCKOUT_CLOCK',
	RESET_LOCKOUT_CLOCK: 'RESET_LOCKOUT_CLOCK',
	TOGGLE_LOCKOUT: "TOGGLE_LOCKOUT",
	SET_BIOMETRIC: "SET_BIOMETRIC"
}

export function logInInit() {
	return { type: ActionTypes.LOG_IN_INIT }
}

export function setBiometric(enabled) {
	return { type: ActionTypes.SET_BIOMETRIC, enabled }
}

export function logInSuccess(userId, entity) {
	return {
		type: ActionTypes.LOG_IN_SUCCESS,
		userId,
		entity
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

export function loadContactsInit() {
	return { type: ActionTypes.LOAD_CONTACTS_INIT }
}

export function loadContactsSuccess(contacts) {
	return {type: ActionTypes.LOAD_CONTACTS_SUCCESS, contacts}
}

export function loadContactsFailure(error) {
	return { type: ActionTypes.LOAD_CONTACTS_FAILURE, error }
}

export function toggleLockout(toggle) {
	return { type: ActionTypes.TOGGLE_LOCKOUT, toggle }
}

export function resetUser() {
	return { type: ActionTypes.RESET_USER, }
}

export function startLockoutClock() {
	return {type: ActionTypes.START_LOCKOUT_CLOCK, }
}

export function resetLockoutClock() {
	return {type: ActionTypes.RESET_LOCKOUT_CLOCK, }
}

export const LogIn = (userId) => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			const state = getState()

			dispatch(logInInit())

			firestore.collection("users").doc(userId).get().then(userDoc => {
				// TODO: watch user entity for changes to account
				const userData = userDoc.data()
				Sentry.setUserContext({
					userId: userId,
					username: userData.splashtag
				})

				dispatch(logInSuccess(userId, userData))
				resolve()

			}).catch(error => {
				Sentry.captureMessage(error)
				dispatch(logInFailure(error))
				reject(error)
			})
		})
	}
}

export const ChangeUsername = () => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(updateUsernameInit())
			const state = getState()
			const uid = state.user.id
			const updatedUsername = state.form.updateSplashtag.values.updateUsername
			api.UpdateAccount(uid, {splashtag: updatedUsername}).then(userData => {
				dispatch(updateUsernameSuccess(userData))
				resolve()
				dispatch(reset('updateSplashtag'))
			}).catch(error => {
				Sentry.captureMessage(error)
				dispatch(updateUsernameFailure(error))
				dispatch(reset('updateSplashtag'))
				reject(error)
			})
		})
	}
}

export const LoadContacts = () => {
	return async (dispatch, getState) => {

		const state = getState()
		let friends = []

		dispatch(loadContactsInit())

		const convertPhoneNumber = (number) => {
			number = number.replace(/[^0-9]/g, '');
			if (number.length > 10) {
				return "+" + number
			//	TODO add more internationalization
			} else if (number.length == 10 && state.crypto.activeCurrency == 'USD') {
				return "+1" + number
			} else {
				return number
			}
		}

		try {
			Contacts.getAll(async (error, contacts) => {
				if (!error) {
					await Promise.all(contacts.map(async contact => {
						if (contact.phoneNumbers[0]) {
							const number = convertPhoneNumber(contact.phoneNumbers[0].number)
							const query = await firestore.collection("users").where("phoneNumber", "==", number).get()
							if (!query.empty && query.size == 1) {
								const data = query.docs[0].data()
								const uid = query.docs[0].id
								const newContact = {
									splashtag: data.splashtag,
									phoneNumber: data.phoneNumber,
									objectID: uid,
									wallets: data.wallets,
								}
								friends.push(newContact)
							}
						}
					}))
					dispatch(loadContactsSuccess(friends))
				} else {
					dispatch(loadContactsFailure(error))
				}
			})
		} catch (error) {
			dispatch(loadContactsFailure(error))
		}
	}
}
