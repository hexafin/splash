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

    if (UsernameExists(username)) {
        return GenerateUsername(firstName, lastName, num=num+1);
    }
    else {
        return username;
    }

}

function UsernameExists(username) {
    // check if hex already exists
    firestore.collection("people").where("username", "=", username).get().then(checkUsername => {

        if (checkUsername.empty) {
            return false;
        }
        else {
            return true;
        }

    });
}

function NewBitcoinWallet() {
    var keyPair = bitcoin.ECPair.makeRandom({
        rng: random
    });
    return {
        keyPair: keyPair,
        wif: keyPair.toWIF(),
        address: keyPair.getAddress()
    };
}

export const NewAccount = ({firstName, lastName, email, phoneNumber, facebookId, pictureURL, address, city, state,
                           zipCode, country, coinbaseId=null}) => {

    return new Promise ()

    const username = GenerateUsername(firstName, lastName)
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
            dispatch(newAccountSuccess(person))
        })
    })

}

export default api = {
    NewAccount: NewAccount,
    UsernameExists: UsernameExists
}