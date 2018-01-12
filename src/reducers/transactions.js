
import {
    GET_TRANSACTIONS_INIT,
    GET_TRANSACTIONS_SUCCESS,
    GET_TRANSACTIONS_FAILURE,
    NEW_TRANSACTION_INIT,
    NEW_TRANSACTION_SUCCESS,
    NEW_TRANSACTION_FAILURE
} from "../actions/transactions";

import {
    SIGN_OUT
} from "../actions/general"

var initialState = {
    transactions: [],
    requests: [],
    isLoadingTransactions: false,
    errorLoadingTransactions: null,
    isCreatingTransaction: false,
    errorCreatingTransaction: null
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
              isLoadingTransactions: false,

          }

      case GET_TRANSACTIONS_FAILURE:

          return {
              ...state,
              isLoadingTransactions: false,
              errorLoadingTransactions: action.error,

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

        case SIGN_OUT:
            return initialState

        default:
            return state

    }
}
