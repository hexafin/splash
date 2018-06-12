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
export function successApprovingTransaction() {
	return { type: APPROVE_TRANSACTION_SUCCESS };
}

export const APPROVE_TRANSACTION_FAILURE = "APPROVE_TRANSACTION_FAILURE";
export function approveTransactionFailure(error) {
	return { type: APPROVE_TRANSACTION_FAILURE, error };
}

export const SEND_TRANSACTION_INIT = "SEND_TRANSACTION_INIT";
export function sendTransactionInit() {
	return { type: SEND_TRANSACTION_INIT };
}

export const SEND_TRANSACTION_SUCCESS = "SEND_TRANSACTION_SUCCESS";
export function sendTransactionSuccess() {
	return { type: SEND_TRANSACTION_SUCCESS };
}

export const SEND_TRANSACTION_FAILURE = "SEND_TRANSACTION_FAILURE";
export function sendTransactionFailure(error) {
	return { type: SEND_TRANSACTION_FAILURE, error };
}

export const RESET_TRANSACTIONS = "RESET_TRANSACTIONS";
export function resetTransactions() {
	return { type: RESET_TRANSACTIONS };
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

export const UPDATE_EXCHANGE_RATE = "UPDATE_EXCHANGE_RATE"
export function updateExchangeRate(exchangeRate) {
	return { type: UPDATE_EXCHANGE_RATE, exchangeRate };
}

export const CAPTURE_QR = "CAPTURE_QR"
export function captureQr(address) {
	return { type: CAPTURE_QR, address }
}

export const RESET_QR = "RESET_QR"
export function resetQr() {
	return { type: RESET_QR }
}

export const LoadTransactions = () => {
	return (dispatch, getState) => {
		dispatch(loadTransactionsInit())

		const state = getState()


		api.AddBlockchainTransactions(state.user.bitcoin.address, state.user.id, state.user.bitcoinNetwork).then(() => {
			firestore.collection("transactions").where("userId", "==", state.user.id).orderBy('timestamp', 'desc').onSnapshot(querySnapshot => {
				// this is a snapshot of the user's transactions => redux will stay up to date with firebase
				let transactions = []
				querySnapshot.forEach(doc => {
					const transaction = {
						id: doc.id,
						...doc.data()
					}
					if (transaction.type == 'card' && transaction.approved === true) {
						transactions.push(transaction)
					} else if (transaction.type == "blockchain") {
						transactions.push(transaction)
					}
				})
				dispatch(loadTransactionsSuccess(transactions))
			}, error => {
				dispatch(loadTransactionsFailure(error))
			})

		}).catch(error => {
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
			const privateKey = state.user.bitcoin.wif
			const userBtcAddress = state.user.bitcoin.address
			const network = state.user.bitcoinNetwork
			dispatch(approveTransactionInit(transaction))
			try {
				// commented for demo
				const exchangeRate = await api.GetExchangeRate()
				const btcAmount = 1.0*transaction.relativeAmount/exchangeRate[transaction.relativeCurrency]
				const feeSatoshi = await api.GetBitcoinFees({network: network, from: userBtcAddress, amtSatoshi: btcAmount*cryptoUnits.BTC})
				const totalBtcAmount = btcAmount + 1.0*(feeSatoshi/cryptoUnits.BTC)
				const {txid, txhex} = await api.BuildBitcoinTransaction(userBtcAddress, hexaBtcAddress, privateKey, totalbtcAmount, network)
				await api.UpdateTransaction(transaction.transactionId, {
					approved: true,
					txId: txid,
					timestamp: moment().unix(),
					amount: totalBtcAmount,
					currency: "BTC"
				})
				await api.GenerateCard(transaction.transactionId)
				return Promise.resolve();
			} catch (e) {
				return Promise.reject(e)
			}
		}

		approveTransaction(transaction).then(transaction => {
			dispatch(successApprovingTransaction())
		}).catch(error => {
			dispatch(approveTransactionFailure(error))
		})
	}
}

export const SendTransaction = (toAddress, btcAmount, feeSatoshi, relativeAmount) => {
	return (dispatch, getState) => {

		return new Promise((resolve, reject) => {
			const state = getState()
			const privateKey = state.user.bitcoin.wif
			const userBtcAddress = state.user.bitcoin.address
			const network = state.user.bitcoinNetwork
			const totalBtcAmount = parseFloat(btcAmount)+parseFloat(feeSatoshi/cryptoUnits.BTC)

			let transaction = {
				amount: {
					subtotal: Math.floor(btcAmount*cryptoUnits.BTC),
					total: Math.floor(totalBtcAmount*cryptoUnits.BTC),
					fee: feeSatoshi,
				},
				currency: 'BTC',
				relativeAmount: relativeAmount,
				relativeCurrency: 'USD',
				type: 'blockchain',
				timestamp: moment().unix(),
				to: {
					address: toAddress
				},
				userId: state.user.id,
			}

			dispatch(sendTransactionInit())

			api.BuildBitcoinTransaction(userBtcAddress, toAddress, privateKey, totalBtcAmount, network).then(response => {
				const {txid, txhex} = response
				transaction.txId = txid
				api.NewTransaction(transaction).then(() => {
					dispatch(sendTransactionSuccess())
					resolve()
				}).catch(error => {
					dispatch(sendTransactionFailure(error))
					reject(error)		
				})
			}).catch(error => {
				dispatch(sendTransactionFailure(error))
				reject(error)
			})
		})

	}
}

export const DismissTransaction = () => {
	return (dispatch, getState) => {
		dispatch(dismissTransaction())
	}
}

export const UpdateExchangeRate = (exchangeRate) => {
	return (dispatch, getState) => {
		dispatch(updateExchangeRate(exchangeRate))
	}
}
