export function NewEthereumWallet() {
   var bip39 = require('bip39')
   var mnemonic = bip39.generateMnemonic()

   const hdkey = require('ethereumjs-wallet/hdkey')
   privateKey = hdkey.fromMasterSeed(mnemonic)._hdkey._privateKey
   const Wallet = require('ethereumjs-wallet')
   const wallet = Wallet.fromPrivateKey(privateKey)


    return { address: wallet.getChecksumAddressString(), wif: wallet.getPrivateKeyString() }
 }