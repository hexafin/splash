import api from "../../api";
var axios = require("axios");
import firebase from "react-native-firebase";
let firestore = firebase.firestore();
let analytics = firebase.analytics();
import { NavigationActions } from "react-navigation";
import * as Keychain from 'react-native-keychain';

analytics.setAnalyticsCollectionEnabled(true);
import { cryptoUnits } from '../../lib/cryptos'
import { hexaBtcAddress } from '../../../env/keys.json'
import moment from "moment"

import NavigatorService from "../navigator";

export const ActionTypes = {
	SET_ACTIVE_CURRENCY: "SET_ACTIVE_CURRENCY",
	LOAD_BALANCE_INIT: "LOAD_BALANCE_INIT",
	LOAD_BALANCE_SUCCESS: "LOAD_BALANCE_SUCCESS",
	LOAD_BALANCE_FAILURE: "LOAD_BALANCE_FAILURE",
	LOAD_EXCHANGE_RATES_INIT: "LOAD_EXCHANGE_RATES_INIT",
	LOAD_EXCHANGE_RATES_SUCCESS: "LOAD_EXCHANGE_RATES_SUCCESS",
	LOAD_EXCHANGE_RATES_FAILURE: "LOAD_EXCHANGE_RATES_FAILURE",
	OPEN_WALLET_INIT: "OPEN_WALLET_INIT",
	OPEN_WALLET_SUCCESS: "OPEN_WALLET_SUCCESS",
	OPEN_WALLET_FAILURE: "OPEN_WALLET_FAILURE",
}

export function setActiveCurrency(currency) {
	return { type: ActionTypes.SET_ACTIVE_CURRENCY, currency };
}

export function loadBalanceInit(currency) {
	return { type: ActionTypes.LOAD_BALANCE_INIT, currency };
}

export function loadBalanceSuccess(balance) {
	return { type: ActionTypes.LOAD_BALANCE_SUCCESS, balance };
}

export function loadBalanceFailure(error) {
	return { type: ActionTypes.LOAD_BALANCE_SUCCESS, error };
}

export function loadExchangeRatesInit(currency) {
	return { type: ActionTypes.LOAD_EXCHANGE_RATES_INIT, currency };
}

export function loadExchangeRatesSuccess(exchangeRates) {
	return { type: ActionTypes.LOAD_EXCHANGE_RATES_SUCCESS, exchangeRates };
}

export function loadExchangeRatesFailure(error) {
	return { type: ActionTypes.LOAD_EXCHANGE_RATES_SUCCESS, error };
}

export function openWalletInit(currency) {
	return { type: ActionTypes.OPEN_WALLET_INIT, currency };
}

export function openWalletSuccess(wallet) {
	return { type: ActionTypes.OPEN_WALLET_SUCCESS, wallet };
}

export function openWalletFailure(error) {
	return { type: ActionTypes.OPEN_WALLET_SUCCESS, error };
}

export const LoadBalance = (currency="BTC") => {
	return (dispatch, getState) => {
		dispatch(loadBalanceInit(currency))

		const state = getState()

		const address = state.crypto.wallets[currency].address
		const network = state.crypto.wallets[currency].network

		switch(currency) {
			case "BTC":
				api.GetBitcoinAddressBalance(address, network).then(balance => {
					dispatch(loadBalanceSuccess(balance))
				}).catch(error => {
					Sentry.messageCapture(error)
					dispatch(loadBalanceFailure(error))
				})
				break
			default:
				const error = `Load balance: unsupported currency: ${currency}`
				Sentry.messageCapture(error)
				dispatch(loadBalanceFailure(error))
				break
		}
	}
}

export const LoadExchangeRates = (currency="BTC") => {
	return (dispatch, getState) => {
		dispatch(loadExchangeRatesInit(currency))

		const state = getState()

		if (currency != "BTC") {
			const error = `Load exchange rates: unsupported currency: ${currency}`
			Sentry.messageCapture(error)
			dispatch(loadExchangeRatesFailure(error))
			return
		}

		api.GetExchangeRate(currency).then(exchangeRate => {
			dispatch(loadExchangeRatesSuccess(exchangeRate))
		}).catch(error => {
			Sentry.messageCapture(error)
			dispatch(loadExchangeRatesFailure(error))
		})
	}
}

export const OpenWallet = (currency, network="testnet") => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(openWalletInit(currency))

			const state = getState()

			const userId = state.user.id

			Keychain.getGenericPassword().then(data => {

				const keychainUserId = data.username
				const keychainData = JSON.parse(data.password)

				if (!!keychainData[currency]) {
					
					// already have a wallet for this currency => load address to redux
					console.log(currency, 'Address found in Keychain')
					dispatch(openWalletSuccess({
						address: keychainData[currency].address,
						network: keychainData[currency].network,
					}))
					resolve()

				} else {

					// generate wallet for currency
					let publicWalletData
					let keychainWalletData
					switch(currency) {
						case "BTC":
							const bitcoinData = api.NewBitcoinWallet(network)
							publicWalletData = {
								address: bitcoinData.address,
								network,
							}
							keychainWalletData = {
								address: bitcoinData.address,
								network,
								wif: bitcoinData.wif
							}
							break
						default:
							const error = `Open wallet: unsupported currency: ${currency}`
							Sentry.messageCapture(error)
							dispatch(openWalletFailure(error))
							reject(error)
					}

					const updatedKeychainData = {
						...keychainData,
						[currency]: keychainWalletData
					}

					console.log(updatedKeychainData)

					// add wallet to keychain
					Keychain.setGenericPassword(userId, JSON.stringify(updatedKeychainData)).then(() => {

						// update user with public wallet data for currency
						firestore.collection("users").doc(userId).update({
							[`wallets.${currency}`]: publicWalletData
						}).then(() => {

							dispatch(openWalletSuccess(publicWalletData))
							resolve()

						}).catch(error => {
							dispatch(openWalletFailure(error))
							reject(error)
						})
				  	}).catch(error => {
				  		dispatch(openWalletFailure(error))
						reject(error)
				  	})

				}

			}).catch(error => {
				dispatch(openWalletFailure(error))
				reject(error)
			})
		})
	}
}
