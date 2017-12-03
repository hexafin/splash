
import {Actions} from "react-native-router-flux"
import api from "../api"

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









