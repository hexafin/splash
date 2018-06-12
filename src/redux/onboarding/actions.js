import api from "../../api";
var axios = require("axios");
import firebase from "react-native-firebase";
let firestore = firebase.firestore();
let analytics = firebase.analytics();
import { Sentry } from "react-native-sentry";
import FCM, {
	FCMEvent,
	RemoteNotificationResult,
	WillPresentNotificationResult,
	NotificationType
} from "react-native-fcm";
import { NavigationActions } from "react-navigation";
analytics.setAnalyticsCollectionEnabled(true);
import NavigatorService from "../navigator";
import * as Keychain from 'react-native-keychain';

export const SMS_AUTH_INIT = "SMS_AUTH_INIT";
export function smsAuthInit(phoneNumber, countryName) {
	return { type: SMS_AUTH_INIT, phoneNumber, countryName };
}

export const SMS_AUTH_SUCCESS = "SMS_AUTH_SUCCESS";
export function smsAuthSuccess() {
	return { type: SMS_AUTH_SUCCESS };
}

export const SMS_AUTH_FAILURE = "SMS_AUTH_FAILURE";
export function smsAuthFailure(error) {
	return { type: SMS_AUTH_FAILURE, error };
}

export const SMS_CONFIRM_INIT = "SMS_CONFIRM_INIT";
export function smsConfirmInit() {
	return { type: SMS_CONFIRM_INIT };
}

export const SMS_CONFIRM_SUCCESS = "SMS_CONFIRM_SUCCESS";
export function smsConfirmSuccess() {
	return { type: SMS_CONFIRM_SUCCESS };
}

export const SMS_CONFIRM_FAILURE = "SMS_CONFIRM_FAILURE";
export function smsConfirmFailure(error) {
	return { type: SMS_CONFIRM_FAILURE, error };
}

export const SIGN_UP_INIT = "SIGN_UP_INIT";
export function signUpInit() {
	return { type: SIGN_UP_INIT };
}

export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export function signUpSuccess() {
	return { type: SIGN_UP_SUCCESS };
}

export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";
export function signUpFailure(error) {
	return { type: SIGN_UP_FAILURE, error };
}

export const HOLD_SPLASHTAG = "SPLASHTAG_ON_HOLD";
export function holdSplashtag(splashtag, phoneNumber) {
	return { type: HOLD_SPLASHTAG, splashtag, phoneNumber };
}

export const RESET_ONBOARDING = "RESET_ONBOARDING";
export function resetOnboarding() {
	return { type: RESET_ONBOARDING };
}

export const getDeepLinkedSplashtag = (splashtag, phoneNumber) => {
	return (dispatch, getState) => {
		const state = getState();
		if (
			!(
				splashtag == state.onboarding.splashtagOnHold &&
				phoneNumber == state.onboarding.phoneNumber
			)
		) {
			dispatch(holdSplashtag(splashtag, phoneNumber));
		}
	};
};

export const SmsAuthenticate = (phoneNumber, countryName) => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			const state = getState();
			if (phoneNumber[0] != "+") {
				phoneNumber = "+" + phoneNumber;
			}
			dispatch(smsAuthInit(phoneNumber, countryName));
			firebase
				.auth()
				.signInWithPhoneNumber(phoneNumber)
				.then(confirmResult => {
					dispatch(smsAuthSuccess());
					resolve(confirmResult)
				})
				.catch(error => {
					dispatch(smsAuthFailure(error));
					reject(error)
				});
		})
	};
};

export const SmsConfirm = (confirmResult, confirmationCode) => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			const state = getState();
			dispatch(smsConfirmInit());
			confirmResult
				.confirm(confirmationCode)
				.then(user => {
					dispatch(smsConfirmSuccess());
					resolve(user)
				})
				.catch(error => {
					dispatch(smsConfirmFailure(error));
					reject(error)
				});
		})
	};
};

export const SignUp = user => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {

			dispatch(signUpInit())

			const state = getState()
			const userId = user.uid
			const network = state.user.bitcoinNetwork

			// user does not already exist, full signup
			let splashtag = state.onboarding.splashtagOnHold
			const phoneNumber = state.onboarding.phoneNumber

			if (typeof state.form.chooseSplashtag !== "undefined" && state.form.chooseSplashtag.values.splashtag) {
				splashtag = state.form.chooseSplashtag.values.splashtag
			}

			// check if user already exists
			let userRef = firestore.collection("users").doc(userId)
			userRef.get().then(userDoc => {
				api.UsernameExists(splashtag).then(data => {
					console.log("api response", data)
					if (data.availableUser) {

						Keychain.getGenericPassword().then(data => {
							let bitcoinData = {}
							if(data.username == userId) {
								console.log('found in Keychain')
								bitcoinData = JSON.parse(data.password)
							} else {
								// create new bitcoin wallet
								bitcoinData = api.NewBitcoinWallet(network)
							}
							const entity = {
								splashtag: splashtag,
								phoneNumber,
					            defaultCurrency: "USD",
					            bitcoinAddress: bitcoinData.address
							}
							console.log({userId, bitcoinData})
							userRef.set(entity).then(() => {
								dispatch(signUpSuccess())
								resolve({userId, bitcoinData})
							}).catch(error => {
								dispatch(signUpFailure(error))
								reject(error)
							})
						})
					}
					else {
						// username already taken
						const error = "Username already taken"
						dispatch(signUpFailure(error))
						reject(error)
					}
				})
			}).catch(error => {
				dispatch(signUpFailure(error))
				reject(error)
			})
		})
	}
}






