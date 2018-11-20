var axios = require('axios')
import Web3 from 'web3'
import * as Keychain from 'react-native-keychain';
import {contractAddresses, erc20ABI, erc20Names } from './lib/cryptos'
import { infura_apiKey, etherscan_apiKey } from '../env/keys.json'

import firebase from 'react-native-firebase'
let firestore = firebase.firestore()

export const ETHEREUM_ERRORS = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  BALANCE: 'BALANCE', // not enough balance
  FEE: 'FEE', // fee larger than balance
  USAGE: 'USAGE', // improper usage of library
}

// returns token balance in ether
// token types can be found in lib/cryptos
export const getBalance = async ({currency='ETH', address, network='testnet'}) => {
	const api = (network == 'mainnet') ? 'https://mainnet.infura.io/v3/' : 'https://rinkeby.infura.io/v3/'
	const web3 = new Web3( new Web3.providers.HttpProvider(api + infura_apiKey) )
	let balance
	if (currency == 'ETH') {
		balance = await web3.eth.getBalance(address)
		balance = parseFloat(web3.utils.fromWei(balance))
	} else {
		var tokenContract = new web3.eth.Contract(erc20ABI, contractAddresses[network][currency])
		balance = await tokenContract.methods.balanceOf(address).call();
		var decimal = await tokenContract.methods.decimals().call()
		balance = 1.0*parseFloat(balance) / Math.pow(10, decimal)
	}

	return balance
}

export const getGasLimit = async ({fromAddress, toAddress, weiAmount, currency='ETH', network='testnet'}) => {
	if (currency == 'ETH') {
		return 21000
	}
	const api = (network == 'mainnet') ? 'https://mainnet.infura.io/v3/' : 'https://rinkeby.infura.io/v3/'
	const web3 = new Web3( new Web3.providers.HttpProvider(api + infura_apiKey) )
	const contract = new web3.eth.Contract(erc20ABI, contractAddresses[network][currency])
	const gasEstimate = await contract.methods.transfer(toAddress, weiAmount*2).estimateGas({from: fromAddress})
	return gasEstimate
}

export const getGasPrice = async(network="testnet") => {
	const api = (network == 'mainnet') ? 'https://mainnet.infura.io/v3/' : 'https://rinkeby.infura.io/v3/'
	const web3 = new Web3( new Web3.providers.HttpProvider(api + infura_apiKey) )
	return await web3.eth.getGasPrice()
}

export const sendTransaction = async ({fromAddress, toAddress, weiAmount, currency='ETH', network='testnet'}) => {
    try {
      const api = (network == 'mainnet') ? 'https://mainnet.infura.io/v3/' : 'https://rinkeby.infura.io/v3/'
      const web3 = new Web3( new Web3.providers.HttpProvider(api + infura_apiKey) )
      const EthereumTx = require('ethereumjs-tx')
      const gasLimit = await getGasLimit({fromAddress, toAddress, weiAmount, currency, network})
      let nonce = await web3.eth.getTransactionCount(fromAddress)

      let gasPrice = await getGasPrice(network)

      let details = {
        "to": toAddress,
        "value": web3.utils.toHex( weiAmount ),
        "gasLimit": web3.utils.toHex(gasLimit),
        "gasPrice": web3.utils.toHex(parseInt(gasPrice)), // converts the gwei price to wei 
        "nonce": web3.utils.toHex(nonce),
        "chainId": (network == 'mainnet') ? 1 : 4 // EIP 155 chainId - mainnet: 1, rinkeby: 4
      }

      if (currency != 'ETH') { // if ERC20
        const contract = new web3.eth.Contract(erc20ABI, contractAddresses[network][currency])
        details.data = contract.methods.transfer(toAddress, weiAmount).encodeABI()
        details.value = '0x0'
        details.to = contractAddresses[network][currency]
        details.from = fromAddress
      }

      const transaction = new EthereumTx(details)

      const keychainData = await Keychain.getGenericPassword()
      let privateKey = JSON.parse(keychainData.password).ETH[network].wif
      privateKey = privateKey.replace(/^0x/, '') // remove 0x from private key so that it can be turned into a Buffer

      transaction.sign( Buffer.from(privateKey, 'hex') )

      const serializedTransaction = transaction.serialize()

      const receipt = await web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
      
      return receipt
    } catch (e) {
      if (e == 'Error: Returned error: insufficient funds for gas * price + value') {
        throw ETHEREUM_ERRORS.BALANCE
      } else {
        throw ETHEREUM_ERRORS.USAGE
      }
    }
}

