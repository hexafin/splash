import firebase from "react-native-firebase"
import { Sentry } from "react-native-sentry"
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

import { ActionTypes } from "./actions.js"

const initialState = {
	loggedIn: false,
	isClaimingUsername: false,
	errorClaimingUsername: null,
	isUpdatingUsername: false,
	errorUpdatingUsername: null,
	entity: {},
	bitcoin: {},
	splashtag: null,
	id: null
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
				id: action.userId,
				entity: action.entity,
				bitcoin: action.bitcoin,
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

		case ActionTypes.UPDATE_USERNAME_INIT:
			return {
				...state,
				isUpdatingUsername: true,
				errorUpdatingUsername: null,
			}

		case ActionTypes.UPDATE_USERNAME_SUCCESS:
			return {
				...state,
				isUpdatingUsername: false,
				errorUpdatingUsername: null,
				entity: action.entity
			}
		
		case ActionTypes.UPDATE_USERNAME_FAILURE:
			Sentry.captureMessage(action.error)
			return {
				...state,
				isUpdatingUsername: false,
				errorUpdatingUsername: action.error,
			}

		case ActionTypes.RESET_USER:
			return initialState

		default:
			return state
	}
}
