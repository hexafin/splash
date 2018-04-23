import api from "../../api";
var axios = require("axios");
import firebase from "react-native-firebase";
let firestore = firebase.firestore();
let analytics = firebase.analytics();
import { NavigationActions } from "react-navigation";
analytics.setAnalyticsCollectionEnabled(true);
import { cryptoUnits } from '../../lib/cryptos'
import { hexaBtcAddress } from '../../../env/keys.json'

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
				await api.UpdateTransaction(transaction.transactionId, {approved: true, txId: txid})
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
