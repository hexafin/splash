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

- `username`
- `first_name`
- `last_name`
- `password`
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
- `from_person`
    - reference to person paying
- `to_person`
    - reference to person being paid
- `initiator_person`
    - reference to person that started the transaction
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







