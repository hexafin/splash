/*

Teansaction.js defines firestore operations with bitcoin transactions for hexa wallets

 */


import firebase from 'react-native-firebase';
let firestore = firebase.firestore();
var random = require('react-native-randombytes').randomBytes;
var bitcoin = require('bitcoinjs-lib');

import { NewChat, NewTransactionMessage } from "./Chat";
import { TransactionNotification } from "./Notify";

// function sends money from authenticated wallet to specified recipient
function Pay(toWalletRef, fromWalletRef, category, memo, amountFiat, amountCrypto, fiat="usd", crypto="btc") {

    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);

    // load wallets
    fromWalletRef.get().then(fromWallet => {
        // check signing permissions
        var signingMembers = fromWallet.data()["signing_members"];

        // TODO: get personRef from authentication
        var personRef = "TODO";

        if (signingMembers.hasOwnProperty(personRef)) {

            // TODO: get conversion rate from crypto to fiat
            var conversionRate = "TODO";

            // TODO: retrieve wif (stored locally or on iCloud)
            var wif = "TODO";
            var key = bitcoin.ECKey.fromWIF(wif);

            // build transaction
            var blockchainTransactionId = BuildBitcoinTransaction();

            // person has signing permissions => create transaction
            firestore.collection("transactions").add({
                suggested: false,
                initiated: true,
                completed: true,
                from_wallet: fromWalletRef,
                from_person: personRef,
                to_wallet: toWalletRef,
                initiator_wallet: fromWalletRef,
                initiator_person: personRef,
                category: category,
                memo: memo,
                fiat: fiat,
                amount_fiat: amountFiat,
                crypto: crypto,
                amount_crypto: amountCrypto,
                conversion_rate_at_transaction: conversionRate,
                blockchain_transaction_id: blockchainTransactionId,
                timestamp_initiated: timestamp,
                timestamp_completed: timestamp
            }).then(transactionRef => {
                // create transaction message
                NewTransactionMessage(transactionRef);
                // create notification
                TransactionNotification(transactionRef);
            });

        }
        else {

            // person does not have signing permissions
            firestore.collection("transactions").add({
                suggested: true,
                initiated: false,
                completed: false,
                from_wallet: fromWalletRef,
                from_person: personRef,
                to_wallet: toWalletRef,
                initiator_wallet: fromWalletRef,
                initiator_person: personRef,
                category: category,
                memo: memo,
                fiat: fiat,
                amount_fiat: amountFiat,
                crypto: crypto,
                timestamp_suggested: timestamp
            }).then(transactionRef => {
                // create transaction message
                NewTransactionMessage(transactionRef);
                // create notification
                TransactionNotification(transactionRef);
            });

        }
    })

}

// function that requests money from outside wallet to authenticated wallet
function Request(fromWalletRef, toWalletRef, category, memo, amountFiat, amountCrypto, fiat="usd", crypto="btc") {

    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);

    // load wallets
    toWalletRef.get().then(toWallet => {
        // check signing permissions
        var signingMembers = toWallet.data()["signing_members"];

        // TODO: get personRef from authentication
        var personRef = "TODO";

        if (signingMembers.hasOwnProperty(personRef)) {

            // TODO: build transaction request blockchain block (not necessary for v1)

            // person has signing permissions => create transaction request
            firestore.collection("transactions").add({
                suggested: false,
                initiated: true,
                completed: false,
                from_wallet: fromWalletRef,
                from_person: null,
                to_wallet: toWalletRef,
                initiator_wallet: toWalletRef,
                initiator_person: personRef,
                category: category,
                memo: memo,
                fiat: fiat,
                amount_fiat: amountFiat,
                crypto: crypto,
                timestamp_initiated: timestamp
            }).then(transactionRef => {
                // create transaction message
                NewTransactionMessage(transactionRef);
                // create notification
                TransactionNotification(transactionRef);
            });

        }
        else {

            // person does not have signing permissions => create suggested request
            firestore.collection("transactions").add({
                suggested: true,
                initiated: false,
                completed: false,
                from_wallet: fromWalletRef,
                from_person: null,
                to_wallet: toWalletRef,
                initiator_wallet: toWalletRef,
                initiator_person: personRef,
                category: category,
                memo: memo,
                fiat: fiat,
                amount_fiat: amountFiat,
                crypto: crypto
            }).then(transactionRef => {
                // create transaction message
                NewTransactionMessage(transactionRef);
                // create notification
                TransactionNotification(transactionRef);
            });

        }
    })

}

// function that accepts a transaction
function Accept(transactionRef) {

    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);

    // get personRef from state
    var personRef = "TODO";

    // load transaction entity
    transactionRef.get().then(transaction => {

        // check if person has signing permissions
        var fromWalletRef = transaction["from_wallet"];
        fromWalletRef.get().then(fromWallet => {

            var signingMembers = fromWallet["signing_members"];

            if (signingMembers.hasOwnProperty(personRef)) {
                // user can sign

                // TODO: get conversion rate from crypto to fiat
                var conversionRate = "TODO";

                // TODO: retrieve wif (stored locally or on iCloud)
                var wif = "TODO";
                var key = bitcoin.ECKey.fromWIF(wif);

                // build transaction
                var blockchainTransactionId = BuildBitcoinTransaction();

                // update transaction entity
                transactionRef.update({
                    completed: true,
                    acceptor_wallet: fromWalletRef,
                    acceptor_person: personRef,
                    timestamp_completed: timestamp
                });

                // send appropriate notifications
                TransactionNotification(transactionRef);

                return {
                    success: true
                };
            }
            else {
                // user cannot sign
                return {
                    failed: true,
                    error: "signing privileges"
                };
            }
        });

    });
}

// function that declines a transaction
function Decline(transactionRef) {

    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);

    // get personRef from state
    var personRef = "TODO";

    // load transaction entity
    transactionRef.get().then(transaction => {

        // check if person has signing permissions
        var fromWalletRef = transaction["from_wallet"];
        fromWalletRef.get().then(fromWallet => {

            var signingMembers = fromWallet["signing_members"];

            if (signingMembers.hasOwnProperty(personRef)) {
                // user can sign

                // update transaction entity
                transactionRef.update({
                    declined: true,
                    timestamp_declined: timestamp
                });

                // send appropriate notifications
                TransactionNotification(transactionRef);

                return {
                    success: true
                }
            }
            else {
                // user cannot sign
                return {
                    failed: true,
                    error: "signing privileges"
                };
            }
        });

    });
}

// TODO: function that builds bitcoin tx
function BuildBitcoinTransaction() {
    // https://github.com/bitcoinjs/bitcoinjs-lib/issues/339

    return "TODO"
}

// TODO: cloud function => on blockchain update for hexa wallets, refresh wallet balance, send appropriate notifications

// TODO: cloud function => on transaction doc update/creation, if completed = true, push tx to blockchain

export { Pay, Request, Accept, Decline };