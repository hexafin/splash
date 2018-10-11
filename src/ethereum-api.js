var axios = require('axios')
import Web3 from 'web3'
import * as Keychain from 'react-native-keychain';
import {contractAddresses, erc20ABI} from './lib/cryptos'
import { infura_apiKey } from '../env/keys.json'


// returns token balance in ether
// token types can be found in lib/cryptos
export const getBalance = async ({token='ETH', address, network='testnet'}) => {
	const api = (network == 'mainnet') ? 'https://mainnet.infura.io/v3/' : 'https://rinkeby.infura.io/v3/'
	const web3 = new Web3( new Web3.providers.HttpProvider(api + infura_apiKey) )
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

export const getGasLimit = async ({fromAddress, toAddress, weiAmount, currency='ETH', network='testnet'}) => {
	if (currency == 'ETH') {
		return 21000
	}
	const api = (network == 'mainnet') ? 'https://mainnet.infura.io/v3/' : 'https://rinkeby.infura.io/v3/'
	const web3 = new Web3( new Web3.providers.HttpProvider(api + infura_apiKey) )
	const contract = new web3.eth.Contract(erc20ABI, contractAddresses[currency])
	const gasEstimate = await contract.methods.transfer(toAddress, weiAmount*2).estimateGas({from: fromAddress})
	return gasEstimate
}

export const getGasPrice = async(network="testnet") => {
	const api = (network == 'mainnet') ? 'https://mainnet.infura.io/v3/' : 'https://rinkeby.infura.io/v3/'
	const web3 = new Web3( new Web3.providers.HttpProvider(api + infura_apiKey) )
	return await web3.eth.getGasPrice()
}

export const sendTransaction = async ({fromAddress, toAddress, weiAmount, currency='ETH', network='testnet'}) => {

		const api = (network == 'mainnet') ? 'https://mainnet.infura.io/v3/' : 'https://rinkeby.infura.io/v3/'
		const web3 = new Web3( new Web3.providers.HttpProvider(api + infura_apiKey) )
		const EthereumTx = require('ethereumjs-tx')
		const gasLimit = await getGasLimit({fromAddress, toAddress, weiAmount, currency, network})
		console.log(gasLimit)
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
			const contract = new web3.eth.Contract(erc20ABI, contractAddresses[currency])
			details.data = contract.methods.transfer(toAddress, weiAmount).encodeABI()
			details.value = '0x0'
			details.to = contractAddresses[currency]
			details.from = fromAddress
		}
		console.log(currency)
		const transaction = new EthereumTx(details)

		const keychainData = await Keychain.getGenericPassword()
		let privateKey = JSON.parse(keychainData.password).ETH[network].wif
		privateKey = privateKey.replace(/^0x/, '') // remove 0x from private key so that it can be turned into a Buffer

		transaction.sign( Buffer.from(privateKey, 'hex') )

		const serializedTransaction = transaction.serialize()

		const receipt = await web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
		
		return receipt
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