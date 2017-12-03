
import {
    NEW_TRANSACTION_INIT,
    NEW_TRANSACTION_SUCCESS,
    NEW_TRANSACTION_FAILURE
} from "../actions/transactions";

import {
    SIGN_OUT
} from "../actions/general"

var initialState = {
    items: [],
    isCreatingTransaction: false,
    transactionBeingCreated: null
};

export default function transactionsReducer(state = initialState, action) {
    switch(action.type) {

        case NEW_TRANSACTION_INIT:

            return {
                ...state,
                isCreatingTransaction: true,
                transactionBeingCreated: action.transaction
            }

        case NEW_TRANSACTION_SUCCESS:
            return {
                ...state,
                items: state.items.push(action.transaction),
                isCreatingTransaction: false,
                transactionBeingCreated: null
            }

        case NEW_TRANSACTION_FAILURE:
            return {
                ...state,
                isCreatingTransaction: false,
                transactionBeingCreated: null,
                errorCreatingTransaction: action.error
            }

        case SIGN_OUT:
            return initialState

        default:
            return state

    }
}



