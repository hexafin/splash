
import {
    GET_TRANSACTIONS_INIT,
    GET_TRANSACTIONS_SUCCESS,
    GET_TRANSACTIONS_FAILURE,
    DECLINE_TRANSACTION_INIT,
    DECLINE_TRANSACTION_SUCCESS,
    DECLINE_TRANSACTION_FAILURE,
    NEW_TRANSACTION_INIT,
    NEW_TRANSACTION_SUCCESS,
    NEW_TRANSACTION_FAILURE,
    REMOVE_REQUEST,
    REMOVE_WAITING
} from "../actions/transactions";

import {
    SIGN_OUT
} from "../actions/general"

var initialState = {
    transactions: [],
    requests: [],
    waiting: [],
    isLoadingTransactions: false,
    errorLoadingTransactions: null,
    isCreatingTransaction: false,
    errorCreatingTransaction: null,
    isDecliningRequest: false,
    errorDecliningRequest: null,
};

export default function transactionsReducer(state = initialState, action) {
    switch(action.type) {

      case GET_TRANSACTIONS_INIT:

          return {
              ...state,
              errorLoadingTransactions: null,
              isLoadingTransactions: true,
          }

      case GET_TRANSACTIONS_SUCCESS:

          return {
              ...state,
              errorLoadingTransactions: null,
              transactions: action.transactions,
              requests: action.requests,
              waiting: action.waiting,
              isLoadingTransactions: false,

          }

      case GET_TRANSACTIONS_FAILURE:

          return {
              ...state,
              isLoadingTransactions: false,
              errorLoadingTransactions: action.error,

          }

        case DECLINE_TRANSACTION_INIT:

            return {
                ...state,
                errorDecliningRequest: null,
                isDecliningRequest: true,
            }

        case DECLINE_TRANSACTION_SUCCESS:

            return {
                ...state,
                errorDecliningRequest: null,
                isDecliningRequest: false,

            }

        case DECLINE_TRANSACTION_FAILURE:

            return {
                ...state,
                isDecliningRequest: false,
                errorDecliningRequest: action.error,

            }

        case NEW_TRANSACTION_INIT:

            return {
                ...state,
                isCreatingTransaction: true,
                errorCreatingTransaction: null,
            }

        case NEW_TRANSACTION_SUCCESS:

            return {
                ...state,
                errorCreatingTransaction: null,
                isCreatingTransaction: false,
            }

        case NEW_TRANSACTION_FAILURE:

            return {
                ...state,
                isCreatingTransaction: false,
                errorCreatingTransaction: action.error
            }

        case REMOVE_REQUEST:
            let newRequests = []
            for(var i = 0; i<state.requests; i++) {
              if(state.requests[i].key !== action.transactionRef) {
                newRequests.push(state.requests[i])
              }
            }
            return {
                ...state,
                requests: newRequests
            }

        case REMOVE_WAITING:
            let newWaiting = []
            for(var i = 0; i<state.waiting; i++) {
              if(state.waiting[i].key !== action.transactionRef) {
                newWaiting.push(state.waiting[i])
              }
            }
            return {
                ...state,
                waiting: newWaiting
            }

        case SIGN_OUT:
            return initialState

        default:
            return state

    }
}
