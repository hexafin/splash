import firebase from 'react-native-firebase'
import {Sentry} from 'react-native-sentry'
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

import {
    APPROVE_TRANSACTION_INIT,
    APPROVE_TRANSACTION_SUCCESS,
    APPROVE_TRANSACTION_FAILURE,
} from "./actions.js"

const initialState = {
  isApprovingTransaction: false,
  pendingTransaction: {},
  approveTransactionError: null,
}

export default function transactionReducer(state = initialState, action) {
    switch (action.type) {

        case APPROVE_TRANSACTION_INIT:
            return {
                ...state,
                isApprovingTransaction: true,
                pendingTransaction: action.transaction
            }

        case APPROVE_TRANSACTION_SUCCESS:
            return {
                ...state,
                isApprovingTransaction: false,
                pendingTransaction: {},
            }

        case APPROVE_TRANSACTION_FAILURE:
            return {
                ...state,
                approveTransactionError: action.error,
                pendingTransaction: {},
                isApprovingTransaction: false,
            }

        default:
            return state
    }
}
