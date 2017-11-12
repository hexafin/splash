// create's new wallet
// generates public and private key
// does appropriate storing/saving/showing of keys
require('../shim');
var bitcoin = require('bitcoinjs-lib');
var random = require('react-native-randombytes').randomBytes
/**
     * newWallet - Creates a random new wallet (keypair composed by a private key in WIF format and a public key - address).
     *
     * @return {object}
     */
newWallet = function() {
    function myRng (n) {
      var buf = new Buffer(n)
      var num =  Math.floor((Math.random() * (2500000000 * 10)) + 1) //Demo purposes only
      buf.fill(num)
      return buf
    }
    var keyPair = bitcoin.ECPair.makeRandom({
      rng: random
    })
    return {
        keyPair: keyPair,
        wif: keyPair.toWIF(),
        address: keyPair.getAddress()
    };
}

export default newWallet;
