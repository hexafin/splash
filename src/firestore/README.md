# Hexa Firestore Structure

## Helpful Resources
- Collections are types of entities (wallets, transactions, etc.)
- Documents are specific instances of these entities (wallet, transaction, etc.)
- Each document is composed of data: key-value pairs with a number of value types

For more information check out the Firestore docs
https://cloud.google.com/firestore/docs/concepts/structure-data

## Entities

### people

- `first_name`
- `last_name`
- `email`
- `phone_number`
- `phone_type`
    - example values
        - `iPhone 7`
        - `iPhone X`
        - `samsung note`
- `phone_os`
    - example values
        - `ios 11`
        - `ios 10`
        - `android `
- `phone_id`
- `facebook_id`
- `coinbase_id`
    - *not defined unless coinbase is linked*
- `picture_url`
- `address`
- `city`
- `state`
- `zip_code`
- `country`
- `joined_date`
    - timestamp of account creation


### wallets

**note:** Hexa wallets are not the same thing as traditional bitcoin wallets.

- `ownershipp`
    - array of wallet_id:percentage_ownership pairs
    - personal wallets will initialize to `[(personal_id, 1.0)]`
    - initially, group wallets are assumed to be equally owned
        - thus they are initialized to `[(person_id, 1.0/number_of_people)...]`
- `type`
    - values
        - `personal`
        - `group`
        - `merchant`
- `address_bitcoin`
- `picture_url`
    - *not defined for personal wallets, as they always use the picture associated with the person*
- `hex`
    - username within hexa system (eg. @john-smith-1)
- `members`
    - *not defined for personal wallets, as they only have a single member (the owner)*
    - array of people objects
- `transactions`
    - array of references to transaction documents
    - see transactions docs below
- `description`
- `voting_members`
    - subset of members that have voting priveledges
- `created`
    - creation timestamp


### chats

**note:** a group wallet may communicate with another wallet, so the chat my have more than 2 people, 
but never more than 2 wallets

- `type`
    - values
        - `friend`
        - `merchant`
- `wallets`
    - tuple of wallet ids
- `members`
    - array of people ids
- `messages`
    - subcollection of message documents
    - see messages documentation below


### messages

Messages are a subcollection of a specific chat between two wallets

- `type`
    - acceptable values
        - `text`
        - `transaction`
- `transaction_id`
    - *only defined for transaction type messages*
    - reference to transaction document in the transactions collection
- `to_wallet`
    - *only defined for text type messages, as transaction data is in transaction doc*
    - wallet id
- `from_wallet`
    - *only defined for text type messages, as transaction data is in transaction doc*
    - wallet id
- `from_person`
    - *only defined for text type messages*
    - person id
- `read_by`
    - array of person ids


### transactions

**note:** a hexa transaction is not the same thing as a traditional bitcoin transaction: 
hexa adds context to bitcoin transactions with relevant information

- `completed`
    - boolean
- `from_wallet`
    - reference to wallet paying
- `from_person`
    - reference to person paying
- `to_wallet`
    - reference to wallet being paid
- `initator_wallet`
    - reference to wallet that started the transaction
    - if the transaction has not yet completed, this value determines whether the money is owed or requested
- `initiator_person`
    - reference to person that started the transaction
- `acceptor_wallet`
    - reference to wallet that accepted the transaction
- `acceptor_person`
    - reference to person that accepted the transaction on behalf of the acceptor wallet
- `fiat`
    - values
        - `usd`
        - `eur`
- `amount_fiat`
    - numerical value
    - eg. `100.00`
- `crypto`
    - values
        - `btc`
        - `eth`
- `amount_crypto`
    - numerical value
    - bitcoin is denoted in Satoshis (smallest fraction of bitcoin)
- `conversion_rate_at_transaction`
    - from crypto to fiat










