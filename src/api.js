import firebase from 'react-native-firebase'
let firestore = firebase.firestore()
let random = require('react-native-randombytes').randomBytes
let bitcoin = require('bitcoinjs-lib')
let bitcoinTransaction = require('bitcoin-transaction')
var axios = require('axios')
const SATOSHI_CONVERSION = 100000000;

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
        const ts = Math.floor(dateTime*1.0 / 1000);

        const newPerson = {
            joined: ts,
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            coinbase_id: null,
            facebook_id: facebookId,
            picture_url: pictureURL,
            address_bitcoin: bitcoinWallet.address,
            // phone_number: phoneNumber,
            // address: address,
            // city: city,
            // state: state,
            // zip_code: zipCode,
            // country: country,
            // coinbase_id: coinbaseId,
        }

        firestore.collection("people").doc(uid).set(newPerson).then(() => {
            resolve({
              person: newPerson,
              privateKey: bitcoinWallet.wif,
            })
        }).catch(error => {
            reject(error)
        })

    })

}

const UpdateAccount = (uid, updateDict) => {

    return new Promise ((resolve, reject) => {

        firestore.collection("people").doc(uid).update(updateDict).then(() => {
            firestore.collection("people").doc(uid).get().then(person => {
                resolve(person)
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })

    })

}

const HandleCoinbase = (uid, coinbaseDict) => {
  //get coinbase user info and update firebase

  return new Promise ((resolve, reject) => {
    const AuthStr = 'Bearer '.concat(coinbaseDict.coinbase_access_token);
    axios.get('https://api.coinbase.com/v2/user', { headers: { Authorization: AuthStr } }).then(response => {
      const coinbaseData = response.data

      const updateData = { coinbase_id: coinbaseData.data.id, coinbase_info: {...coinbaseDict, ...coinbaseData.data}}
      UpdateAccount(uid, updateData).then(() => {
        resolve(updateData)
      }).catch((error) => {
        reject(error)
      })
    }).catch(error => {
      reject(error)
    })
  })
}

// takes address and returns balance or error
// calls internal api
function GetBalance(uid) {
    return new Promise((resolve, reject) => {
      firestore.collection("people").doc(uid).get().then(person => {
          if(person.exists) {
            resolve(person.data().crypto)
          } else {
            reject("Error: person does not exist")
          }
      }).catch(error => {
          reject(error)
      })
    });
}

function GetExchangeRate(currency='BTC') {
  return new Promise((resolve, reject) => {
    const APIaddress = 'https://api.coinbase.com/v2/exchange-rates?currency=$'.replace('$', currency)
    axios.get(APIaddress).then(response => {
      resolve(response.data.data.rates)
    }).catch(error => {
      reject(error)
    })
  })
}

// new transaction
function NewTransaction({from_id, to_id, amount, fee, emoji, relative_amount, type='friend', relative_currency='USD', currency='BTC'}) {


    return new Promise ((resolve, reject) => {

        const dateTime = Date.now();
        const timestamp_initiated = Math.floor(dateTime / 1000);

        const newTransaction = {
          from_id: from_id,
          to_id: to_id,
          amount: amount,
          relative_amount: relative_amount,
          fee: fee,
          emoji: emoji,
          type: type,
          currency: currency,
          relative_currency: relative_currency,
          timestamp_initiated: timestamp_initiated,
          timestamp_completed: timestamp_initiated
        }

        firestore.collection("transactions").add(newTransaction).then(() => {
            resolve(newTransaction)
        }).catch(error => {
            reject(error)
        })
    })
}

function GetUidFromFB(facebook_id) {
  return new Promise ((resolve, reject) => {
    firestore.collection("people").where("facebook_id", "==", facebook_id).get().then(query => {
      const person = query.docs[0]
      resolve(person.id)
    }).catch(error => {
      reject(error)
    })
  })
}

function LoadTransactions(uid) {
  const getTransactions = (direction) => {
    return new Promise ((resolve, reject) => {
      const transactions = []
      let index = 0
      firestore.collection("transactions").where(direction, "==", uid).get().then(query => {
        if(query.empty) {
          resolve([])
        }
        query.forEach(doc => {
          transactions.push(doc.data())
          firestore.collection("people").doc(doc.data().to_id).get().then(response => {
            const person = response.data()
            transactions[index] = {
                                   ...transactions[index],
                                   ...person,
                                   name: person.first_name + " " + person.last_name,
                                   type: 'transaction',
                                  }
            index += 1
            if(query.size == index) {
              resolve(transactions)
            }
          }).catch(error => {
            reject(error)
          })
        })
      }).catch(error => {
          reject(error)
      })
    })
  }

  return new Promise ((resolve, reject) => {
    // get transactions from me and to me
    Promise.all([getTransactions('from_id'), getTransactions('to_id')]).then(values => {
      const result = values[0].concat(values[1])
      //sort by timestamp_completed
      result.sort((a, b) => {
        return b.timestamp_completed - a.timestamp_completed
      })

      // convert satoshi to BTC and make timestamp_completed readable as date
      const resultLength = result.length
      for(let i = 0; i < resultLength; i++) {
        let date = new Date(result[i].timestamp_completed*1000);
        let hours = date.getHours()
        let amPM = ''
        if (hours > 12) {
          hours -= 12
          amPM = 'PM'
        } else {
          amPM = 'AM'
        }
        let minutes = date.getMinutes()
        if (minutes < 10) {
          minutes = "0" + minutes
        }
        result[i].date = hours + ":" + minutes + amPM + " " + (1+date.getMonth()) + '/' + date.getDate()
        result[i].amount = ((result[i].amount*1.0)/SATOSHI_CONVERSION).toFixed(4)
      }

      resolve(result)
    }).catch(errors => {
      reject(errors)
    })
  })
}

function LoadFriends(user_id, access_token) {
  // get facebook friends
  return new Promise ((resolve, reject) => {

    const APIaddress = "https://graph.facebook.com/v2.11/$/friends".replace('$', facebook_id)
    const friends = []

    axios.get(
        APIaddress,
        {params: {
                access_token: access_token
            }}
    ).then(response => {
      const friendsData = response.data.data
      for (friend of friendsData) {

        firestore.collection("people").where("facebook_id", "=", friend.id).get().then(person => {
          if (!person.empty) {
            const newFriend = person.docs[0].data()
            const name = newFriend.first_name + ' ' + newFriend.last_name
            friends.push({...newFriend, name})
          }
        }).catch(error => {
            reject(error)
        });
      }
      resolve(friends)
    }).catch(error => {
      reject(error)
    })
  })
}

// log
function Log(type, content) {
    if (type == "feedback") {

        const data = {
            text: content
        }

        axios.post("https://hooks.slack.com/services/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", data).then(response => {
            return response
        }).catch(error => {
            return error
        })
    }
}

export default api = {
    NewAccount: NewAccount,
    UpdateAccount: UpdateAccount,
    UsernameExists: UsernameExists,
    HandleCoinbase: HandleCoinbase,
    GetUidFromFB: GetUidFromFB,
    NewTransaction: NewTransaction,
    LoadFriends: LoadFriends,
    LoadTransactions: LoadTransactions,
    GetBalance: GetBalance,
    GetExchangeRate: GetExchangeRate,
    Log: Log
}
