import api, { Errors } from "../../api";
import { NewEthereumWallet, getBalance  } from "../../ethereum-api"

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

		let address
		let network
		if (erc20Names.indexOf(currency) > -1 ) {
			address = state.crypto.wallets.ETH.address
		    network = state.crypto.wallets.ETH.network
		} else {
			address = state.crypto.wallets[currency].address
			network = state.crypto.wallets[currency].network
		}

		if(currency == "BTC") {
				api.GetBitcoinAddressBalance(address, network).then(balance => {
					dispatch(loadBalanceSuccess(balance))
				}).catch(error => {
					if (error != Errors.NETWORK_ERROR) Sentry.captureMessage(error)
					dispatch(loadBalanceFailure(error))
				})
		} else if (cryptoNames.indexOf(currency) >= 0) {
			getBalance({currency, address, network}).then(balance => {
				dispatch(loadBalanceSuccess(balance))
			}).catch(error => {
				if (error != Errors.NETWORK_ERROR) Sentry.captureMessage(error)
				dispatch(loadBalanceFailure(error))
			})
		} else {
			const error = `Load balance: unsupported currency: ${currency}`
			Sentry.captureMessage(error)
			dispatch(loadBalanceFailure(error))
		}
	}
}

export const LoadExchangeRates = (currency="BTC") => {
	return (dispatch, getState) => {
		dispatch(loadExchangeRatesInit(currency))

		const state = getState()

		if (cryptoNames.indexOf(currency) < 0) {
			const error = `Load exchange rates: unsupported currency: ${currency}`
			Sentry.captureMessage(error)
			dispatch(loadExchangeRatesFailure(error))
			return
		}

		api.GetExchangeRate([currency]).then(exchangeRates => {
			dispatch(loadExchangeRatesSuccess(exchangeRates))
		}).catch(error => {
			if (error != Errors.NETWORK_ERROR) Sentry.captureMessage(error)
			dispatch(loadExchangeRatesFailure(error))
		})
	}
}

export const OpenWallet = (userId, currencies) => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(openWalletInit(currencies))

			Keychain.getGenericPassword().then(data => {

				const keychainUserId = data.username
				let keychainData
				try {
					keychainData = JSON.parse(data.password)
					if (typeof keychainData != 'object' || userId != keychainUserId) {
						keychainData = {
							BTC: {},
							ETH: {},
						}
					}
				} catch (e) {
					keychainData = {
						BTC: {},
						ETH: {},
					}
				}

				let newKeychainData = {}
				let publicWalletData = {BTC: {}, ETH: {}}

				for (var k = 0; k < currencies.length; k++) {
					const currency = currencies[k]

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

					for (var i = 0; i < updateWallets.length; i++) {
						
						const network = updateWallets[i]
						// already have a wallet for this currency => load address to redux
						publicWalletData[currency][network] = {
							address: keychainData[currency][network].address,
							network: network,
						}
					} 

					for (var j = 0; j < createWallets.length; j++) {

						const network = createWallets[j]

						// generate wallet for currency
						switch(currency) {
							case "BTC":
								const bitcoinData = api.NewBitcoinWallet(network)
								publicWalletData[currency][network] = {
									address: bitcoinData.address,
									network,
								}
								newKeychainData = {
									address: bitcoinData.address,
									network,
									wif: bitcoinData.wif
								}
								break
							case "ETH":
								const etherData = NewEthereumWallet()
								publicWalletData[currency][network] = {
									address: etherData.address,
									network,
								}
								newKeychainData = {
									address: etherData.address,
									network,
									wif: etherData.wif
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
				}

				// add wallet to keychain
				Keychain.setGenericPassword(userId, JSON.stringify(keychainData)).then(() => {

					// update user with public wallet data for currency
					firestore.collection("users").doc(userId).update({
						wallets: publicWalletData
					}).then(() => {
						// load mainnet wallet first on default
						dispatch(openWalletSuccess({'BTC': publicWalletData.BTC.mainnet, 'ETH': publicWalletData.ETH.mainnet}))
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
		return new Promise((resolve,reject) => {
			const state = getState()
			const currentNetwork = state.crypto.wallets.BTC.network
			let newNetwork = 'testnet'
			if (currentNetwork == 'testnet') newNetwork = 'mainnet'

			Keychain.getGenericPassword().then(data => {

        const keychainData = JSON.parse(data.password)
        const newBTCWallet = {address: keychainData.BTC[newNetwork].address, network: keychainData.BTC[newNetwork].network}
        const newETHWallet = {address: keychainData.ETH[newNetwork].address, network: keychainData.ETH[newNetwork].network}
        dispatch(switchWallets({BTC: newBTCWallet, ETH: newETHWallet}))
				resolve()
			}).catch(e => {
				reject(e)
			})

		})
	}
}

