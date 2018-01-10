import {Actions} from "react-native-router-flux"
import api from "../api"

const SATOSHI_CONVERSION = 100000000;

export const GET_TRANSACTIONS_INIT = "GET_TRANSACTIONS_INIT";

export function getTransactionsInit() {
    return {type: GET_TRANSACTIONS_INIT}
}

export const GET_TRANSACTIONS_SUCCESS = "GET_TRANSACTIONS_SUCCESS";
export function getTransactionsSuccess(transactions, requests) {
    return {type: GET_TRANSACTIONS_SUCCESS, transactions, requests}
}

export const GET_TRANSACTIONS_FAILURE = "GET_TRANSACTIONS_FAILURE";

export function getTransactionsFailure(error) {
    return {type: GET_TRANSACTIONS_FAILURE, error}
}

export const NEW_TRANSACTION_INIT = "NEW_TRANSACTION_INIT";

export function newTransactionInit() {
    return {type: NEW_TRANSACTION_INIT,}
}

export const NEW_TRANSACTION_SUCCESS = "NEW_TRANSACTION_SUCCESS";

export function newTransactionSuccess() {
    return {type: NEW_TRANSACTION_SUCCESS}
}

export const NEW_TRANSACTION_FAILURE = "NEW_TRANSACTION_FAILURE";

export function newTransactionFailure(error) {
    return {type: NEW_TRANSACTION_FAILURE, error}
}

export const ACCEPT_TRANSACTION_INIT = "ACCEPT_TRANSACTION_INIT";

export function acceptTransactionInit(transactionRef) {
    return {type: ACCEPT_TRANSACTION_INIT, transactionRef}
}

export const ACCEPT_TRANSACTION_SUCCESS = "ACCEPT_TRANSACTION_SUCCESS";

export function acceptTransactionSuccess(transactionRef) {
    return {type: ACCEPT_TRANSACTION_SUCCESS, transactionRef}
}

export const ACCEPT_TRANSACTION_FAILURE = "ACCEPT_TRANSACTION_FAILURE";

export function acceptTransactionFailure(transactionRef) {
    return {type: ACCEPT_TRANSACTION_FAILURE, transactionRef}
}


export const DECLINE_TRANSACTION_INIT = "DECLINE_TRANSACTION_INIT";

export function declineTransactionInit(transactionRef) {
    return {type: DECLINE_TRANSACTION_INIT, transactionRef}
}

export const DECLINE_TRANSACTION_SUCCESS = "DECLINE_TRANSACTION_SUCCESS";

export function declineTransactionSuccess(transactionRef) {
    return {type: DECLINE_TRANSACTION_SUCCESS, transactionRef}
}

export const DECLINE_TRANSACTION_FAILURE = "DECLINE_TRANSACTION_FAILURE";

export function declineTransactionFailure(transactionRef) {
    return {type: DECLINE_TRANSACTION_FAILURE, transactionRef}
}


/**
 * Complex actions
 * **/

export const CreateTransaction = ({transactionType, other_person, emoji, relative_amount, amount}) => {
    return (dispatch, getState) => {
        //TODO: fee handling and requests

        const state = getState();
        const uid = state.general.uid;
        const balance = state.crypto.BTC.balance
        const satoshi = Math.floor(amount * SATOSHI_CONVERSION);
        let transaction = {}

        dispatch(newTransactionInit());

        if ((transactionType == 'transaction' && satoshi < balance) || transactionType == 'request') {
            api.GetUidFromFB(other_person.facebook_id).then(otherId => {

                if (transactionType == 'transaction') {

                    transaction = {
                        transactionType: transactionType,
                        from_id: uid,
                        to_id: otherId,
                        amount: satoshi,
                        fee: {amount: 0}, // TODO: use real fee
                        relative_amount: relative_amount,
                        emoji: emoji
                    }
                } else {

                    transaction = {
                        transactionType: transactionType,
                        from_id: otherId,
                        to_id: uid,
                        amount: satoshi,
                        fee: {amount: 0}, // TODO: use real fee
                        relative_amount: relative_amount,
                        emoji: emoji
                    }
                }


                api.NewTransaction(transaction).then(receipt => {
                    const btcAmount = (receipt.amount / SATOSHI_CONVERSION).toFixed(4)
                    Actions.receipt({
                        ...receipt,
                        type: undefined,
                        transactionType: transactionType,
                        to: other_person,
                        amount: btcAmount
                    }); // w/ tran info
                    dispatch(newTransactionSuccess());
                }).catch(error => {
                    dispatch(newTransactionFailure(error))
                })

            }).catch(error => {
                dispatch(newTransactionFailure(error))
            })
        } else {
            dispatch(newTransactionFailure('Error: not enough BTC'))
        }
    }
}

export const LoadTransactions = (uid) => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(getTransactionsInit())
    const payments = api.LoadTransactions(state.general.uid, 'transaction')
    const requests = api.LoadTransactions(state.general.uid, 'request')
    Promise.all([payments, requests]).then(values => {
      dispatch(getTransactionsSuccess(values[0], values[1]))
    }).catch(error => {
      dispatch(getTransactionsFailure(error))
    })
  }
}
