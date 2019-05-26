import api, { Errors } from "../../api";
import { NewEthereumWallet, getETHBalance } from "../../ethereum-api";
import { NewBitcoinWallet, GetBitcoinAddressBalance } from "../../bitcoin-api";
import { LoadTransactions } from "../transactions/actions";
import * as Keychain from "react-native-keychain";
import { Sentry } from "react-native-sentry";

import { cryptoNames, erc20Names, unitsToDecimal } from "../../lib/cryptos";

export const ActionTypes = {
	SET_ACTIVE_CURRENCY: "SET_ACTIVE_CURRENCY",
	SET_ACTIVE_CRYPTO_CURRENCY: "SET_ACTIVE_CRYPTO_CURRENCY",
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
	SWITCH_WALLETS: "SWITCH_WALLETS"
};

export function setActiveCryptoCurrency(cryptoCurrency) {
	return { type: ActionTypes.SET_ACTIVE_CRYPTO_CURRENCY, cryptoCurrency };
}

export function setActiveCurrency(currency) {
	return { type: ActionTypes.SET_ACTIVE_CURRENCY, currency };
}

export function loadBalanceInit(currency) {
	return { type: ActionTypes.LOAD_BALANCE_INIT, currency };
}

export function loadBalanceSuccess(balance, currency) {
	return { type: ActionTypes.LOAD_BALANCE_SUCCESS, balance, currency };
}

export function loadBalanceFailure(error) {
	return { type: ActionTypes.LOAD_BALANCE_FAILURE, error };
}

export function loadExchangeRatesInit(currency) {
	return { type: ActionTypes.LOAD_EXCHANGE_RATES_INIT, currency };
}

