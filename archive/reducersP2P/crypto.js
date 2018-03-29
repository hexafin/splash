import firebase from 'react-native-firebase'
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

import {
    CRYPTO_INIT,
    CRYPTO_SUCCESS,
    CRYPTO_FAILURE
} from "../actions/crypto.js"

const initialState = {
    loading: false,
    error: null,
    BTC: {
        balance: 0,
        address: null
    },
    BCH: {
        balance: 0,
        address: null
    },
    ETH: {
        balance: 0,
        address: null
    },
    LTC: {
        balance: 0,
        address: null
    }
}

export default function cryptoReducer(state = initialState, action) {
    switch (action.type) {

        case CRYPTO_INIT:
            return {
                ...state,
                loading: true
            }

        case CRYPTO_SUCCESS:
            return {
                ...state,
                loading: false,
                ...action.crypto
            }

        case CRYPTO_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.error
            }

        default:
            return state
    }
}