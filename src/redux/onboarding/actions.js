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

import { ClaimUsername } from '../user/actions'
import NavigatorService from "../navigator";

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
export function smsConfirmSuccess() {
	return { type: SMS_CONFIRM_SUCCESS };
}

export const SMS_CONFIRM_FAILURE = "SMS_CONFIRM_FAILURE";
export function smsConfirmFailure(error) {
	return { type: SMS_CONFIRM_FAILURE, error };
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
		const state = getState();
		if (phoneNumber[0] != "+") {
			phoneNumber = "+" + phoneNumber;
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
		state.onboarding.smsAuthenticationToken
			.confirm(confirmationCode)
			.then(user => {
				const claimUsername = ClaimUsername(user);
				claimUsername(dispatch, getState);
				dispatch(smsConfirmSuccess());
			})
			.catch(error => {
				dispatch(smsConfirmFailure(error));
			});
	};
};