export function loadExchangeRatesSuccess(exchangeRates, currency) {
	return {
		type: ActionTypes.LOAD_EXCHANGE_RATES_SUCCESS,
		exchangeRates,
		currency
	};
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

// full load of transactions, exchange rates, and balance for a give currency
export const Load = (currency = "BTC") => {
	return async (dispatch, getState) => {
		const state = getState();
		// get appropriate address
		let address;
		if (erc20Names.indexOf(currency) > -1) {
			address = state.crypto.wallets.ETH.address;
		} else {
			address = state.crypto.wallets[currency].address;
		}
		// load transactions
		const loadTransactionsAction = LoadTransactions(currency);
		const transactions = await loadTransactionsAction(dispatch, getState);

		// calculate pending outbound amount
		let unconfirmedOutboundAmount = 0;
		if (typeof transactions !== "undefined" && currency == "BTC") {
			for (var i = 0; i < transactions.length; i++) {
				if (transactions[i].pending == true) {
					unconfirmedOutboundAmount += transactions[i].amount.total;
				}
			}
		}

		// convert to a decimal amount
		unconfirmedOutboundAmount = unitsToDecimal(
			unconfirmedOutboundAmount,
			currency
		);
		// load balance and exchange rates
		const balanceAction = LoadBalance(currency, unconfirmedOutboundAmount);
		balanceAction(dispatch, getState);
		const exchangeRateAction = LoadExchangeRates(currency);
		exchangeRateAction(dispatch, getState);
	};
};

// load balance for a given currency and unconfirmedOutboundAmount
export const LoadBalance = (
	currency = "BTC",
	unconfirmedOutboundAmount = 0
) => {
	return (dispatch, getState) => {
		dispatch(loadBalanceInit(currency));

		const state = getState();

		// get address and network
		let address;
		let network;
		if (erc20Names.indexOf(currency) > -1) {
			address = state.crypto.wallets.ETH.address;
			network = state.crypto.wallets.ETH.network;
		} else {
			address = state.crypto.wallets[currency].address;
			network = state.crypto.wallets[currency].network;
		}

		if (currency == "BTC") {
			// get btc balance
			GetBitcoinAddressBalance(address, network)
				.then(balance => {
					const totalBalance = balance - unconfirmedOutboundAmount; // calculate total available balance
					dispatch(loadBalanceSuccess(totalBalance, currency));
				})
				.catch(error => {
					if (error != Errors.NETWORK_ERROR) Sentry.captureMessage(error);
					dispatch(loadBalanceFailure(error));
				});
		} else if (cryptoNames.indexOf(currency) >= 0) {
			// get eth/erc20 balance
			getETHBalance({ currency, address, network })
				.then(balance => {
					const totalBalance = balance - unconfirmedOutboundAmount;
					dispatch(loadBalanceSuccess(totalBalance, currency));
				})
				.catch(error => {
					if (error != Errors.NETWORK_ERROR) Sentry.captureMessage(error);
					dispatch(loadBalanceFailure(error));
				});
		} else {
			const error = `Load balance: unsupported currency: ${currency}`;
			Sentry.captureMessage(error);
			dispatch(loadBalanceFailure(error));
		}
	};
};

// load exchange rates for a given currency
export const LoadExchangeRates = (currency = "BTC") => {
	return (dispatch, getState) => {
		dispatch(loadExchangeRatesInit(currency));

		const state = getState();

		// check for supported currency
		if (cryptoNames.indexOf(currency) < 0) {
			const error = `Load exchange rates: unsupported currency: ${currency}`;
			Sentry.captureMessage(error);
			dispatch(loadExchangeRatesFailure(error));
			return;
		}

		// call api for exchange rates
		api
			.GetExchangeRate([currency])
			.then(exchangeRates => {
				dispatch(loadExchangeRatesSuccess(exchangeRates, currency));
			})
			.catch(error => {
				if (error != Errors.NETWORK_ERROR) Sentry.captureMessage(error);
				dispatch(loadExchangeRatesFailure(error));
			});
	};
};

// open needed wallets and store on keychain
export const OpenWallet = (userId, currencies) => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			dispatch(openWalletInit(currencies));

			// first check what is currently stored on the wallet
			Keychain.getGenericPassword()
				.then(data => {
					// keychain keyed by userId
					const keychainUserId = data.username;
					let keychainData;
					try {
						keychainData = JSON.parse(data.password);
						// if the keychain does not exist for the user create a blank wallet
						if (typeof keychainData != "object" || userId != keychainUserId) {
							keychainData = {
								BTC: {},
								ETH: {}
							};
						}
					} catch (e) {
						keychainData = {
							BTC: {},
							ETH: {}
						};
					}

				let newKeychainData = {}
				let publicWalletData = {BTC: {}, ETH: {}}

				for (var k = 0; k < currencies.length; k++) {
					const currency = currencies[k]

					let updateWallets = []
					let createWallets = []
					if (typeof keychainData[currency] !== 'undefined' && !!keychainData[currency].testnet) {
						updateWallets.push('testnet')
					} else {
						createWallets.push('testnet')
					}
					if (typeof keychainData[currency] !== 'undefined' && !!keychainData[currency].mainnet) {
						updateWallets.push('mainnet')
					} else {
						createWallets.push('mainnet')
					}

					console.log(updateWallets, createWallets)
					
					for (var i = 0; i < updateWallets.length; i++) {
						
						const network = updateWallets[i]
						// already have a wallet for this currency => load address to redux
						publicWalletData[currency][network] = {
							address: keychainData[currency][network].address,
							network: network,
						}
						if (
							typeof keychainData[currency] !== "undefined" &&
							!!keychainData[currency].mainnet
						) {
							updateWallets.push("mainnet");
						} else {
							createWallets.push("mainnet");
						}

						// gather the public wallet data to be added to firebase
						for (var i = 0; i < updateWallets.length; i++) {
							const network = updateWallets[i];
							// already have a wallet for this currency => load address to redux
							publicWalletData[currency][network] = {
								address: keychainData[currency][network].address,
								network: network
							};
						}

						// generate the needed wallets
						for (var j = 0; j < createWallets.length; j++) {
							const network = createWallets[j];

							// generate wallet for currency
							switch (currency) {
								case "BTC":
									const bitcoinData = NewBitcoinWallet(network);
									publicWalletData[currency][network] = {
										address: bitcoinData.address,
										network
									};
									newKeychainData = {
										address: bitcoinData.address,
										network,
										wif: bitcoinData.wif
									};
									break;
								case "ETH": // contains erc20
									const etherData = NewEthereumWallet();
									publicWalletData[currency][network] = {
										address: etherData.address,
										network
									};
									newKeychainData = {
										address: etherData.address,
										network,
										wif: etherData.wif
									};
									break;
								default:
									const error = `Open wallet: unsupported currency: ${currency}`;
									Sentry.captureMessage(error);
									dispatch(openWalletFailure(error));
									reject(error);
							}

							keychainData[currency][network] = newKeychainData;
						}
					}

					// add wallet to keychain (keyed by userId)
					Keychain.setGenericPassword(userId, JSON.stringify(keychainData))
						.then(() => {
							// update user with public wallet data for currency
							firestore
								.collection("users")
								.doc(userId)
								.update({
									wallets: publicWalletData
								})
								.then(() => {
									// add info to redux and load mainnet wallet first on default
									dispatch(
										openWalletSuccess({
											BTC: publicWalletData.BTC.mainnet,
											ETH: publicWalletData.ETH.mainnet
										})
									);
									resolve();
								})
								.catch(error => {
									Sentry.captureMessage(error);
									dispatch(openWalletFailure(error));
									reject(error);
								});
						})
						.catch(error => {
							Sentry.captureMessage(error);
							dispatch(openWalletFailure(error));
							reject(error);
						});
				})
				.catch(error => {
					console.log("keychain error", error);
					Sentry.captureMessage(error);
					dispatch(openWalletFailure(error));
					reject(error);
				});
		});
	};
};

// switch between mainnet and testnet
export const ToggleNetwork = () => {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			const state = getState();
			const currentNetwork = state.crypto.wallets.BTC.network;
			let newNetwork = "testnet";
			if (currentNetwork == "testnet") newNetwork = "mainnet";

			Keychain.getGenericPassword()
				.then(data => {
					const keychainData = JSON.parse(data.password);
					// get the wallets for the new network
					const newBTCWallet = {
						address: keychainData.BTC[newNetwork].address,
						network: keychainData.BTC[newNetwork].network
					};
					const newETHWallet = {
						address: keychainData.ETH[newNetwork].address,
						network: keychainData.ETH[newNetwork].network
					};
					// add the wallet to redux
					dispatch(switchWallets({ BTC: newBTCWallet, ETH: newETHWallet }));
					resolve();
				})
				.catch(e => {
					reject(e);
				});
		});
	};
};
