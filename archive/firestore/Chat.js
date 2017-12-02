// import relevant modules
import firebase from 'react-native-firebase';
let firestore = firebase.firestore();

import { MessageNotification } from "./Notify";

// function that creates chat and returns chat reference
function NewChat(type, wallets) {

    // create walletsObject from input wallets array
    var walletsObject = {};
    for (var i = 0; i < wallets.length; i++) {
        walletsObject[wallets[i]] = true;
    }

    // create friend or merchant chat between two wallets
    firestore.collection("chats").add({
        type: type,
        wallets: walletsObject
    }).then(chatRef => {
        return chatRef
    });

}

// function that creates an internal chat and returns a reference to the chat
function NewInternalChat(walletRef) {

    // create internal chat for all members of group wallet
    firestore.collection("chats").add({
        type: "internal",
        wallet: walletRef
    }).then(chatRef => {
        return chatRef
    });

}

function NewTextMessage(chatRef, fromWalletRef, fromPersonRef, toWalletRef, text) {

    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);

    // create text message in chat referenced
    chatRef.collection("messages").add({
        type: text,
        to_wallet: toWalletRef,
        from_wallet: fromWalletRef,
        from_person: fromPersonRef,
        text: text,
        read_by: [],
        timestamp: timestamp
    }).then(messageRef => {
        // notify all members of chat besides the sender
        MessageNotification(messageRef);
    });

    return {
        "success": true
    }

}

function NewTransactionMessage(transactionRef) {

    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);

    // get wallets engaged with transaction
    transactionRef.get().then(transaction => {

        // check if suggested suggested but not initiated
        if (transaction["suggested"] == true && transaction["initiated"] == false) {

            // get internal chat
            firestore.collection("chats").where("wallet", "=", transaction["initiator_wallet"])
                .get().then(checkChat => {

                var chatRef = checkChat["docs"][0];

                // add transaction message
                chatRef.collection("messages").add({
                    type: "transaction",
                    transaction: transactionRef,
                    read_by: [],
                    timestamp: timestamp
                }).then(messageRef => {
                    return messageRef;
                });

            });

        }

        else {

            // transaction completed => put it in external chat

            var propToWallet = "wallet." + transaction["to_wallet"];
            var propFromWallet = "wallet." + transaction["from_wallet"];

            // get chat
            firestore.collection("chats").where([propToWallet, "=", true], [propFromWallet, "=", true])
                .get().then(checkChat => {

                // if chat does not yet exist, create it
                if (checkChat.empty) {
                    var chatRef = NewChat(transaction["type"], [transaction["to_wallet"], transaction["from_wallet"]]);
                }
                else {
                    // chat exists and is in query results
                    var chatRef = checkChat["docs"][0];
                }

                // add transaction message
                chatRef.collection("messages").add({
                    type: "transaction",
                    transaction: transactionRef,
                    read_by: [],
                    timestamp: timestamp
                }).then(messageRef => {
                    return messageRef;
                });

            });

        }

    });

}

export { NewChat, NewInternalChat, NewTextMessage, NewTransactionMessage };