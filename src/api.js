import firebase from 'react-native-firebase'
let firestore = firebase.firestore()
let random = require('react-native-randombytes').randomBytes
let bitcoin = require('bitcoinjs-lib')
let bitcoinTransaction = require('bitcoin-transaction')
var axios = require('axios')

function UsernameExists(username) {
    return new Promise((resolve, reject) => {
        // check if hex already exists
        firestore.collection("people").where("username", "=", username).get().then(checkUsername => {

            if (checkUsername.empty) {
                resolve(false)
            }
            else {
                resolve(true)
            }

        }).catch(error => {
            reject(error)
        });
    })
}

function NewBitcoinWallet() {
    var keyPair = bitcoin.ECPair.makeRandom({
        rng: random
    })
    return {
        keyPair: keyPair,
        wif: keyPair.toWIF(),
        address: keyPair.getAddress()
    }
}

const NewAccount = (uid, {username, firstName, lastName, email, facebookId, pictureURL, address=null, city=null,
                    state=null, zipCode=null, country=null, phoneNumber=null, coinbaseId=null}) => {

    return new Promise ((resolve, reject) => {

        const bitcoinWallet = NewBitcoinWallet()

        const dateTime = Date.now();
        const ts = Math.floor(dateTime / 1000);

        const newPerson = {
            joined: ts,
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            facebook_id: facebookId,
            picture_url: pictureURL,
            address_bitcoin: bitcoinWallet.address,
            // phone_number: phoneNumber,
            // address: address,
            // city: city,
            // state: state,
            // zip_code: zipCode,
            // country: country,
            // coinbase_id: coinbaseId,
        }

        firestore.collection("people").doc(uid).set(newPerson).then(() => {
            resolve({
              person: newPerson,
              privateKey: bitcoinWallet.wif,
            })
        }).catch(error => {
            reject(error)
        })

    })

}

const UpdateAccount = (uid, {updateDict}) => {

    return new Promise ((resolve, reject) => {

        firestore.collection("people").doc(uid).update(updateDict).then(() => {
            firestore.collection("people").doc(uid).get().then(person => {
                resolve(person)
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })

    })

}

// takes address and returns balance or error
// calls internal api
function GetBalance(address) {
    return new Promise((resolve, reject) => {
        const APIaddress = 'https://us-central1-hexa-dev.cloudfunctions.net/GetBalance';
        axios.post(APIaddress, {
            address: address,
        })
            .then(response => {
                if (response.data.balance !== null){
                    resolve(response.data.balance);
                } else {
                    reject('Cannot retrieve balance');
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}

// takes from, to, privateKey, amtSatoshi
// outputs txHash or error
function BuildBitcoinTransaction(from, to, privateKey, amtBTC) {
    return new Promise((resolve, reject) => {

      GetBalance(from).then((balanceSatoshi) => {
      
          if (amtBTC < balanceSatoshi*0.00000001) {
              bitcoinTransaction.sendTransaction({
                  from: from,
                  to: to,
                  privKeyWIF: privateKey,
                  // TODO: figure out better way of converting to BTC
                  btc: amtBTC,
                  fee: 'hour',
                  dryrun: true,
                  network: "mainnet",
                  // feesProvider: bitcoinTransaction.providers.fees.mainnet.earn,
                  // utxoProvider: bitcoinTransaction.providers.utxo.mainnet.blockchain,
              }).then(txHex => {
                  const tx = bitcoin.Transaction.fromHex(txhex);
                  const txid = tx.getId();
                  resolve({
                    txid: txid,
                    txhex: txhex,
                  });
              }).catch(error => {
                  reject(error);
              });
          } else {
              reject('Error: not enough btc.');
          }
      }).catch(error => {
          reject(error);
      });
  })
}

// new transaction
function NewTransaction(uid, type, other_person, emoji, conversion_rate_at_transaction,
                        amount_crypto, amount_fiat, txId) {

    // TODO: process differently if type='request'

    return new Promise ((resolve, reject) => {


        const dateTime = Date.now();
        const timestamp_initiated = Math.floor(dateTime / 1000);
        let newTransaction = {};

        if (type == 'pay') {
          newTransaction = {
            type: type,
            initiated: true,
            completed: true,
            from_person: uid,
            to_person: other_person,
            fiat: 'usd',
            amount_fiat: amount_fiat,
            crypto: 'btc',
            amount_crypto: amount_crypto, // must be in Satoshis
            conversion_rate_at_transaction: conversion_rate_at_transaction,
            transaction_id: txId,
            emoji: emoji,
            timestamp_initiated: timestamp_initiated,
            timestamp_completed: timestamp_initiated,
          }
        } else if (type == 'request') {
          newTransaction = {
            type: type,
            initiated: true,
            completed: false,
            from_person: other_person,
            to_person: uid,
            fiat: 'usd',
            amount_fiat: amount_fiat,
            crypto: 'btc',
            amount_crypto: amount_crypto, // must be in Satoshis
            conversion_rate_at_transaction: conversion_rate_at_transaction,
            transaction_id: txId,
            emoji: emoji,
            timestamp_initiated: timestamp_initiated,
            timestamp_completed: null,
          }
        }
        firestore.collection("transactions").doc(txId).set(newTransaction).then(() => {
            resolve(newTransaction)
        }).catch(error => {
            reject(error)
        })

    })

}

// log
function Log(type, content) {
    if (type == "feedback") {

        const data = {
            text: content
        }

        axios.post("https://hooks.slack.com/services/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", data).then(response => {
            return response
        }).catch(error => {
            return error
        })
    }
}

export default api = {
    NewAccount: NewAccount,
    UpdateAccount: UpdateAccount,
    UsernameExists: UsernameExists,
    BuildBitcoinTransaction: BuildBitcoinTransaction,
    NewTransaction: NewTransaction,
    GetBalance: GetBalance,
    Log: Log
}
