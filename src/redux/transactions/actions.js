import api from "../../api";
var axios = require("axios");
import firebase from "react-native-firebase";
let firestore = firebase.firestore();
let analytics = firebase.analytics();
import { NavigationActions } from "react-navigation";
analytics.setAnalyticsCollectionEnabled(true);
import { cryptoUnits } from '../../lib/cryptos'
import { hexaBtcAddress } from '../../../env/keys.json'
import moment from "moment"

import NavigatorService from "../navigator";

export const DISMISS_TRANSACTION = "DISMISS_TRANSACTION";
export function dismissTransaction() {
	return { type: DISMISS_TRANSACTION };
}

export const APPROVE_TRANSACTION_INIT = "APPROVE_TRANSACTION_INIT";
export function approveTransactionInit(transaction) {
	return { type: APPROVE_TRANSACTION_INIT, transaction };
}

export const APPROVE_TRANSACTION_SUCCESS = "APPROVE_TRANSACTION_SUCCESS";
export function successApprovingTransaction(transaction) {
	return { type: APPROVE_TRANSACTION_SUCCESS, transaction };
}

export const APPROVE_TRANSACTION_FAILURE = "APPROVE_TRANSACTION_FAILURE";
export function approveTransactionFailure(error) {
	return { type: APPROVE_TRANSACTION_FAILURE, error };
}

export const LOAD_TRANSACTIONS_INIT = "LOAD_TRANSACTIONS_INIT"
export function loadTransactionsInit() {
	return { type: LOAD_TRANSACTIONS_INIT };
}

export const LOAD_TRANSACTIONS_SUCCESS = "LOAD_TRANSACTIONS_SUCCESS"
export function loadTransactionsSuccess(transactions) {
	return { type: LOAD_TRANSACTIONS_SUCCESS, transactions };
}

export const LOAD_TRANSACTIONS_FAILURE = "LOAD_TRANSACTIONS_FAILURE"
export function loadTransactionsFailure(error) {
	return { type: LOAD_TRANSACTIONS_FAILURE, error };
}

export const LoadTransactions = () => {
	return (dispatch, getState) => {
		dispatch(loadTransactionsInit())

		const state = getState()

		firestore.collection("transactions").where("userId", "==", state.user.id).onSnapshot(querySnapshot => {
			// this is a snapshot of the user's transactions => redux will stay up to date with firebase
			let transactions = []
			querySnapshot.forEach(doc => {
				transactions.push({
					id: doc.id,
					...doc.data()
				})
			})
			dispatch(loadTransactionsSuccess(transactions))
		}, error => {
			dispatch(loadTransactionsFailure(error))
		})
	}
}


const getDate = () => {
	const date = new Date()
	const parts = date.toDateString().split(' ')
	return parts[1] + ' ' + parts[2] + ', ' + parts[3]
}

export const ApproveTransaction = (transaction) => {
	return (dispatch, getState) => {

		const approveTransaction = async (transaction) => {
			const state = getState()
			const privateKey = state.user.bitcoin.privateKey
			const userBtcAddress = state.user.bitcoin.address
			dispatch(approveTransactionInit(transaction))
			try {
				// commented for demo
				const exchangeRate = await api.GetExchangeRate()
				const btcAmount = 1.0*transaction.relativeAmount/exchangeRate[transaction.relativeCurrency]
				const feeSatoshi = await api.GetBitcoinFees({network: 'mainnet', from: userBtcAddress, amtSatoshi: btcAmount*cryptoUnits.BTC})
				const totalbtcAmount = btcAmount + 1.0*(feeSatoshi/cryptoUnits.BTC)
				// const {txid, txhex} = await api.BuildBitcoinTransaction(userBtcAddress, hexaBtcAddress, privateKey, totalbtcAmount)
				const txid = 1 // dummy data
				await api.UpdateTransaction(transaction.transactionId, {approved: true, txId: txid, timestampApproved: moment().unix()})
				await api.GenerateCard(transaction.transactionId)
				const record = {
													id: transaction.transactionId,
													type: "card",
													domain: transaction.domain,
													date: getDate(),
													amount: {
														USD: parseFloat(transaction.relativeAmount).toFixed(2),
														BTC: totalbtcAmount.toFixed(5)
													}
												}
				return Promise.resolve(record);
			} catch (e) {
				return Promise.reject(e)
			}
		}

		approveTransaction(transaction).then(transaction => {
			dispatch(successApprovingTransaction(transaction))
		}).catch(error => {
			dispatch(approveTransactionFailure(error))
		})
	}
}

export const DismissTransaction = () => {
	return (dispatch, getState) => {
		dispatch(dismissTransaction())
	}
}
