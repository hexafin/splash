let axios = require("axios");
import bitcoin from "bitcoinjs-lib";
let random = require("react-native-randombytes").randomBytes;
import { blockchain_info_apiKey } from "../env/keys.json";
import firebase from "react-native-firebase";
let firestore = firebase.firestore();

import { cryptoNames, cryptoUnits, erc20Names } from "./lib/cryptos";

const SATOSHI_CONVERSION = 100000000;

var BITCOIN_DIGITS = 8;
var BITCOIN_SAT_MULT = Math.pow(10, BITCOIN_DIGITS);
const apiCode = "?api_code=" + blockchain_info_apiKey + "&";

export const Errors = {
	NETWORK_ERROR: "NETWORK_ERROR"
};

export let providers = {
	/**
	 * Input: Address to retrieve the balance from.
	 * Output: The balance in Satoshis.
	 */
	balance: {
		mainnet: {
			blockchain: function(addr) {
				return axios
					.get(
						"https://blockchain.info/q/addressbalance/" +
							addr +
							apiCode +
							"confirmations=6"
					)
					.then(function(res) {
						return parseFloat(res.data);
					});
			}
		},
		testnet: {
			blockchain: function(addr) {
				return axios
					.get(
						"https://testnet.blockchain.info/q/addressbalance/" +
							addr +
							apiCode +
							"confirmations=6"
					)
					.then(function(res) {
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
			earn: function(feeName) {
				return axios
					.get("https://bitcoinfees.earn.com/api/v1/fees/recommended")
					.then(function(res) {
						return res.data[feeName + "Fee"];
					});
			}
		},
		testnet: {
			earn: function(feeName) {
				return axios
					.get("https://bitcoinfees.earn.com/api/v1/fees/recommended")
					.then(function(res) {
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
			blockchain: function(addr) {
				return axios
					.get(
						"https://blockchain.info/unspent" +
							apiCode +
							"active=" +
							addr
					)
					.then(function(res) {
						return res.data.unspent_outputs.map(function(e) {
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
			blockchain: function(addr) {
				return axios
					.get(
						"https://testnet.blockchain.info/unspent" +
							apiCode +
							"active=" +
							addr
					)
					.then(function(res) {
						return res.data.unspent_outputs.map(function(e) {
							return {
								txid: e.tx_hash_big_endian,
								vout: e.tx_output_n,
								satoshis: e.value,
								confirmations: e.confirmations
							};
						});
					});
			}
		}
	},
	/**
	 * Input: A hex string transaction to be pushed to the blockchain.
	 * Output: None
	 */
	pushtx: {
		mainnet: {
			blockchain: function(hexTrans) {
				return axios.post(
					"https://blockchain.info/pushtx" +
						apiCode +
						"tx=" +
						hexTrans
				);
			}
		},
		testnet: {
			blockchain: function(hexTrans) {
				return axios.post(
					"https://testnet.blockchain.info/pushtx" +
						apiCode +
						"tx=" +
						hexTrans
				);
			}
		}
	}
};

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
	BALANCE: "BALANCE", // not enough balance
	UTXOS: "UTXOS", // not enough utxos
	FEE: "FEE", // fee larger than balance
	USAGE: "USAGE" // improper usage of library
};

export function getTransactionSize(numInputs, numOutputs) {
	return numInputs * 180 + numOutputs * 34 + 10 + numInputs;
}

// return current btc fees
export function getFees(feeName, provider = providers.fees.mainnet.earn) {
	if (typeof feeName === "number") {
		return new Promise.resolve(feeName);
	} else {
		return provider(feeName);
	}
}

// create btc pubkey and wif
export function NewBitcoinWallet(network = "mainnet") {
	network =
		network == "mainnet"
			? bitcoin.networks.bitcoin
			: bitcoin.networks.testnet;
	var keyPair = bitcoin.ECPair.makeRandom({
		rng: random,
		network: network
	});
	return {
		wif: keyPair.toWIF(),
		address: bitcoin.payments.p2pkh({
			pubkey: keyPair.publicKey,
			network: network
		}).address
	};
}

export function GetBitcoinAddressBalance(address, network = "mainnet") {
	return new Promise((resolve, reject) => {
		const APIaddress =
			network == "mainnet"
				? "https://blockchain.info/q/addressbalance/"
				: "https://testnet.blockchain.info/q/addressbalance/";
		// get balance with 6 confirmations
		axios.get(
				APIaddress +
					address +
					"?api_code=" +
					blockchain_info_apiKey + 
					"&confirmations=6"
			).then(response => {
				if (response.data !== null) {
					resolve(
						(1.0 * parseFloat(response.data)) / SATOSHI_CONVERSION
					);
				} else {
					reject("Cannot retrieve balance");
				}
			}).catch(error => {
				if (!error.status) {
					reject(Errors.NETWORK_ERROR);
				} else {
					reject(error);
				}
			});
	});
}

// feenames: "fastest", "halfHour", "hour"
// if from and amtSatoshi are provided returns total fee given transaction size. if not returns feePerByte
export function GetBitcoinFees({
	feeName = "fastest",
	network = "mainnet",
	from = null,
	amtSatoshi = null
}) {
	return new Promise((resolve, reject) => {
		getFees(feeName)
			.then(feePerByte => {

				// calculate transaction size
				if (from && amtSatoshi) {
					providers.utxo[network]
						.default(from)
						.then(utxos => {
							var bitcoinNetwork =
								network == "testnet"
									? bitcoin.networks.testnet
									: bitcoin.networks.bitcoin;
							let tx = new bitcoin.TransactionBuilder(
								bitcoinNetwork
							);
							let ninputs = 0;
							let availableSat = 0;
							for (var i = 0; i < utxos.length; i++) {
								const utxo = utxos[i];
								if (utxo.confirmations >= 6) {
									tx.addInput(utxo.txid, utxo.vout);
									availableSat += utxo.satoshis;
									ninputs++;

									if (availableSat >= amtSatoshi) break;
								}
							}
							const change = availableSat - amtSatoshi;
							const fee =
								getTransactionSize(
									ninputs,
									change > 0 ? 2 : 1
								) * feePerByte;
							resolve(fee);
						})
						.catch(error => {
							reject(error);
						});
				} else {
					resolve(feePerByte);
				}
			})
			.catch(error => {
				reject(error);
			});
	});
}

function publishTransaction(options) {
	//Required
	if (options == null || typeof options !== "object")
		throw BITCOIN_ERRORS.USAGE;
	if (options.from == null) throw BITCOIN_ERRORS.USAGE;
	if (options.to == null) throw BITCOIN_ERRORS.USAGE;
	if (options.satoshis == null) throw BITCOIN_ERRORS.USAGE;
	if (options.privKeyWIF == null) throw BITCOIN_ERRORS.USAGE;

	//Optionals
	if (options.network == null) options.network = "mainnet";
	if (options.fee == null) options.fee = "fastest";
	if (options.feesProvider == null)
		options.feesProvider = providers.fees[options.network].default;
	if (options.utxoProvider == null)
		options.utxoProvider = providers.utxo[options.network].default;
	if (options.pushtxProvider == null)
		options.pushtxProvider = providers.pushtx[options.network].default;
	if (options.dryrun == null) options.dryrun = false;

	var from = options.from;
	var to = options.to;
	var amtSatoshi = options.satoshis;
	var bitcoinNetwork =
		options.network == "testnet"
			? bitcoin.networks.testnet
			: bitcoin.networks.bitcoin;

	return new Promise((resolve, reject) => {

		// fetch fees and utxos
		return Promise.all([
			getFees(options.fee, options.feesProvider),
			options.utxoProvider(from)
		])
			.then(function(res) {
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
						availableSat += utxo.satoshis; // add up utxo amounts
						ninputs++;

						if (availableSat >= amtSatoshi) break;
					}
				}

				if (availableSat < amtSatoshi) throw BITCOIN_ERRORS.UTXOS;

				var change = availableSat - amtSatoshi; // including change
				var fee = getTransactionSize(ninputs, change > 0 ? 2 : 1) * feePerByte;
				if (typeof options.fee === "number") {
					fee = options.fee;
				}

				if (fee > amtSatoshi) throw BITCOIN_ERRORS.FEE; // if not enough to pay fee

				// set up amount to be sent to destination and amount to return
				tx.addOutput(to, amtSatoshi - fee);
				if (change > 0) tx.addOutput(from, change);

				// sign tx
				var keyPair = bitcoin.ECPair.fromWIF(
					options.privKeyWIF,
					bitcoinNetwork
				);
				for (var i = 0; i < ninputs; i++) {
					tx.sign(i, keyPair);
				}

				// build transaction 
				var txhex = tx.build().toHex();
				const txid = bitcoin.Transaction.fromHex(txhex).getId();
				if (options.dryrun) {
					return { txid, txhex };
				} else {

					// push to blockchain
					options
						.pushtxProvider(txhex)
						.then(() => {
							resolve({ txid, txhex });
						})
						.catch(error => {
							reject(error);
						});
				}
			})
			.catch(error => {
				reject(error);
			});
	});
}

export async function LoadBTCTransactions(
	address,
	userId,
	splashtag,
	network = "mainnet"
) {
	let allTransactions = [];
	try {

		// construct relevant apis
		const apiCode = "?api_code=" + blockchain_info_apiKey;
		const addressAPI =
			network == "mainnet"
				? "https://blockchain.info/rawaddr/" + address
				: "https://testnet.blockchain.info/rawaddr/" + address;
		const txAPI =
			network == "mainnet"
				? "https://blockchain.info/q/txresult/"
				: "https://testnet.blockchain.info/q/txresult/";
		const feeAPI =
			network == "mainnet"
				? "https://blockchain.info/q/txfee/"
				: "https://testnet.blockchain.info/q/txfee/";
		const blockHeightAPI =
			network == "mainnet"
				? "https://blockchain.info/q/getblockcount"
				: "https://testnet.blockchain.info/q/getblockcount";

		// get list of txs on firebase
		const query1 = await firestore
			.collection("transactions")
			.where("fromId", "==", userId)
			.where("type", "==", "blockchain")
			.where("currency", "==", "BTC")
			.get();
		const query2 = await firestore
			.collection("transactions")
			.where("toId", "==", userId)
			.where("type", "==", "blockchain")
			.where("currency", "==", "BTC")
			.get();

	    // load list of firebaseTxs and firebaseTxIds
		let firebaseTxIds = [];
		let firebaseTxs = [];
		if (query1.size > 0 || query2.size > 0) {
			query1.forEach(doc => {
				firebaseTxIds.push(doc.data().txId);
				firebaseTxs.push(doc.data());
			});
			query2.forEach(doc => {
				firebaseTxIds.push(doc.data().txId);
				firebaseTxs.push(doc.data());
			});
		}

		// load txs from blockchain
		const blockHeight = (await axios.get(blockHeightAPI + apiCode)).data;
		const txs = (await axios.get(addressAPI + apiCode)).data.txs;
		const txsLength = txs.length;
		for (var j = 0; j < txsLength; j++) {
			const index = firebaseTxIds.indexOf(txs[j].hash);
			// if the transaction is important (ie not both from and to the user)
			if (txs[j].inputs[0].prev_out.addr !== txs[j].out[0].addr) {
				
				let pending = false;
				const confirmations =
					typeof txs[j].block_height === "undefined"
						? 0
						: blockHeight - txs[j].block_height + 1;
				if (typeof txs[j].block_height === "undefined" || confirmations < 6) {
					pending = true;
				}

				let newTransaction = {};
				if (index !== -1) {  // if blockchain tx is annotated on firebase
					newTransaction = firebaseTxs[index];
					newTransaction.pending = pending;
					newTransaction.confirmations = confirmations;
				} else {
					newTransaction = {
						timestamp: txs[j].time,
						currency: "BTC",
						txId: txs[j].hash,
						pending: pending,
						confirmations: confirmations,
						type: "blockchain"
					};
				}
				let amount = {};

				// load total tx amount
				const total = (await axios.get(
					txAPI + txs[j].hash + "/" + address + apiCode
				)).data;
				if (total < 0) {
					newTransaction.fromId = userId;
					newTransaction.fromSplashtag = splashtag;
					newTransaction.fromAddress = address;
					newTransaction.toAddress = txs[j].out[0].addr;
					amount.subtotal = -1 * total;
				} else {
					newTransaction.toId = userId;
					newTransaction.toSplashtag = splashtag;
					newTransaction.toAddress = address;
					newTransaction.fromAddress = txs[j].inputs[0].prev_out.addr;
					amount.subtotal = total;
				}

				// load fees and calculate total
				amount.fee = (await axios.get(
					feeAPI + txs[j].hash + apiCode
				)).data;
				amount.total = amount.subtotal + amount.fee;

				// if has total
				if (amount.total > 0) {
					if (
						index == -1 ||
						firebaseTxs[index].pending ||
						typeof firebaseTxs[index].pending == "undefined"
					) {
			            // add tx to firebase if it needs updating
						await firestore
							.collection("transactions")
							.doc(newTransaction.txId)
							.set(newTransaction, { merge: true });
					}
					newTransaction.amount = { ...amount };
					newTransaction.id = newTransaction.txId;
					allTransactions.push(newTransaction);
				}
			}
		}
		return allTransactions;
	} catch (error) {
		console.log(error);
		if (!error.status) {
			throw Errors.NETWORK_ERROR;
		} else {
			throw error;
		}
	}
}

// wrapper function for creating btc txs
export function BuildBitcoinTransaction({
	from,
	to,
	privateKey,
	amtSatoshi,
	fee = null,
	network = "testnet"
}) {
	return new Promise((resolve, reject) => {
		GetBitcoinAddressBalance(from, network)
			.then(balanceBtc => {
				if (amtSatoshi / cryptoUnits.BTC < balanceBtc) { // if enough btc
					publishTransaction({
						from: from,
						to: to,
						privKeyWIF: privateKey,
						satoshis: amtSatoshi,
						fee: fee,
						dryrun: false,
						network: network
					})
						.then(response => {
							resolve(response);
						})
						.catch(error => {
							reject(error);
						});
				} else {
					reject(BITCOIN_ERRORS.BALANCE);
				}
			})
			.catch(error => {
				reject(error);
			});
	});
}
