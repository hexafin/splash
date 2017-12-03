import firebase from 'react-native-firebase'
let firestore = firebase.firestore()
let random = require('react-native-randombytes').randomBytes;
let bitcoin = require('bitcoinjs-lib');

// GenerateUsername finds a unique username from a person's first and last name
function GenerateUsername(firstName, lastName, num=0) {

    // initialize hex
    var username = firstName.toLowerCase() + "-" + lastName.toLowerCase();
    if (num > 0) {
        username = username + num.toString();
    }

    UsernameExists(username).then(exists => {
        if (exists) {
            return GenerateUsername(firstName, lastName, num=num+1);
        }
        else {
            return username
        }
    })

}

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

export const NewAccount = ({username, firstName, lastName, email, phoneNumber, facebookId, pictureURL, address, city, state,
                           zipCode, country, coinbaseId=null}) => {

    return new Promise ((resolve, reject) => {

        const bitcoinWallet = NewBitcoinWallet()

        const dateTime = Date.now();
        const ts = Math.floor(dateTime / 1000);

        firestore.collection("people").add({
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phoneNumber,
            facebook_id: facebookId,
            picture_url: pictureURL,
            address: address,
            city: city,
            state: state,
            zip_code: zipCode,
            country: country,
            address_bitcoin: bitcoinWallet.address,
            coinbase_id: coinbaseId,
            joined: ts
        }).then(personRef => {
            personRef.get().then(person => {
                resolve((person, personRef))
            })
        }).catch(error => {
            reject(error)
        })

    })

}

export default api = {
    NewAccount: NewAccount,
    UsernameExists: UsernameExists
}