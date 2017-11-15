
import firebase from 'react-native-firebase';
let firestore = firebase.firestore();

function NewPerson(first_name, last_name, email, phone_number, facebook_id, picture_url, address, city, state,
                   zip_code, country, coinbase_id=null) {

    // create firestore person entity
    var newPersonRef = firestore.collection("people").add({
        first_name: "Lukas",
        last_name: "Burger"
    });


    // create personal starter wallet with NewPersonalWallet

}

export { NewPerson };