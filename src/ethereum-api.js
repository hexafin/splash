var axios = require('axios')
import Web3 from 'web3'

import {contractAddresses, erc20ABI} from './lib/cryptos'


// returns token balance in ether
// token types can be found in lib/cryptos
export const getBalance = async (token, address, network='mainnet') => {
	const api = (network == 'mainnet') ? 'https://mainnet.infura.io/v3/' : 'https://ropsten.infura.io/v3/'
	const web3 = new Web3( new Web3.providers.HttpProvider(api + '57e38a0fd7b249eaa15129c1a1573ec1') )
	let balance
	if (token == 'ETH') {
		balance = await web3.eth.getBalance(address)
		balance = parseFloat(web3.utils.fromWei(balance))
	} else {
		var tokenContract = new web3.eth.Contract(erc20ABI, contractAddresses[token])
		balance = await tokenContract.methods.balanceOf(address).call();
		var decimal = await tokenContract.methods.decimals().call()
		balance = 1.0*parseFloat(balance) / Math.pow(10, decimal)
	}

	return balance
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