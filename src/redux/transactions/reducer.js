import firebase from 'react-native-firebase'
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

import {
    APPROVE_TRANSACTION_INIT,
    APPROVE_TRANSACTION_SUCCESS,
    APPROVE_TRANSACTION_FAILURE,
    SEND_TRANSACTION_INIT,
    SEND_TRANSACTION_SUCCESS,
    SEND_TRANSACTION_FAILURE,
    LOAD_TRANSACTIONS_INIT,
    LOAD_TRANSACTIONS_SUCCESS,
    LOAD_TRANSACTIONS_FAILURE,
    DISMISS_TRANSACTION,
    CAPTURE_QR,
    RESET_QR,
    RESET_TRANSACTIONS,
    UPDATE_EXCHANGE_RATE
} from "./actions.js"

const initialState = {
  isApprovingTransaction: false,
  pendingTransaction: {},
  transactions: [],
  errorApprovingTransaction: null,
  isLoadingTransactions: false,
  errorLoadingTransactions: null,
  isSendingTransaction: false,
  errorSendingTransaction: null,
  qrAddress: null
}

export default function transactionReducer(state = initialState, action) {
    switch (action.type) {

      case UPDATE_EXCHANGE_RATE:
          return {
            ...state,
            exchangeRates: action.exchangeRate,
          }

      case DISMISS_TRANSACTION:
          return {
              ...state,
              isApprovingTransaction: false,
              errorApprovingTransaction: null,
              isSendingTransaction: false,
              errorSendingTransaction: null,
              pendingTransaction: {}
          }

        case APPROVE_TRANSACTION_INIT:
            return {
                ...state,
                isApprovingTransaction: true,
                errorApprovingTransaction: null,
                pendingTransaction: action.transaction
            }

        case APPROVE_TRANSACTION_SUCCESS:
            return {
                ...state,
                isApprovingTransaction: false,
                errorApprovingTransaction: null,
                pendingTransaction: {}
            }

        case APPROVE_TRANSACTION_FAILURE:
            return {
                ...state,
                errorApprovingTransaction: action.error,
                pendingTransaction: {},
                isApprovingTransaction: false,
            }

        case SEND_TRANSACTION_INIT:
            return {
                ...state,
                isSendingTransaction: true,
                errorSendingTransaction: null,
            }

        case SEND_TRANSACTION_SUCCESS:
            return {
                ...state,
                isSendingTransaction: false,
                errorSendingTransaction: null,
            }

        case SEND_TRANSACTION_FAILURE:
            return {
                ...state,
                errorSendingTransaction: action.error,
                isSendingTransaction: false,
            }

        case RESET_TRANSACTIONS:
            return initialState
        
        case LOAD_TRANSACTIONS_INIT:
            return {
                ...state,
                isLoadingTransactions: true
            }

        case LOAD_TRANSACTIONS_SUCCESS:
            return {
                ...state,
                isLoadingTransactions: false,
                transactions: action.transactions
            }

        case LOAD_TRANSACTIONS_FAILURE:
            return {
                ...state,
                isLoadingTransactions: false,
                errorLoadingTransactions: action.error
            }

        default:
            return state
    }
}
