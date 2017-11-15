
import firebase from 'react-native-firebase';
let firestore = firebase.firestore();

import { NewPersonalWallet } from "./Wallet";

function NewPerson(first_name, last_name, email, phone_number, facebook_id, picture_url, address, city, state,
                   zip_code, country, coinbase_id=null) {

    const dateTime = Date.now();
    const ts = Math.floor(dateTime / 1000);

    // create firestore person entity
    firestore.collection("people").add({
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_number: phone_number,
        facebook_id: facebook_id,
        picture_url: picture_url,
        address: address,
        city: city,
        state: state,
        zip_code: zip_code,
        country: country,
        coinbase_id: null,
        joined: ts
    }).then(newPersonRef => {
        NewPersonalWallet(newPersonRef);

        return newPersonRef;
    });



}



export { NewPerson };