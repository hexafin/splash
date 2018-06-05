import firebase from 'react-native-firebase'
import {Sentry} from 'react-native-sentry'
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

import {
    SMS_AUTH_INIT,
    SMS_AUTH_SUCCESS,
    SMS_AUTH_FAILURE,
    CLAIM_USERNAME_INIT,
    CLAIM_USERNAME_SUCCESS,
    CLAIM_USERNAME_FAILURE,
    HOLD_SPLASHTAG,
    SMS_CONFIRM_INIT,
    SMS_CONFIRM_SUCCESS,
    SMS_CONFIRM_FAILURE,
    RESET_ONBOARDING
} from "./actions.js"

const initialState = {
    isSmsAuthenticating: false,
    errorSmsAuthenticating: null,
    splashtagOnHold: null,
    phoneNumber: null,
    countryName: null,
    smsAuthenticated: false,
    isSmsConfirming: false,
    errorSmsConfirming: null
}

export default function onboardingReducer(state = initialState, action) {
    switch (action.type) {

        case HOLD_SPLASHTAG:
            return {
                ...state,
                splashtagOnHold: action.splashtag,
                phoneNumber: action.phoneNumber
            }

        case SMS_AUTH_INIT:
            return {
                ...state,
                isSmsAuthenticating: true,
                errorSmsAuthenticating: null,
                errorSmsConfirming: null,
                smsAuthenticated: false,
                phoneNumber: action.phoneNumber,
                countryName: action.countryName
            }

        case SMS_AUTH_SUCCESS:
            return {
                ...state,
                isSmsAuthenticating: false,
                smsAuthenticationToken: action.token
            }

        case SMS_AUTH_FAILURE:
            Sentry.captureMessage(action.error)
            return {
                ...state,
                isSmsAuthenticating: false,
                errorSmsAuthenticating: action.error
            }

        case SMS_CONFIRM_INIT:
            return {
                ...state,
                isSmsConfirming: true,
                errorSmsConfirming: null,
            }

        case SMS_CONFIRM_SUCCESS:
            return {
                ...state,
                isSmsConfirming: false,
                smsAuthenticated: true,
            }

        case SMS_CONFIRM_FAILURE:
            Sentry.captureMessage(action.error)
            return {
                ...state,
                isSmsConfirming: false,
                errorSmsConfirming: action.error
            }

        case RESET_ONBOARDING:
            return initialState

        default:
            return state
    }
}
