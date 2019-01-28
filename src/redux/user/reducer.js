import moment from "moment"

import { ActionTypes } from "./actions.js"

const initialState = {
	loggedIn: false,
	isLoggingIn: false,
	errorLoggingIn: null,
	isUpdatingUsername: false,
	errorUpdatingUsername: null,
	isLoadingContacts: false,
	errorLoadingContacts: null,
	contacts: [],
	entity: {},
	lockoutEnabled: false, // is a pin set
	lockoutDuration: 5, // five minute lockout duration
	lockoutTime: null,
	id: null,
	biometric: false, // is biometrics enabled
	notificationsRequested: false, // have we already asked for notification access
}

export default function reducer(state = initialState, action) {
	switch (action.type) {

		case ActionTypes.SET_BIOMETRIC:
			return {
				...state,
				biometric: action.enabled
			}
		
		case ActionTypes.NOTIFICATIONS_REQUESTED:
			return {
				...state,
				notificationsRequested: action.requested
			}
		
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

		case ActionTypes.LOAD_CONTACTS_INIT:
			return {
				...state,
				isLoadingContacts: true,
				errorLoadingContacts: null,
			}

		case ActionTypes.LOAD_CONTACTS_SUCCESS:
			return {
				...state,
				isLoadingContacts: false,
				errorLoadingContacts: null,
				contacts: action.contacts,
			}
		
		case ActionTypes.LOAD_CONTACTS_FAILURE:
			return {
				...state,
				isLoadingContacts: false,
				errorLoadingContacts: action.error,
			}

		case ActionTypes.RESET_LOCKOUT_CLOCK:
			return {
				...state,
				lockoutTime: null,
			}

		case ActionTypes.START_LOCKOUT_CLOCK:
			return {
				...state,
				lockoutTime: moment().add(state.lockoutDuration,'minutes').unix(), // set lockout timer
			}

		case ActionTypes.TOGGLE_LOCKOUT:
			return {
				...state,
				lockoutEnabled: action.toggle,
			}

		case ActionTypes.RESET_USER:
			return initialState

		default:
			return state
	}
}
