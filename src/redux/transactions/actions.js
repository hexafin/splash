import api, { Errors } from "../../api";
import { sendETHTransaction, LoadETHTransactions, ETHEREUM_ERRORS } from "../../ethereum-api"
import { LoadBTCTransactions, GetBitcoinFees, BuildBitcoinTransaction } from "../../bitcoin-api"
import * as Keychain from 'react-native-keychain';
import { Sentry } from "react-native-sentry";
import { cryptoUnits, cryptoNames, erc20Names } from '../../lib/cryptos'
import { splashBtcAddress } from '../../../env/keys.json'
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

		try {
			dispatch(loadTransactionsInit())

			let transactions = []

			// get correct wallet address
			let walletAddress
			if (erc20Names.indexOf(currency) > -1) {
				walletAddress = state.crypto.wallets.ETH.address
			} else {
				walletAddress = state.crypto.wallets[currency].address
			}
			if (currency != "BTC") walletAddress = walletAddress.toLowerCase()

			// load transactions
			if (currency=="BTC") {
				transactions = await LoadBTCTransactions(state.crypto.wallets.BTC.address, state.user.id, state.user.entity.splashtag, state.crypto.wallets.BTC.network)
			} else {
				transactions = await LoadETHTransactions(state.crypto.wallets.ETH.address, state.user.id, state.user.entity.splashtag, currency, state.crypto.wallets.ETH.network)
			}

			if (transactions.length > 0) {
				// if transactions are loaded sort by timestamp and add to redux
				transactions.sort(function(a, b) { return b.timestamp - a.timestamp; });
				dispatch(loadTransactionsSuccess(transactions, currency))
				return transactions
			} else {
				dispatch(loadTransactionsSuccess(transactions, currency))
				return transactions
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
			dispatch(approveTransactionInit(transaction))
			try {
				// commented for demo
		        await firestore.collection("cards").doc(transaction.transactionId).update({
					approved: true,
					txId: 1,
					timestamp: moment().unix(),
					amount: 1,
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

    	// check for unsupported currency
    	if (cryptoNames.indexOf(currency) < 0) {
    		const error = `Send transaction: unsupported currency: ${currency}`
				Sentry.captureMessage(error)
    		dispatch(sendTransactionFailure(error))	
        reject(error)
    	}

      const state = getState()
      const walletCurrency = (currency == 'BTC') ? 'BTC' : 'ETH' // use ETH wallet if ERC20
      let userAddress = state.crypto.wallets[walletCurrency].address
      const network = state.crypto.wallets[walletCurrency].network
      const totalUnitAmount = unitAmount+fee

      if (currency != 'BTC') userAddress = userAddress.toLowerCase() // store eth addresses in lower case

      // transaction information
      let transaction = {
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
	      	// get private key from keychain
	        const privateKey = JSON.parse(data.password)[walletCurrency][network].wif 
	        // push btc transaction
	        BuildBitcoinTransaction({from: userAddress, to:toAddress, privateKey, amtSatoshi: totalUnitAmount, fee: fee, network}).then(response => {
	          const {txid, txhex} = response
	          transaction.txId = txid
			  // add transaction information to firebase
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
  	  	// push eth/erc20 transaction
  	  	sendETHTransaction({fromAddress: userAddress, toAddress: toAddress, weiAmount: unitAmount, currency: currency, network}).then(transactionHash => {
          transaction.txId = transactionHash
          // add transaction info to firebase
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

// dismiss pending transaction (clear information from reducer)
export const DismissTransaction = () => {
	return (dispatch, getState) => {
		dispatch(dismissTransaction())
	}
}
