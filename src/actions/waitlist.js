import api from "../api"
var axios = require('axios')
import firebase from 'react-native-firebase'
let firestore = firebase.firestore()
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

export const CLAIM_USERNAME_INIT = "CLAIM_USERNAME_INIT"
export function claimUsernameInit() {
    return {type: CLAIM_USERNAME_INIT}
}

export const CLAIM_USERNAME_SUCCESS = "CLAIM_USERNAME_SUCCESS"
export function claimUsernameSuccess(username) {
    return {type: CLAIM_USERNAME_SUCCESS, username}
}

export const CLAIM_USERNAME_FAILURE = "CLAIM_USERNAME_FAILURE"
export function claimUsernameFailure(error) {
    return {type: CLAIM_USERNAME_FAILURE, error}
}

export const SMS_AUTH_INIT = "SMS_AUTH_INIT"
export function smsAuthInit() {
    return {type: SMS_AUTH_INIT}
}

export const SMS_AUTH_SUCCESS = "SMS_AUTH_SUCCESS"
export function smsAuthSuccess(token) {
    return {type: SMS_AUTH_SUCCESS, token}
}

export const SMS_AUTH_FAILURE = "SMS_AUTH_FAILURE"
export function smsAuthFailure(error) {
    return {type: SMS_AUTH_FAILURE, error}
}

export const ClaimUsername = (username) => {
    return (dispatch, getState) => {
        dispatch(claimUsernameInit())

        // check to see if username is available
        api.CheckUsername(username).then(exists => {
            if (exists) {
                dispatch(claimUsernameFailure("taken"))
            }
            else {
                // TODO: create waitlist entry with username
                // firestore.collection("waitlist")
                dispatch(claimUsernameSuccess(username))
            }
        }).catch(error => {
            dispatch(claimUsernameFailure(error))
        })
    }
}

export const InviteFriends = () => {}
