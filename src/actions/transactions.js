import {Actions} from "react-native-router-flux"
import api from "../api"

const SATOSHI_CONVERSION = 100000000;

export const GET_TRANSACTIONS_INIT = "GET_TRANSACTIONS_INIT";

export function getTransactionsInit() {
    return {type: GET_TRANSACTIONS_INIT}
}

export const GET_TRANSACTIONS_SUCCESS = "GET_TRANSACTIONS_SUCCESS";
export function getTransactionsSuccess(transactions, requests, waiting) {
    return {type: GET_TRANSACTIONS_SUCCESS, transactions, requests, waiting}
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
export function acceptTransactionFailure(error) {
    return {type: ACCEPT_TRANSACTION_FAILURE, error}
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
export function declineTransactionFailure(error) {
    return {type: DECLINE_TRANSACTION_FAILURE, error}
}

export const DELETE_TRANSACTION_INIT = "DELETE_TRANSACTION_INIT";
export function deleteTransactionInit(transactionRef) {
    return {type: DELETE_TRANSACTION_INIT, transactionRef}
}

export const DELETE_TRANSACTION_SUCCESS = "DELETE_TRANSACTION_SUCCESS";
export function deleteTransactionSuccess(transactionRef) {
    return {type: DELETE_TRANSACTION_SUCCESS, transactionRef}
}

export const DELETE_TRANSACTION_FAILURE = "DELETE_TRANSACTION_FAILURE";
export function deleteTransactionFailure(error) {
    return {type: DELETE_TRANSACTION_FAILURE, error}
}

export const REMIND_TRANSACTION_INIT = "REMIND_TRANSACTION_INIT";
export function remindTransactionInit(transactionRef) {
    return {type: REMIND_TRANSACTION_INIT, transactionRef}
}

export const REMIND_TRANSACTION_SUCCESS = "REMIND_TRANSACTION_SUCCESS";
export function remindTransactionSuccess(transactionRef) {
    return {type: REMIND_TRANSACTION_SUCCESS, transactionRef}
}

export const REMIND_TRANSACTION_FAILURE = "REMIND_TRANSACTION_FAILURE";
export function remindTransactionFailure(error) {
    return {type: REMIND_TRANSACTION_FAILURE, error}
}

export const REMOVE_REQUEST = "REMOVE_REQUEST";
export function removeRequest(transactionRef) {
    return {type: REMOVE_REQUEST, transactionRef}
}

export const REMOVE_WAITING = "REMOVE_WAITING";
export function removeWaiting(transactionRef) {
    return {type: REMOVE_WAITING, transactionRef}
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
        const exchangeRate = state.general.exchangeRate.BTC.USD
        const satoshi = Math.floor(amount * SATOSHI_CONVERSION);
        let transaction = {}

        dispatch(newTransactionInit());

        if ((transactionType == 'send' && satoshi < balance) || transactionType == 'request') {
            api.GetUidFromFB(other_person.facebook_id).then(otherId => {

                if (transactionType == 'send') {

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
                    const btcAmount = transactionType == 'send' ? (receipt.amount / SATOSHI_CONVERSION).toFixed(4) : (relative_amount/exchangeRate).toFixed(4)
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

export const AcceptConfirmation = (requestId) => {
  return (dispatch, getState) => {
    const state = getState()
    const exchangeRate = state.general.exchangeRate.BTC.USD
    const balance = state.crypto.BTC.balance

    let request = {}
    for (r of state.transactions.requests) {
      if (r.key == requestId) {
        request = r
      }
    }
    if (balance > (request.relative_amount/exchangeRate)*SATOSHI_CONVERSION) {

      const action = AcceptRequest(requestId, request)
      const callback = () => action(dispatch, getState)

      Actions.notify({
                      emoji: "💵",
                      title: 'Accept Request',
                      text: 'You are sending @' + request.username + " $" + request.relative_amount,
                      buttonText: "Confirm",
                      callback: callback
                    })

    } else {
      Actions.notify({
                      emoji: "❌",
                      title: 'insufficient Funds',
                      text: 'You do not have enough balance to process that transaction',
                      buttonText: "Dismiss",
                    })
    }

  }
}



export const AcceptRequest = (requestId, request) => {
  return (dispatch, getState) => {

    const state = getState()
    const exchangeRate = state.general.exchangeRate.BTC.USD
    const balance = state.crypto.BTC.balance
    dispatch(acceptTransactionInit(requestId))
    const relativeAmount = request.relative_amount
    // check balance before letting accept
    if (balance > (relativeAmount/exchangeRate)*SATOSHI_CONVERSION) {
      const dateTime = Date.now();
      const timestamp = Math.floor(dateTime / 1000);

      const updateDict = {
        accepted: true,
        // amount: amount,
        timestamp_accepted: timestamp,
      }

      api.UpdateRequest(requestId, updateDict).then(response => {

        api.NewTransactionFromRequest(requestId, exchangeRate, balance, timestamp).then(() => {

          dispatch(removeRequest(requestId))
          dispatch(acceptTransactionSuccess(requestId))

        }).catch(error => {
          dispatch(acceptTransactionFailure(error))
        })

      }).catch(error => {
        dispatch(acceptTransactionFailure(error))
      })
    } else {
      dispatch(acceptTransactionFailure("Error: insufficient balance"))
    }
  }
}

export const DeclineRequest = (requestId) => {
  return (dispatch, getState) => {
    dispatch(declineTransactionInit(requestId))
    const dateTime = Date.now();
    const timestamp_declined = Math.floor(dateTime / 1000);
    const updateDict = {
      declined: true,
      timestamp_declined: timestamp_declined,
    }

    api.UpdateRequest(requestId, updateDict).then(response => {
      dispatch(removeRequest(requestId))
      dispatch(declineTransactionSuccess(requestId))

    }).catch(error => {
      dispatch(declineTransactionFailure(error))
    })
  }
}

export const DeleteRequest = (requestId) => {
  return (dispatch, getState) => {
    dispatch(deleteTransactionInit(requestId))
    api.RemoveRequest(requestId).then(() => {
      dispatch(removeWaiting(requestId))
      dispatch(deleteTransactionSuccess(requestId))
    }).catch(error => {
      dispatch(deleteTransactionFailure(error))
    })
  }
}

export const RemindRequest = (requestId) => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(remindTransactionInit(requestId))
    let number_of_reminders = 0
    for (request of state.transactions.waiting) {
      if (request.key == requestId) {
        number_of_reminders = request.number_of_reminders
      }
    }

    api.UpdateRequest(requestId, {number_of_reminders: number_of_reminders+1}).then(response => {
      dispatch(remindTransactionSuccess(requestId))
    }).catch(error => {
      dispatch(remindTransactionFailure(error))
    })
  }
}

export const LoadTransactions = (uid) => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(getTransactionsInit())
    const payments = api.LoadTransactions(state.general.uid, 'transaction')
    const requests = api.LoadTransactions(state.general.uid, 'request')
    Promise.all([payments, requests]).then(values => {
      dispatch(getTransactionsSuccess(values[0], values[1].requests, values[1].waiting))
    }).catch(error => {
      dispatch(getTransactionsFailure(error))
    })
  }
}
