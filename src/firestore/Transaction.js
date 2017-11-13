// import all relevant modules
import NewBitcoinWallet from 'src/actions/NewBitcoinWallet';

// function sends money from authenticated wallet to specified recipient
function Pay(to_wallet, from_wallet, category, memo, amount_fiat, amount_crypto, fiat="usd", crypto="btc") {

    // if person has signing permissions
        // create bitcoin transaction and push to blockchain
        // create transaction entity
        // create transaction message in chat between to_wallet and from_wallet with transaction reference
        // notify other wallet members and recipient wallet members of transaction
    // if person does not have signing permissions
        // create suggested transaction entity
        // create suggested-transaction message in internal wallet chat
        // notify members of wallet that a transaction has been suggested

}

// function that requests money from outside wallet to authenticated wallet
function Request(from_wallet, to_wallet, category, memo, amount_fiat, amount_crypto, fiat="usd", crypto="btc") {

    // if person has signing permissions
        // generate bitcoin request hash
        // create transaction entity
        // create request transaction message in chat between to_wallet and from_wallet with transaction reference
        // notify other wallet members and recipient wallet members of request
    // if person does not have signing permissions
        // create suggested transaction entity for request
        // create suggested-transaction message for request in internal wallet chat
        // notify members of wallet that a request-transaction has been suggested

}

// function that accepts a transaction
function Accept(transaction_id) {

    // if acceptor_person has signing permissions for acceptor_wallet
        // create bitcoin transaction and push to blockchain
        // update transaction entity
        // notify to and from wallet members of acceptance

    // no need to update messages in chats, as the transaction messages simply reference the transaction doc

}

// function that declines a transaction
function Decline(transaction_id) {

    // if acceptor_person has signing permissions for acceptor_wallet
        // update transaction entity
        // notify to and from wallet members of decline

    // no need to update messages in chats, as the transaction messages simply reference the transaction doc

}

export { Pay, Request, Accept, Decline };