let axios = require('axios');
import { Sentry } from "react-native-sentry";
import bitcoin from 'bitcoinjs-lib'

var BITCOIN_DIGITS = 8;
var BITCOIN_SAT_MULT = Math.pow(10, BITCOIN_DIGITS);

export let providers = {
	/**
	 * Input: Address to retrieve the balance from.
	 * Output: The balance in Satoshis.
	 */
	balance: {
		mainnet: {
			blockchain: function (addr) {
				return axios.get('https://blockchain.info/q/addressbalance/' + addr + '?confirmations=6').then(function (res) {
					return parseFloat(res.data);
				});
			}
		},
		testnet: {
			blockchain: function (addr) {
				return axios.get('https://testnet.blockchain.info/q/addressbalance/' + addr + '?confirmations=6').then(function (res) {
					return parseFloat(res.data);
				});
			}
		}
	},
	/**
	 * Input: axiosed processing speed. "fastest", "halfHour" or "hour"
	 * Output: Fee rate in Satoshi's per Byte.
	 */
	fees: {
		mainnet: {
			earn: function (feeName) {
				return axios.get('https://bitcoinfees.earn.com/api/v1/fees/recommended').then(function (res) {
					return res.data[feeName + "Fee"];
				});
			}
		},
		testnet: {
			earn: function (feeName) {
				return axios.get('https://bitcoinfees.earn.com/api/v1/fees/recommended').then(function (res) {
					return res.data[feeName + "Fee"];
				});
			}
		}
	},
	/**
	 * Input: Sending user's BitCoin wallet address.
	 * Output: List of utxo's to use. Must be in standard format. { txid, vout, satoshis, confirmations }
	 */
	utxo: {
		mainnet: {
			blockchain: function (addr) {
				return axios.get('https://blockchain.info/unspent?active=' + addr).then(function (res) {
					return res.data.unspent_outputs.map(function (e) {
						return {
							txid: e.tx_hash_big_endian,
							vout: e.tx_output_n,
							satoshis: e.value,
							confirmations: e.confirmations
						};
					});
				});
			}
		},
		testnet: {
			blockchain: function (addr) {
				return axios.get('https://testnet.blockchain.info/unspent?active=' + addr).then(function (res) {
					return res.data.unspent_outputs.map(function (e) {
						return {
							txid: e.tx_hash_big_endian,
							vout: e.tx_output_n,
							satoshis: e.value,
							confirmations: e.confirmations
						};
					});
				});
			}
		},
	},
	/**
	 * Input: A hex string transaction to be pushed to the blockchain.
	 * Output: None
	 */
	pushtx: {
		mainnet: {
			blockchain: function (hexTrans) {
				return axios.post('https://blockchain.info/pushtx?tx=' + hexTrans);
			}
		},
		testnet: {
			blockchain: function (hexTrans) {
				return axios.post('https://testnet.blockchain.info/pushtx?tx=' + hexTrans);
			}
		}
	}
}

//Set default providers
providers.balance.mainnet.default = providers.balance.mainnet.blockchain;
providers.balance.testnet.default = providers.balance.testnet.blockchain;
providers.fees.mainnet.default = providers.fees.mainnet.earn;
providers.fees.testnet.default = providers.fees.testnet.earn;
providers.utxo.mainnet.default = providers.utxo.mainnet.blockchain;
providers.utxo.testnet.default = providers.utxo.testnet.blockchain;
providers.pushtx.mainnet.default = providers.pushtx.mainnet.blockchain;
providers.pushtx.testnet.default = providers.pushtx.testnet.blockchain;

export const BITCOIN_ERRORS = {
	BALANCE: 'BALANCE', // not enough balance
	UTXOS: 'UTXOS', // not enough utxos
	FEE: 'FEE', // fee larger than balance
	USAGE: 'USAGE', // improper usage of library
}

export function getBalance (addr, options) {
	if (options == null) options = {};
	if (options.network == null) options.network = "mainnet";
	if (options.balanceProvider == null) options.balanceProvider = providers.balance[options.network].default;

	return options.balanceProvider(addr).then(function (balSat) {
		return balSat/BITCOIN_SAT_MULT;
	});
}

export function getTransactionSize (numInputs, numOutputs) {
	return numInputs*180 + numOutputs*34 + 10 + numInputs;
}

export function getFees (feeName, provider=providers.fees.mainnet.earn) {
	if (typeof feeName === 'number') {
		return new Promise.resolve(feeName);
	} else {
		return provider(feeName);
	}
}

export function sendTransaction (options) {
	//Required
	if (options == null || typeof options !== 'object') throw BITCOIN_ERRORS.USAGE
	if (options.from == null) throw BITCOIN_ERRORS.USAGE
	if (options.to == null) throw BITCOIN_ERRORS.USAGE
	if (options.satoshis == null) throw BITCOIN_ERRORS.USAGE
	if (options.privKeyWIF == null) throw BITCOIN_ERRORS.USAGE

	//Optionals
	if (options.network == null) options.network = 'mainnet';
	if (options.fee == null) options.fee = 'fastest';
	if (options.feesProvider == null) options.feesProvider = providers.fees[options.network].default;
	if (options.utxoProvider == null) options.utxoProvider = providers.utxo[options.network].default;
	if (options.pushtxProvider == null) options.pushtxProvider = providers.pushtx[options.network].default;
	if (options.dryrun == null) options.dryrun = false;

	var from = options.from;
	var to = options.to;
	var amtSatoshi = options.satoshis
	var bitcoinNetwork = options.network == "testnet" ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;

	return new Promise((resolve, reject) => {
		return Promise.all([
			getFees(options.fee, options.feesProvider),
			options.utxoProvider(from)
		]).then(function (res) {
			var feePerByte = res[0];
			var utxos = res[1];

			//Setup inputs from utxos
			var tx = new bitcoin.TransactionBuilder(bitcoinNetwork);
			var ninputs = 0;
			var availableSat = 0;
			for (var i = 0; i < utxos.length; i++) {
				var utxo = utxos[i];
				if (utxo.confirmations >= 6) {
					tx.addInput(utxo.txid, utxo.vout);
					availableSat += utxo.satoshis;
					ninputs++;

					if (availableSat >= amtSatoshi) break;
				}
			}

			if (availableSat < amtSatoshi) throw BITCOIN_ERRORS.UTXOS

			var change = availableSat - amtSatoshi;
			var fee = getTransactionSize(ninputs, change > 0 ? 2 : 1)*feePerByte;
			if (typeof options.fee === 'number') {
				fee = options.fee
			}

			if (fee > amtSatoshi) throw BITCOIN_ERRORS.FEE
			tx.addOutput(to, amtSatoshi - fee);
			if (change > 0) tx.addOutput(from, change);
			var keyPair = bitcoin.ECPair.fromWIF(options.privKeyWIF, bitcoinNetwork);
			for (var i = 0; i < ninputs; i++) {
				tx.sign(i, keyPair);
			}
			var txhex = tx.build().toHex();
			const txid = bitcoin.Transaction.fromHex(txhex).getId();
			if (options.dryrun) {
				return {txid, txhex};
			} else {
					options.pushtxProvider(txhex).then(() => {
						resolve({txid, txhex})
					}).catch(error => {
						reject(error)
					})
			}
		}).catch(error => {
			reject(error)
		})
	})
}
