import firebase from 'react-native-firebase'
let firestore = firebase.firestore()
let random = require('react-native-randombytes').randomBytes;
let bitcoin = require('bitcoinjs-lib');

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

const NewAccount = (uid, {username, firstName, lastName, email, facebookId, pictureURL, address=null, city=null,
                    state=null, zipCode=null, country=null, phoneNumber=null, coinbaseId=null}) => {

    return new Promise ((resolve, reject) => {

        const bitcoinWallet = NewBitcoinWallet()

        const dateTime = Date.now();
        const ts = Math.floor(dateTime / 1000);

        firestore.collection("people").doc(uid).update({
            joined: ts,
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phoneNumber,
            facebook_id: facebookId,
            picture_url: pictureURL,
            address_bitcoin: bitcoinWallet.address,
            // address: address,
            // city: city,
            // state: state,
            // zip_code: zipCode,
            // country: country,
            // coinbase_id: coinbaseId,
        }).then(personRef => {
            personRef.get().then(person => {
                resolve(person)
            })
        }).catch(error => {
            reject(error)
        })

    })

}

// takes address and returns balance or error
// calls internal api
function GetBalance(address) {
    return new Promise((resolve, reject) => {
        const APIaddress = 'https://us-central1-hexa-dev.cloudfunctions.net/GetBalance';
        axios.post(APIaddress, {
            address: address,
        })
            .then(response => {
                if (response.data.balance !== null){
                    resolve(response.data.balance);
                } else {
                    reject('Cannot retrieve balance');
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}

// takes from, to, privateKey, amtSantoshi
// outputs txHash or error
function BuildBitcoinTransaction(from, to, privateKey, amtSantoshi) {
    GetBalance(from).then((balanceSantoshi) => {
        if (amtSantoshi <= balanceSantoshi) {
            bitcoinTransaction.sendTransaction({
                from: from,
                to: to,
                privKeyWIF: key,
                // TODO: figure out better way of converting to BTC
                btc: amtSantoshi*0.00000001,
                fee: 'hour',
                dryrun: true,
                network: "mainnet"
            }).then(txHash => {
                return txHash;
            }).catch(error => {
                return 'Error: cannot build transaction';
            });
        } else {
            return 'Error: not enough btc.';
        }
    }).catch(error => {
        return 'Error: unable to get btc balance.';
    });
}

export default api = {
    NewAccount: NewAccount,
    UsernameExists: UsernameExists,
    GetBalance: GetBalance,

}