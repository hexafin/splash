/*

Wallet.js defines firestore operations with hexa wallets

 */

var random = require('react-native-randombytes').randomBytes;
var bitcoin = require('bitcoinjs-lib');


import firebase from 'react-native-firebase';
let firestore = firebase.firestore();


function NewPersonalWallet(personRef, description) {

    // create hexa wallet
    personRef.get().then(person => {

        var hex = GenerateHex(person.data()["first_name"], person.data()["last_name"]);

        var ownership = {};
        ownership[personRef.id] = 1.0;

        var walletName = person.data()["first_name"] + " " + person.data()["last_name"] + "'s Personal Wallet";

        // create bitcoin wallet
        // TODO: store private key locally in private_keys object {wallet_id:private_key,...}

        var bitcoinWallet = NewBitcoinWallet();


        var newWalletRef = firestore.collection("wallets").add({
            ownership: ownership,
            type: "personal",
            address_bitcoin: bitcoinWallet.address,
            hex: hex,
            name: walletName,
            description: description
        });

        return newWalletRef;

    });


}

function NewGroupWallet(hex, description, members, ownership, signing_members) {

    // create hexa wallet

    // create group bitcoin wallet with signing structure
    // store private key locally in private_keys object {wallet_id:private_key,...}

    // update hexa wallet with bitcoin wallet's public key

}

function GenerateHex(first_name, last_name, num=0) {

    // initialize hex
    var hex = first_name + "-" + last_name;
    if (num > 0) {
        hex = hex + num.toString();
    }

    if (HexExists(hex)) {
        return GenerateHex(first_name, last_name, num=num+1);
    }
    else {
        return hex;
    }

}

function HexExists(hex) {
    // check if hex already exists
    firestore.collection("wallets").where("hex", "=", hex).get().then(check_hex => {

        if (check_hex.empty) {
            return false;
        }
        else {
            return true;
        }

    });
}


/**
 * Creates a random new wallet (keypair composed by a private key in WIF format and a public key - address).
 *
 * @return {object}
 */
function NewBitcoinWallet() {
    var keyPair = bitcoin.ECPair.makeRandom({
        rng: random
    });
    return {
        keyPair: keyPair,
        wif: keyPair.toWIF(),
        address: keyPair.getAddress()
    };
}

export { NewPersonalWallet, NewGroupWallet, GenerateHex, HexExists };