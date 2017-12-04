/*

Wallet.js defines firestore operations with hexa wallets

 */


import firebase from 'react-native-firebase';
let firestore = firebase.firestore();
var random = require('react-native-randombytes').randomBytes;
var bitcoin = require('bitcoinjs-lib');
var axios = require('axios');

import { NewInternalChat } from "./Chat";

function NewPersonalWallet(personRef, description) {
    return new Promise((resolve, reject) => {
        // create hexa wallet
        personRef.get().then(person => {

            var hex = GenerateHex(person.data()["first_name"].toLowerCase(), person.data()["last_name"].toLowerCase());

            var walletName = person.data()["first_name"] + " " + person.data()["last_name"];

            // create bitcoin wallet
            var bitcoinWallet = NewBitcoinWallet();

            // TODO: store key locally in wallet_id object {bitcoin:WIF,ethereum:ethWiF,...}
            var wif = bitcoinWallet.wif;

            firestore.collection("wallets").add({
                type: "personal",
                address_bitcoin: bitcoinWallet.address,
                hex: hex,
                name: walletName,
                description: description,
                picture_url: person.data()["picture_url"],
                person: personRef
            }).then(walletRef => {
                resolve(walletRef);
            });

        });
    });
}

// TODO: NewGroupWallet
function NewGroupWallet(hex, description, memberRefs, ownership, signingMemberRefs) {

    // create hexa wallet
    var redeemScript = bitcoin.script.multisig.output.encode(2, pubKeys); // 2 of 3
    var scriptPubKey = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript));
    var address = bitcoin.address.fromOutputScript(scriptPubKey);



    // create internal chat from wallet ref
    NewInternalChat()


    // TODO: Group Wallet ownership
    // var ownership = {};
    // ownership[personRef.id] = 1.0;

    // create group bitcoin wallet with signing structure
    // store private key locally in private_keys object {wallet_id:private_key,...}

    // update hexa wallet with bitcoin wallet's public key

}

// GenerateHex finds a unique hex from a person's first and last name
function GenerateHex(firstName, lastName, num=0) {

    // initialize hex
    var hex = firstName + "-" + lastName;
    if (num > 0) {
        hex = hex + num.toString();
    }

    if (HexExists(hex)) {
        return GenerateHex(firstName, lastName, num=num+1);
    }
    else {
        return hex;
    }

}

function HexExists(hex) {
    // check if hex already exists
    firestore.collection("wallets").where("hex", "=", hex).get().then(checkHex => {

        if (checkHex.empty) {
            return false;
        }
        else {
            return true;
        }

    });
}

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
