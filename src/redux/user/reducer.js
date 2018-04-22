import firebase from "react-native-firebase"
import { Sentry } from "react-native-sentry"
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

import { ActionTypes } from "./actions.js"

const initialState = {
	loggedIn: false,
	isClaimingUsername: false,
	errorClaimingUsername: null,
	entity: {},
	bitcoin: {},
	splashtag: null
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case ActionTypes.CLAIM_USERNAME_INIT:
			return {
				...state,
				isClaimingUsername: true,
				errorClaimingUsername: null,
				entity: initialState.entity,
				bitcoin: initialState.bitcoin
			}

		case ActionTypes.CLAIM_USERNAME_SUCCESS:
			return {
				...state,
				isClaimingUsername: false,
				entity: {
					username: action.username,
					phoneNumber: action.phoneNumber
				},
				bitcoin: {
					address: action.bitcoin.address,
					privateKey: action.bitcoin.wif
				},
				loggedIn: true
			}

		case ActionTypes.CLAIM_USERNAME_FAILURE:
			Sentry.captureMessage(action.error)
			return {
				...state,
				isClaimingUsername: false,
				errorClaimingUsername: action.error,
				entity: initialState.entity,
				bitcoin: initialState.bitcoin
			}

		default:
			return state
	}
}
