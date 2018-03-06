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
export function smsAuthInit(phoneNumber, countryName) {
    return {type: SMS_AUTH_INIT, phoneNumber, countryName}
}

export const SMS_AUTH_SUCCESS = "SMS_AUTH_SUCCESS"
export function smsAuthSuccess(token) {
    return {type: SMS_AUTH_SUCCESS, token}
}

export const SMS_AUTH_FAILURE = "SMS_AUTH_FAILURE"
export function smsAuthFailure(error) {
    return {type: SMS_AUTH_FAILURE, error}
}

export const HOLD_SPLASHTAG = "SPLASHTAG_ON_HOLD"
export function holdSplashtag(splashtag, phoneNumber) {
    return {type: HOLD_SPLASHTAG, splashtag, phoneNumber}
}

export const ClaimUsername = (username) => {
    return(dispatch, getState) => {
        dispatch(claimUsernameInit())

        // check to see if username is available
        api.CheckUsername(username).then(exists => {
            if (exists) {
                dispatch(claimUsernameFailure("taken"))
            } else {
                // TODO: create waitlist entry with username
                // firestore.collection("waitlist")
                dispatch(claimUsernameSuccess(username))
            }
        }).catch(error => {
            dispatch(claimUsernameFailure(error))
        })
    }
}

export const getDeepLinkedSplashtag = (splashtag, phoneNumber) => {
    return(dispatch, getState) => {
        const state = getState()
        if (!(splashtag == state.waitlist.splashtagOnHold && phoneNumber == state.waitlist.phoneNumber)) {
            dispatch(holdSplashtag(splashtag, phoneNumber))
        }
    }
}

export const SmsAuthenticate = (phoneNumber, countryName) => {
    return(dispatch, getState) => {
        return new Promise(function(resolve, reject) {
            const state = getState()
            dispatch(smsAuthInit(phoneNumber, countryName))
            // TODO:
            resolve(true)
        })
    }
}

export const InviteFriends = () => {}
