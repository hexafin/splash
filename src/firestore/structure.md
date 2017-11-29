# Hexa Firestore Structure

## Helpful Resources
- Collections are types of entities (wallets, transactions, etc.)
- Documents are specific instances of these entities (wallet, transaction, etc.)
- Each document is composed of data: key-value pairs with a number of value types

For more information check out the Firestore docs
https://cloud.google.com/firestore/docs/concepts/structure-data
https://rnfirebase.io/

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

- `ownership`
    - *not defined for personal wallets*
    - object with person_id keys and percentage values
    - initially, group wallets are assumed to be equally owned
        - thus they are initialized to `[(person_id, 1.0/number_of_people)...]`
- `type`
    - values
        - `personal`
        - `group`
        - `merchant`
- `address_bitcoin`
- `picture_url`
    - *defaults to facebook photo*
- `hex`
    - username within hexa system (eg. @john-smith-1)
- `name`
    - text name describing wallet
- `phone_number`
    - *defaults to personal phone number*
- `email`
    - *defaults to personal email*
- `person`
    - *only defined for personal wallets*
    - reference to person
- `members`
    - *not defined for personal wallets, as they only have a single member (the owner)*
    - object of person_id:true entries
- `transactions`
    - array of references to transaction documents
    - see transactions docs below
- `description`
- `signing_members`
    - *not defined for personal wallets*
    - subset of members that have signing privileges
- `created`
    - creation timestamp


### chats

**note:** a group wallet may communicate with another wallet, so the chat my have more than 2 people, 
but never more than 2 wallets

- `type`
    - values
        - `friend`
        - `merchant`
        - `internal`
- `wallets`
    - object of wallet_id keys and true values
    - eg. `{wallet_id1:true, wallet_id2:true}`
    - optimized for firestore queries
    - *not defined for internal chats*
- `wallet`
    - *only defined for internal chats*
    - reference to wallet
- `messages`
    - subcollection of message documents
    - see messages documentation below


### messages

Messages are a subcollection of a specific chat between two wallets

- `type`
    - acceptable values
        - `text`
        - `transaction`
- `transaction`
    - *only defined for transaction type messages*
    - reference to transaction document in the transactions collection
- `to_wallet`
    - *only defined for text type messages, as transaction data is in transaction doc*
    - wallet reference
    - *not defined for internal chat messages*
- `from_wallet`
    - *only defined for text type messages, as transaction data is in transaction doc*
    - reference to wallet
    - *not defined for internal chat messages*
- `from_person`
    - *only defined for text type messages*
    - reference to person
- `text`
- `read_by`
    - array of person ids
- `timestamp`


### transactions

**note:** a hexa transaction is not the same thing as a traditional bitcoin transaction: 
hexa adds context to bitcoin transactions with relevant information

- `type`
    - values
        - `friend`
        - `merchant`
- `suggested`
    - boolean
    - always false unless someone without paying permissions initialized a payment
- `initiated`
    - boolean
- `completed`
    - boolean
- `declined`
    - boolean
    - *only defined if recipient declines transaction*
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
    - this person must have payment permissions. if someone else suggested the transaction, this reference
    is to the person that approved the suggested transaction
- `acceptor_wallet`
    - *not defined unless transaction is completed*
    - reference to wallet that accepted the transaction
- `acceptor_person`
    - *not defined unless transaction is completed*
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
    - **note:** this value is not set until the transaction is completed, so the acceptor does not subject themselves to 
    price fluctuations in the event of a request
- `conversion_rate_at_transaction`
    - from crypto to fiat
- `blockchain_transaction_id`
    - reference to transaction on blockchain
- `category`
- `memo`
- `timestamp_suggested`
    - *only defined if transaction was suggested*
- `timestamp_initiated`
- `timestamp_completed`
- `timestamp_declined`
    - *only defined if transaction was declined*


### notifications

- `type`
    - values
        - `transaction`
        - `message`
- `action`
    - values if type = `transaction`
        - `pay`
        - `request`
        - `accepted`
        - `declined`
    - values if type = `message`
        - `new`
- `person`
    - reference to person that received notification
- `method`
    - values
        - `app`
        - `text`
        - `email`
- `content`
- `format`
    - `plaintext`
    - `html`
        - *only possible if method = `email`*
- `timestamp`






