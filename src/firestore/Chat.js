// import relevant modules

function NewChat(type, wallets) {

    // create friend or merchant chat between two wallets

}


function NewInternalChat(wallet_id) {

    // create internal chat for all members of group wallet

}

function NewTextMessage(chat_id, from_person, text) {

    // create text message in chat referenced

    // notify all members of chat besides the sender

}

function NewTransactionMessage(transaction_id) {

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