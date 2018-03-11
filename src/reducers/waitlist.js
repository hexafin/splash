import firebase from 'react-native-firebase'
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
    SMS_CONFIRM_FAILURE
} from "../actions/waitlist.js"

const initialState = {
    isSmsAuthenticating: false,
    errorSmsAuthenticating: null,
    isClaimingUsername: false,
    errorClaimingUsername: null,
    username: null,
    splashtagOnHold: null,
    phoneNumber: null,
    countryName: null,
    smsAuthenticated: false,
    isSmsConfirming: false,
    errorSmsConfirming: null,
    waitlisted: true
}

export default function waitlistReducer(state = initialState, action) {
    switch (action.type) {

        case CLAIM_USERNAME_INIT:
            return {
                ...state,
                isClaimingUsername: true
            }

        case CLAIM_USERNAME_SUCCESS:
            return {
                ...state,
                isClaimingUsername: false,
                username: action.username
            }

        case CLAIM_USERNAME_FAILURE:
            return {
                ...state,
                isClaimingUsername: false,
                errorClaimingUsername: action.error
            }

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
            return {
                ...state,
                isSmsAuthenticating: false,
                errorSmsAuthenticating: action.error
            }

        case SMS_CONFIRM_INIT:
            return {
                ...state,
                isSmsConfirming: true,
            }

        case SMS_CONFIRM_SUCCESS:
            return {
                ...state,
                isSmsConfirming: false,
                smsAuthenticated: true,
            }

        case SMS_CONFIRM_FAILURE:
            return {
                ...state,
                isSmsConfirming: false,
                errorSmsConfirming: action.error
            }


        default:
            return state
    }
}
