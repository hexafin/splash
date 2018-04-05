import api from "../../api";
var axios = require("axios");
import firebase from "react-native-firebase";
let firestore = firebase.firestore();
let analytics = firebase.analytics();
import { NavigationActions } from "react-navigation";
analytics.setAnalyticsCollectionEnabled(true);
import { cryptoUnits } from '../../lib/cryptos'
// import { hexaBtcAddress } from '../../env/keys.json' uncomment this

// TODO clean this file before merge (address all comments)

import NavigatorService from "../navigator";

export const APPROVE_TRANSACTION_INIT = "APPROVE_TRANSACTION_INIT";
export function approveTransactionInit(transaction) {
	return { type: APPROVE_TRANSACTION_INIT, transaction };
}

export const APPROVE_TRANSACTION_SUCCESS = "APPROVE_TRANSACTION_SUCCESS";
export function approveTransactionSuccess() {
	return { type: APPROVE_TRANSACTION_SUCCESS };
}

export const APPROVE_TRANSACTION_FAILURE = "APPROVE_TRANSACTION_FAILURE";
export function approveTransactionFailure(error) {
	return { type: APPROVE_TRANSACTION_FAILURE, error };
}

export const ApproveTransaction = (transaction) => {
	return (dispatch, getState) => {

		const approveTransaction = async (transaction) => {
			const state = getState()
			// const privateKey = state.user.btcPrivateKey
			// const userBtcAddress = state.user.btcAddress
			const privateKey = '923wtnjvBfgQmdXoahtHfYAgpQvbN1oziBm7udTeSf6zvynhf2q'
			const userBtcAddress = 'mnQ721k3BDzKXbaCsPMk8nC7ogBRs6Rtmo'
			const hexaBtcAddress = 'miWRTjQr21jNKN9u2wdBt284ZsgdRjnuwJ' //delete this
			console.log(transaction);
			dispatch(approveTransactionInit(transaction))
			try {
				const exchangeRate = await api.GetExchangeRate()
				const btcAmount = 1.0*transaction.relativeAmount/exchangeRate[transaction.relativeCurrency]
				const feeSatoshi = await api.GetBitcoinFees({network: 'testnet', from: userBtcAddress, amtSatoshi: btcAmount*cryptoUnits.BTC})
				const totalbtcAmount = btcAmount + 1.0*(feeSatoshi/cryptoUnits.BTC)
				console.log(totalbtcAmount);
				const {txid, txhex} = await api.BuildBitcoinTransaction(userBtcAddress, hexaBtcAddress, privateKey, totalbtcAmount)
				console.log(txid, txhex)
				await api.UpdateTransaction(transaction.transactionId, {approved: true, txId: txid})
				return Promise.resolve();
			} catch (e) {
				return Promise.reject(e)
			}
		}

		approveTransaction(transaction).then(() => {
			dispatch(approveTransactionSuccess())
		}).catch(error => {
			dispatch(approveTransactionFailure(error))
		})
	}
}