import firebase from "react-native-firebase"
import { Sentry } from "react-native-sentry"
import moment from "moment"
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

import { ActionTypes } from "./actions.js"

const initialState = {
	loggedIn: false,
	isLoggingIn: false,
	errorLoggingIn: null,
	isUpdatingUsername: false,
	errorUpdatingUsername: null,
	entity: {},
	lockoutDuration: 5,
	lockoutTime: null,
	id: null
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		
		case ActionTypes.LOG_IN_INIT:
			return {
				...state,
				isLoggingIn: true,
				errorLoggingIn: null
			}

		case ActionTypes.LOG_IN_SUCCESS:
			return {
				...state,
				isLoggingIn: false,
				id: action.userId,
				entity: action.entity,
				loggedIn: true
			}

		case ActionTypes.LOG_IN_FAILURE:
			return {
				...state,
				isLoggingIn: false,
				errorLoggingIn: action.error
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
			return {
				...state,
				isUpdatingUsername: false,
				errorUpdatingUsername: action.error,
			}

		case ActionTypes.RESET_LOCKOUT_CLOCK:
			return {
				...state,
				lockoutTime: null,
			}

		case ActionTypes.START_LOCKOUT_CLOCK:
			return {
				...state,
				lockoutTime: moment().add(state.lockoutDuration,'minutes').unix(),
			}

		case ActionTypes.RESET_USER:
			return initialState

		default:
			return state
	}
}
