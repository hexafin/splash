import firebase from 'react-native-firebase'
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

import {
    SMS_AUTH_INIT,
    SMS_AUTH_SUCCESS,
    SMS_AUTH_FAILURE,
    CLAIM_USERNAME_INIT,
    CLAIM_USERNAME_SUCCESS,
    CLAIM_USERNAME_FAILURE
} from "../actions/waitlist.js"

const initialState = {
    isSmsAuthenticating: false,
    errorSmsAuthenticating: null,
    isClaimingUsername: false,
    errorClaimingUsername: null,
    username: null,
    smsAuthenticated: false
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

        case SMS_AUTH_INIT:
            return {
                ...state,
                isSmsAuthenticating: true
            }

        case SMS_AUTH_SUCCESS:
            return {
                ...state,
                isSmsAuthenticating: false,
                smsAuthenticated: true,
                smsAuthenticationToken: action.token
            }

        case SMS_AUTH_FAILURE:
            return {
                ...state,
                isSmsAuthenticating: false,
                errorSmsAuthenticating: action.error
            }

        default:
            return state
    }
}
