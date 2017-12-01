
import firebase from 'react-native-firebase';
let firestore = firebase.firestore();

import { NewPersonalWallet } from "./Wallet";

function NewPerson(firstName, lastName, email, phoneNumber, facebookId, pictureURL, address, city, state,
                   zipCode, country, coinbaseId=null) {

    const dateTime = Date.now();
    const ts = Math.floor(dateTime / 1000);

    // create firestore person entity
    firestore.collection("people").add({
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
        coinbase_id: coinbaseId,
        joined: ts
    }).then(newPersonRef => {
        NewPersonalWallet(newPersonRef).then(newWalletRef => {
            return {
                person: newPersonRef,
                wallet: newWalletRef
            }
        });
    });



}

export { NewPerson };