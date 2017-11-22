// import relevant modules
import firebase from 'react-native-firebase';
let firestore = firebase.firestore();

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
        wallets: walletRef
    }).then(chatRef => {
        return chatRef
    });

}

function NewTextMessage(chatRef, fromPersonRef, text) {

    // create text message in chat referenced

    // notify all members of chat besides the sender

}

function NewTransactionMessage(transactionRef) {

    // get wallets engaged with transaction

    // if transaction is suggested but not initiated
        // get relevant internal chat_id
        // create internal transaction message, which will automatically pull suggested status
    // if transaction is not suggested, but rather initiated or completed
        // get relevant 2-way chat_id
        // create transaction message in chat

    // no notifications, as the Transaction functions take care of this

}

export { NewChat, NewInternalChat, NewTextMessage, NewTransactionMessage };