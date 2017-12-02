/*

Actions

 */

import {Actions} from "react-native-router-flux"
//import api from "../api"

/*
* Basic Action Creators
*/

export const NEW_ACCOUNT_INIT = "NEW_ACCOUNT_INIT";
export function newAccountInit() {
    return {type: NEW_ACCOUNT_INIT}
}

export const NEW_ACCOUNT_SUCCESS = "NEW_ACCOUNT_SUCCESS";
export function newAccountSuccess() {
    return {type: NEW_ACCOUNT_SUCCESS}
}

export const NEW_ACCOUNT_FAILURE = "NEW_ACCOUNT_FAILURE";
export function newAccountFailure() {
    return {type: NEW_ACCOUNT_FAILURE}
}

export const SIGN_IN_INIT = "SIGN_IN_INIT";
export function signInInit() {
    return {type: SIGN_IN_INIT}
}

export const SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS";
export function signInSuccess(person) {
    return {type: SIGN_IN_SUCCESS, person}
}

export const SIGN_IN_FAILURE = "SIGN_IN_FAILURE";
export function signInFailure(error) {
    return {type: SIGN_IN_FAILURE, error}
}

export const SIGN_OUT = "SIGN_OUT";
export function signOut() {
    return {type: SIGN_OUT}
}

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

// export const GET_FRIENDS_INIT = "GET_FRIENDS_INIT";
// export function getFriendsInit() {
//     return {type: GET_FRIENDS_INIT}
// }
//
// export const GET_FRIENDS_SUCCESS = "GET_FRIENDS_SUCCESS";
// export function getFriendsSuccess() {
//     return {type: GET_FRIENDS_SUCCESS}
// }
//
// export const GET_FRIENDS_FAILURE = "GET_FRIENDS_FAILURE";
// export function getFriendsFailure() {
//     return {type: GET_FRIENDS_FAILURE}
// }

export const NEW_TRANSACTION_INIT = "NEW_TRANSACTION_INIT";
export function newTransactionInit(transaction) {
    return {type: NEW_TRANSACTION_INIT, transaction}
}

export const NEW_TRANSACTION_SUCCESS = "NEW_TRANSACTION_SUCCESS";
export function newTransactionSuccess(transaction) {
    return {type: NEW_TRANSACTION_SUCCESS, transaction}
}

export const NEW_TRANSACTION_FAILURE = "NEW_TRANSACTION_FAILURE";
export function newTransactionFailure(transaction) {
    return {type: NEW_TRANSACTION_FAILURE, transaction}
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

/*
* Complex Actions
 */

// Sign in function
export const SignIn = () => {

    return (dispatch, getState) => {

        // if already signed in, navigate home
        const state = getState()
        if (state.general.signedIn) {
            Actions.home()
        }

        // initialize sign in
        dispatch(signInInit())

        // TODO: authenticate

        // assuming success
        dispatch(signInSuccess())
        Actions.home()
    }
}

export const NewAccount = (account) => {

    return (dispatch, getState) => {

        // initialize new account creation
        dispatch(newAccountInit())

        try {

            //api.NewAccount(account)

        }
        catch (error) {

            // error
            dispatch(newAccountFailure(error))

        }

    }

}









