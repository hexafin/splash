import firebase from 'react-native-firebase'
import {Sentry} from 'react-native-sentry'
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

import {
    APPROVE_TRANSACTION_INIT,
    APPROVE_TRANSACTION_SUCCESS,
    APPROVE_TRANSACTION_FAILURE,
    DISMISS_TRANSACTION
} from "./actions.js"

const initialState = {
  isApprovingTransaction: false,
  pendingTransaction: {},
  approveTransactionError: null,
  approveTransactionSuccess: false,
}

export default function transactionReducer(state = initialState, action) {
    switch (action.type) {

      case DISMISS_TRANSACTION:
          return {
              ...state,
              isApprovingTransaction: false,
              approveTransactionSuccess: false,
              approveTransactionError: null,
              pendingTransaction: {}
          }

        case APPROVE_TRANSACTION_INIT:
            return {
                ...state,
                isApprovingTransaction: true,
                approveTransactionSuccess: false,
                pendingTransaction: action.transaction
            }

        case APPROVE_TRANSACTION_SUCCESS:
            return {
                ...state,
                isApprovingTransaction: false,
                approveTransactionSuccess: true,
                pendingTransaction: {},
            }

        case APPROVE_TRANSACTION_FAILURE:
            return {
                ...state,
                approveTransactionError: action.error,
                pendingTransaction: {},
                isApprovingTransaction: false,
                approveTransactionSuccess: false,
            }

        default:
            return state
    }
}
