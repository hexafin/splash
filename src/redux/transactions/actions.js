import api, { Errors } from "../../api";
import { sendTransaction, AddETHTransactions, ETHEREUM_ERRORS } from "../../ethereum-api"
var axios = require("axios");
import firebase from "react-native-firebase";
let firestore = firebase.firestore();
let analytics = firebase.analytics();
import { NavigationActions } from "react-navigation";
import * as Keychain from 'react-native-keychain';
import { Sentry } from "react-native-sentry";

analytics.setAnalyticsCollectionEnabled(true);
import { cryptoUnits, cryptoNames, erc20Names } from '../../lib/cryptos'
import { hexaBtcAddress } from '../../../env/keys.json'
import moment from "moment"



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
export function loadTransactionsSuccess(transactions, currency) {
	return { type: LOAD_TRANSACTIONS_SUCCESS, transactions, currency };
}

export const LOAD_TRANSACTIONS_FAILURE = "LOAD_TRANSACTIONS_FAILURE"
export function loadTransactionsFailure(error) {
	return { type: LOAD_TRANSACTIONS_FAILURE, error };
}

export const CAPTURE_QR = "CAPTURE_QR"
export function captureQr(address) {
	return { type: CAPTURE_QR, address }
}

export const RESET_QR = "RESET_QR"
export function resetQr() {
	return { type: RESET_QR }
}

export const LoadTransactions = (currency="BTC") => {
	return async (dispatch, getState) => {

		const state = getState()

		const loadQuery = (query, transactions) => {
			for (var i = 0, len = query.docs.length; i < len; i++) {
				const doc = query.docs[i]
				const transaction = {
					id: doc.id,
					...doc.data(),
				}
				if (transaction.type == 'card' && transaction.approved === true) {
					transactions.push(transaction)
				} else if (transaction.type == "blockchain") {
					transactions.push(transaction)
				}
			}
			return transactions
		}

		try {
			let walletAddress
			if (erc20Names.indexOf(currency) > -1) {
				walletAddress = state.crypto.wallets.ETH.address
			} else {
				walletAddress = state.crypto.wallets[currency].address
			}
			if (currency != "BTC") walletAddress = walletAddress.toLowerCase()
			if (currency=="BTC") {
				await api.AddBTCTransactions(state.crypto.wallets.BTC.address, state.user.id, state.user.entity.splashtag, state.crypto.wallets.BTC.network)
			} else {
				await AddETHTransactions(state.crypto.wallets.ETH.address, state.user.id, state.user.entity.splashtag, currency, state.crypto.wallets.ETH.network)
			}
			dispatch(loadTransactionsInit())

			// two listeners for each firebase property
			// after one listener finds changes merges in the documents found from the other
			querySnapshot = await firestore.collection("transactions").where("toAddress", "==", walletAddress)
															 .where("currency", "==", currency).get() 
			// this is a snapshot of the user's transactions => redux will stay up to date with firebase
			let transactions = []
			if (querySnapshot.size > 0) {
				const query = await firestore.collection("transactions").where("fromAddress", "==", walletAddress)
																		.where("currency", "==", currency).get()
				transactions = loadQuery(query, transactions)
				transactions = loadQuery(querySnapshot, transactions)
				transactions.sort(function(a, b) { return b.timestamp - a.timestamp; });
				dispatch(loadTransactionsSuccess(transactions, currency))

			} else {
				dispatch(loadTransactionsSuccess(transactions, currency))
			}

		} catch (error) {
			if (error != Errors.NETWORK_ERROR) Sentry.captureMessage(error)
			dispatch(loadTransactionsFailure(error))			
		}
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
			const network = state.crypto.wallets.BTC.network
			const privateKey = JSON.parse(await Keychain.getGenericPassword().password)[network].wif
			const userBtcAddress = state.user.bitcoin.address
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
			Sentry.captureMessage(error)
			dispatch(approveTransactionFailure(error))
		})
	}
}


export const SendTransaction = (toAddress, unitAmount, fee, relativeAmount, toId, toSplashtag, currency="BTC") => {
	return (dispatch, getState) => {
    
    return new Promise((resolve, reject) => {

    	if (cryptoNames.indexOf(currency) < 0) {
    		const error = `Send transaction: unsupported currency: ${currency}`
				Sentry.captureMessage(error)
    		dispatch(sendTransactionFailure(error))	
        reject(error)
    	}

      const state = getState()
      const walletCurrency = (currency == 'BTC') ? 'BTC' : 'ETH'
      let userAddress = state.crypto.wallets[walletCurrency].address
      const network = state.crypto.wallets[walletCurrency].network
      const totalUnitAmount = unitAmount+fee

      if (currency != 'BTC') userAddress = userAddress.toLowerCase() // store eth addresses in lower case

      let transaction = {
        amount: {
          subtotal: unitAmount,
          total: totalUnitAmount,
          fee: fee,
        },
        currency: currency,
        relativeAmount: relativeAmount,
        relativeCurrency: 'USD',
        type: 'blockchain',
        pending: true,
        thanked: false,
        confirmations: 0,
        timestamp: moment().unix(),
        toAddress: toAddress,
        fromId: state.user.id,	
        fromSplashtag: state.user.entity.splashtag,
        fromAddress: userAddress,
      }
      if (toId) transaction.toId = toId
      if (toSplashtag) transaction.toSplashtag = toSplashtag

      dispatch(sendTransactionInit())

  	  if (currency == 'BTC') {
	      Keychain.getGenericPassword().then(data => {
	        const privateKey = JSON.parse(data.password)[walletCurrency][network].wif
	        api.BuildBitcoinTransaction({from: userAddress, to:toAddress, privateKey, amtSatoshi: totalUnitAmount, fee: fee, network}).then(response => {
	          const {txid, txhex} = response
	          transaction.txId = txid

	          api.NewTransaction(transaction).then(() => {
	            dispatch(sendTransactionSuccess())
	            resolve()
	          }).catch(error => {
	          	Sentry.captureMessage(error)
	            dispatch(sendTransactionFailure(error))	
	            reject(error)
	          })
	        }).catch(error => {
			  if (error != Errors.NETWORK_ERROR) Sentry.captureMessage(error)
	          dispatch(sendTransactionFailure(error))
	          reject(error)
	        })
	      })

  	  } else {
  	  	sendTransaction({fromAddress: userAddress, toAddress: toAddress, weiAmount: unitAmount, currency: currency, network}).then(transactionHash => {
          transaction.txId = transactionHash
          api.NewTransaction(transaction).then(() => {
            dispatch(sendTransactionSuccess())
            resolve()
          }).catch(error => {
          	Sentry.captureMessage(error)
            dispatch(sendTransactionFailure(error))	
            reject(error)
          })
        }).catch(error => {
		  if (error != ETHEREUM_ERRORS.NETWORK_ERROR) Sentry.captureMessage(error)
          dispatch(sendTransactionFailure(error))
          reject(error)
        })
  	  }
      
    })

	}
}

export const DismissTransaction = () => {
	return (dispatch, getState) => {
		dispatch(dismissTransaction())
	}
}
