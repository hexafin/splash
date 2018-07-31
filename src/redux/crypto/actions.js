import api, { Errors } from "../../api";
var axios = require("axios");
import firebase from "react-native-firebase";
let firestore = firebase.firestore();
let analytics = firebase.analytics();
import { NavigationActions } from "react-navigation";
import * as Keychain from 'react-native-keychain';
import { Sentry } from "react-native-sentry";

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
	RESET_CRYPTO: "RESET_CRYPTO",
	SWITCH_WALLETS: 'SWITCH_WALLETS',
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
	return { type: ActionTypes.LOAD_BALANCE_FAILURE, error };
}

export function loadExchangeRatesInit(currency) {
	return { type: ActionTypes.LOAD_EXCHANGE_RATES_INIT, currency };
}

export function loadExchangeRatesSuccess(exchangeRates) {
	return { type: ActionTypes.LOAD_EXCHANGE_RATES_SUCCESS, exchangeRates };
}

export function loadExchangeRatesFailure(error) {
	return { type: ActionTypes.LOAD_EXCHANGE_RATES_FAILURE, error };
}

export function openWalletInit(currency) {
	return { type: ActionTypes.OPEN_WALLET_INIT, currency };
}

export function openWalletSuccess(wallet) {
	return { type: ActionTypes.OPEN_WALLET_SUCCESS, wallet };
}

export function openWalletFailure(error) {
	return { type: ActionTypes.OPEN_WALLET_FAILURE, error };
}

export function switchWallets(wallet) {
	return { type: ActionTypes.SWITCH_WALLETS, wallet };
}

export function resetCrypto() {
	return { type: ActionTypes.RESET_CRYPTO };
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
					if (error != Errors.NETWORK_ERROR) Sentry.captureMessage(error)
					dispatch(loadBalanceFailure(error))
				})
				break
			default:
				const error = `Load balance: unsupported currency: ${currency}`
				Sentry.captureMessage(error)
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
			Sentry.captureMessage(error)
			dispatch(loadExchangeRatesFailure(error))
			return
		}

		api.GetExchangeRate(currency).then(exchangeRate => {
			dispatch(loadExchangeRatesSuccess(exchangeRate))
		}).catch(error => {
			if (error != Errors.NETWORK_ERROR) Sentry.captureMessage(error)
			dispatch(loadExchangeRatesFailure(error))
		})
	}
}

export const OpenWallet = (currency) => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(openWalletInit(currency))

			const state = getState()

			const userId = state.user.id

			Keychain.getGenericPassword().then(data => {

				const keychainUserId = data.username
				let keychainData
				try {
					keychainData = JSON.parse(data.password)
					if (typeof keychainData != 'object') {
						keychainData = {
							BTC: {}
						}
					}
				} catch (e) {
					keychainData = {
						BTC: {}
					}
				}

				let newKeychainData = {}
				let publicWalletData = {}

				let updateWallets = []
				let createWallets = []
				if (!!keychainData[currency].testnet) {
					updateWallets.push('testnet')
				} else {
					createWallets.push('testnet')
				}
				if (!!keychainData[currency].mainnet) {
					updateWallets.push('mainnet')
				} else {
					createWallets.push('mainnet')
				}

				for (var i = 0, len = updateWallets.length; i < len; i++) {
					
					const network = updateWallets[i]
					// already have a wallet for this currency => load address to redux
					publicWalletData[network] = {
						address: keychainData[currency][network].address,
						network: network,
					}
				} 

				for (var j = 0, len = createWallets.length; j < len; j++) {

					const network = createWallets[j]

					// generate wallet for currency
					switch(currency) {
						case "BTC":
							const bitcoinData = api.NewBitcoinWallet(network)
							publicWalletData[network] = {
								address: bitcoinData.address,
								network,
							}
							newKeychainData = {
								address: bitcoinData.address,
								network,
								wif: bitcoinData.wif
							}
							break
						default:
							const error = `Open wallet: unsupported currency: ${currency}`
							Sentry.captureMessage(error)
							dispatch(openWalletFailure(error))
							reject(error)
					}

					keychainData[currency][network] = newKeychainData						
				}
				// add wallet to keychain
				Keychain.setGenericPassword(userId, JSON.stringify(keychainData)).then(() => {

					// update user with public wallet data for currency
					firestore.collection("users").doc(userId).update({
						[`wallets.${currency}`]: publicWalletData
					}).then(() => {
						// load testnet wallet first on default
						dispatch(openWalletSuccess(publicWalletData.testnet))
						resolve()

					}).catch(error => {
						Sentry.captureMessage(error)
						dispatch(openWalletFailure(error))
						reject(error)
					})
			  	}).catch(error => {
			  		Sentry.captureMessage(error)
			  		dispatch(openWalletFailure(error))
					reject(error)
			  	})

			}).catch(error => {
				console.log('keychain error', error)
				Sentry.captureMessage(error)
				dispatch(openWalletFailure(error))
				reject(error)
			})
		})
	}
}

export const ToggleNetwork = () => {
	return (dispatch, getState) => {
		const state = getState()
		const currentNetwork = state.crypto.wallets.BTC.network
		let newNetwork = 'testnet'
		if (currentNetwork == 'testnet') newNetwork = 'mainnet'

		Keychain.getGenericPassword().then(data => {

			const keychainData = JSON.parse(data.password)
			const newWallet = keychainData.BTC[newNetwork]
			dispatch(switchWallets({address: newWallet.address, network: newWallet.network}))

		})
	}
}

