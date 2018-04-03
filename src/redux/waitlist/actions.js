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

export const CLAIM_USERNAME_INIT = "CLAIM_USERNAME_INIT";
export function claimUsernameInit() {
	return { type: CLAIM_USERNAME_INIT };
}

export const CLAIM_USERNAME_SUCCESS = "CLAIM_USERNAME_SUCCESS";
export function claimUsernameSuccess(username) {
	return { type: CLAIM_USERNAME_SUCCESS, username };
}

export const CLAIM_USERNAME_FAILURE = "CLAIM_USERNAME_FAILURE";
export function claimUsernameFailure(error) {
	return { type: CLAIM_USERNAME_FAILURE, error };
}

export const SMS_AUTH_INIT = "SMS_AUTH_INIT";
export function smsAuthInit(phoneNumber, countryName) {
	return { type: SMS_AUTH_INIT, phoneNumber, countryName };
}

export const SMS_AUTH_SUCCESS = "SMS_AUTH_SUCCESS";
export function smsAuthSuccess(token) {
	return { type: SMS_AUTH_SUCCESS, token };
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
export function smsConfirmSuccess(user) {
	return { type: SMS_CONFIRM_SUCCESS, user };
}

export const SMS_CONFIRM_FAILURE = "SMS_CONFIRM_FAILURE";
export function smsConfirmFailure(error) {
	return { type: SMS_CONFIRM_FAILURE, error };
}

export const HOLD_SPLASHTAG = "SPLASHTAG_ON_HOLD";
export function holdSplashtag(splashtag, phoneNumber) {
	return { type: HOLD_SPLASHTAG, splashtag, phoneNumber };
}

export const ClaimUsername = user => {
	return (dispatch, getState) => {
		const state = getState();
		let splashtag = state.waitlist.splashtagOnHold;
		if (
			typeof state.form.chooseSplashtag !== "undefined" &&
			state.form.chooseSplashtag.values.splashtag
		) {
			splashtag = state.form.chooseSplashtag.values.splashtag;
		}

		dispatch(claimUsernameInit());
		// check to see if username is available
		api
			.UsernameExists(splashtag)
			.then(data => {
				if (!data.availableUser) {
					dispatch(claimUsernameFailure("Error: Username taken"));
				} else {
					Sentry.setUserContext({
						userID: user.uid,
						username: splashtag
					});

					FCM.requestPermissions()
						.then(() =>
							console.log("notification permission granted")
						)
						.catch(() =>
							console.log("notification permission rejected")
						);

					FCM.getFCMToken().then(async token => {
						api
							.NewAccount(user.uid, {
								username: splashtag,
								phoneNumber: state.waitlist.phoneNumber,
								push_token: token
							})
							.then(person => {
								NavigatorService.navigate("FadeRouter");

								FCM.on(FCMEvent.Notification, async notif => {
									console.log("Notification", notif);
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
										});
									}
								});

								dispatch(claimUsernameSuccess(splashtag));
							})
							.catch(error => {
								dispatch(claimUsernameFailure(error));
							});
					});
				}
			})
			.catch(error => {
				dispatch(claimUsernameFailure(error));
			});
	};
};

export const getDeepLinkedSplashtag = (splashtag, phoneNumber) => {
	return (dispatch, getState) => {
		const state = getState();
		if (
			!(
				splashtag == state.waitlist.splashtagOnHold &&
				phoneNumber == state.waitlist.phoneNumber
			)
		) {
			dispatch(holdSplashtag(splashtag, phoneNumber));
		}
	};
};

export const SmsAuthenticate = (phoneNumber, countryName) => {
	return (dispatch, getState) => {
		const state = getState();
		if (phoneNumber[0] != "+") {
			phoneNumber = "+" + phoneNumber;
			console.log(phoneNumber);
		}
		dispatch(smsAuthInit(phoneNumber, countryName));
		firebase
			.auth()
			.signInWithPhoneNumber(phoneNumber)
			.then(confirmResult => {
				NavigatorService.navigate("VerifyPhoneNumber");
				dispatch(smsAuthSuccess(confirmResult));
			})
			.catch(error => {
				dispatch(smsAuthFailure(error));
			});
	};
};

export const SmsConfirm = confirmationCode => {
	return (dispatch, getState) => {
		const state = getState();
		dispatch(smsConfirmInit());
		state.waitlist.smsAuthenticationToken
			.confirm(confirmationCode)
			.then(user => {
				const claimUsername = ClaimUsername(user);
				claimUsername(dispatch, getState);
				dispatch(smsConfirmSuccess(user));
			})
			.catch(error => {
				dispatch(smsConfirmFailure(error));
			});
	};
};
