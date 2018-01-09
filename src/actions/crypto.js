import api from "../api"
var axios = require('axios')
import firebase from 'react-native-firebase'
let firestore = firebase.firestore()
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

export const CRYPTO_INIT = "CRYPTO_INIT"
export function cryptoInit() {
    return {type: CRYPTO_INIT}
}

export const CRYPTO_SUCCESS = "CRYPTO_SUCCESS"
export function cryptoSuccess(crypto) {
    return {type: CRYPTO_SUCCESS, crypto}
}

export const CRYPTO_FAILURE = "CRYPTO_FAILURE"
export function cryptoFailure(error) {
    return {type: CRYPTO_FAILURE, error}
}

export const CryptoLink = () => {
    return (dispatch, getState) => {

        dispatch(cryptoInit())

        const state = getState()

        firestore.collection("people").doc(state.general.uid).onSnapshot(snapshot => {
            const person = snapshot.data()
            dispatch(cryptoSuccess(person.crypto))
        }, error => {
            dispatch(cryptoFailure(error))
        })

    }
}