
import {Actions} from "react-native-router-flux"
import api from "../api"
const SATOSHI_CONVERSION = 100000000;

export const GET_TRANSACTIONS_INIT = "GET_TRANSACTIONS_INIT";
export function getTransactionsInit() {
    return {type: GET_TRANSACTIONS_INIT}
}

export const GET_TRANSACTIONS_SUCCESS = "GET_TRANSACTIONS_SUCCESS";
export function getTransactionsSuccess(transactions) {
    return {type: GET_TRANSACTIONS_SUCCESS, transactions}
}

export const GET_TRANSACTIONS_FAILURE = "GET_TRANSACTIONS_FAILURE";
export function getTransactionsFailure() {
    return {type: GET_TRANSACTIONS_FAILURE}
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

export const CreateTransaction = ({type, other_person, emoji, amtUSD, amtBTC}) => {
  return (dispatch, getState) => {
    //TODO: fee handling and requests
    //TODO: make sure has enough balance

    const state = getState();
    const uid = state.general.uid;
    const balance = state.general.crypto.BTC.balance
    const satoshi = Math.floor(amtBTC*SATOSHI_CONVERSION);

    dispatch(newTransactionInit());

    if (type == 'pay' && satoshi < balance) {
      api.GetUidFromFB(other_person.facebook_id).then(toId => {
        if (type == 'pay') {

          const transaction = {
            from_id: uid,
            to_id: toId,
            amount: satoshi,
            fee: null,
            relative_amount: amtUSD,
            emoji: emoji
          }

          api.NewTransaction(transaction).then(receipt => {
            const btcAmount = (receipt.amount/SATOSHI_CONVERSION).toFixed(4)
            Actions.receipt({...receipt, type: undefined, transactionType: type, to: other_person, amount: btcAmount}); // w/ tran info
            dispatch(newTransactionSuccess());
          }).catch(error => {
            dispatch(newTransactionFailure(error))
          })
        }

      }).catch(error => {
        dispatch(newTransactionFailure(error))
      })
    } else {
      dispatch(newTransactionFailure('Error: not enough BTC'))
    }
  }
}
