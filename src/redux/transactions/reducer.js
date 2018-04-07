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
  errorApprovingTransaction: null,
  successApprovingTransaction: false,
}

export default function transactionReducer(state = initialState, action) {
    switch (action.type) {

      case DISMISS_TRANSACTION:
          return {
              ...state,
              isApprovingTransaction: false,
              successApprovingTransaction: false,
              errorApprovingTransaction: null,
              pendingTransaction: {}
          }

        case APPROVE_TRANSACTION_INIT:
            return {
                ...state,
                isApprovingTransaction: true,
                successApprovingTransaction: false,
                pendingTransaction: action.transaction
            }

        case APPROVE_TRANSACTION_SUCCESS:
            return {
                ...state,
                isApprovingTransaction: false,
                successApprovingTransaction: true,
                pendingTransaction: {},
            }

        case APPROVE_TRANSACTION_FAILURE:
            return {
                ...state,
                errorApprovingTransaction: action.error,
                pendingTransaction: {},
                isApprovingTransaction: false,
                successApprovingTransaction: false,
            }

        default:
            return state
    }
}