export function NewEthereumWallet() {
   var bip39 = require('bip39')
   var mnemonic = bip39.generateMnemonic()

   const hdkey = require('ethereumjs-wallet/hdkey')
   privateKey = hdkey.fromMasterSeed(mnemonic)._hdkey._privateKey
   const Wallet = require('ethereumjs-wallet')
   const wallet = Wallet.fromPrivateKey(privateKey)


    return { address: wallet.getChecksumAddressString(), wif: wallet.getPrivateKeyString() }
 }


 export const AddETHTransactions = async (address, userId, splashtag, currency='ETH', network='mainnet') => {
 	// todo add erc20 handling
    try {
      const apiCode = '&apikey=' + etherscan_apiKey
      let transactionAPI
      if (erc20Names.indexOf(currency) > -1) {
        transactionAPI = (network == 'mainnet') ?
          'https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=' + contractAddresses[network][currency] + '&address=' + address + '&sort=desc' + apiCode :
          'https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&contractaddress=' + contractAddresses[network][currency] + '&address=' + address + '&sort=desc' + apiCode
      } else {
        transactionAPI = (network == 'mainnet') ?
          'https://api.etherscan.io/api?module=account&action=txlist&address=' + address + '&sort=desc' + apiCode :
          'https://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=' + address + '&sort=desc' + apiCode
      }

      // get list of txs on firebase
      const query1 = await firestore.collection("transactions").where("fromId", "==", userId)
                                                               .where("type", "==", "blockchain")
                                                               .where("currency", "==", currency).get()
      const query2 = await firestore.collection("transactions").where("toId", "==", userId)
                                                               .where("type", "==", "blockchain")
                                                               .where("currency", "==", currency).get()

      let firebaseTxIds = []
      let firebaseTxs = []
      if(query1.size > 0 || query2.size > 0) {
        query1.forEach(doc => {
          firebaseTxIds.push(doc.data().txId)
          firebaseTxs.push(doc.data())
        })
        query2.forEach(doc => {
          firebaseTxIds.push(doc.data().txId)
          firebaseTxs.push(doc.data())
        })
      }

      // load txs from blockchain
      const response = (await axios.get(transactionAPI)).data
      console.log(response, transactionAPI, erc20Names.indexOf(currency))
      if (response.status != 1) return
      const txs = response.result
  	  const txsLength = txs.length

      for(var j=0; j < txsLength; j++) {

        const index = firebaseTxIds.indexOf(txs[j].hash)
        // if the txId is not on firebase and the transaction is important (ie not both from and to the user) or if the transaction is pending
        if ((index == -1 || firebaseTxs[index].pending || typeof firebaseTxs[index].pending == 'undefined') && txs[j].value != '0') {

            let pending = false
            const confirmations = parseInt(txs[j].confirmations)

            if (confirmations < 12) {
              pending = true
            }

            const fee = parseInt(txs[j].gasUsed) * parseInt(txs[j].gasPrice)

          let newTransaction = {
            amount: {
            	fee: fee,
            	subtotal: parseInt(txs[j].value),
            	total: fee + parseInt(txs[j].value),
            },
            fromAddress: txs[j].from,
            toAddress: txs[j].to,
            timestamp: parseInt(txs[j].timeStamp),
            currency: currency,
            txId: txs[j].hash,
            pending: pending,
            confirmations: confirmations,
            type: 'blockchain'
          }
          // load total tx amount
          if (address.toLowerCase() == txs[j].from) {
            newTransaction.fromId = userId
            newTransaction.fromSplashtag = splashtag
          } else if (address.toLowerCase() == txs[j].to) {
            newTransaction.toId = userId
            newTransaction.toSplashtag = splashtag
          }

	        // if has total add to firebase so that it can be loaded on Home
	        if (newTransaction.amount.total > 0 || firebaseTxs[index].amount.total > 0) {
	          await firestore.collection("transactions").doc(newTransaction.txId).set(newTransaction, { merge: true })
	        }
         }
      }
      return
    } catch (error) {
      if (!error.status) {
        throw ETHEREUM_ERRORS.NETWORK_ERROR
      } else {
        throw error;
      }
    }
}
