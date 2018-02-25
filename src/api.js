import firebase from 'react-native-firebase'

let firestore = firebase.firestore()
let random = require('react-native-randombytes').randomBytes
let bitcoin = require('bitcoinjs-lib')
let bitcoinTransaction = require('bitcoin-transaction')
var axios = require('axios')
import {cryptoNames} from "./lib/cryptos"
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

function GetAccount(uid) {
    return new Promise((resolve, reject) => {
        // get account from uid
        firestore.collection("people").doc(uid).get().then(person => {

            resolve(person)

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

const NewAccount = (uid, {
    username, firstName, lastName, email, facebookId, defaultCurrency = "USD",
    address = null, city = null, state = null, zipCode = null, country = null, phoneNumber = null,
    coinbaseId = null
}) => {

    return new Promise((resolve, reject) => {

        const dateTime = Date.now();
        const ts = Math.floor(dateTime * 1.0 / 1000);

        const newPerson = {
            joined: ts,
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            facebook_id: facebookId,
            coinbase_id: coinbaseId,
            default_currency: defaultCurrency,
            push_token: null
            // phone_number: phoneNumber,
            // address: address,
            // city: city,
            // state: state,
            // zip_code: zipCode,
            // country: country,
        }

        firestore.collection("people").doc(uid).set(newPerson).then(() => {
            resolve(newPerson)
        }).catch(error => {
            reject(error)
        })

    })

}

const UpdateAccount = (uid, updateDict) => {

    return new Promise((resolve, reject) => {

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

const UpdateRequest = (requestId, updateDict) => {

    return new Promise ((resolve, reject) => {

        firestore.collection("requests").doc(requestId).update(updateDict).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })

    })
}

const RemoveRequest = (requestId) => {
  return new Promise ((resolve, reject) => {
    firestore.collection("requests").doc(requestId).delete().then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

const HandleCoinbase = (uid, coinbaseDict) => {
  // get coinbase user info and update firebase

    return new Promise((resolve, reject) => {
        const AuthStr = 'Bearer '.concat(coinbaseDict.coinbase_access_token);
        axios.get('https://api.coinbase.com/v2/user', {headers: {Authorization: AuthStr}}).then(response => {
            const coinbaseData = response.data

            const updateData = {
                coinbase_id: coinbaseData.data.id,
                coinbase_info: {...coinbaseDict, ...coinbaseData.data}
            }
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

function GetBalance(uid, currency = null) {
    return new Promise((resolve, reject) => {

        // if currency is defined, get balance of that specific currency
        if (currency) {
            firestore.collection("people").doc(uid).get().then(person => {
                if (person.exists) {
                    resolve(person.data().crypto[currency].balance)
                } else {
                    reject("Error: person does not exist")
                }
            }).catch(error => {
                reject(error)
            })
        }
        else {
            // get all balances
            firestore.collection("people").doc(uid).get().then(person => {
                if (person.exists) {

                    const returnable = {}

                    const crypto = person.data().crypto
                    crypto.forEach(item => {
                        returnable[currency].balance = item.balance
                    })

                    resolve(returnable)
                } else {
                    reject("Error: person does not exist")
                }
            }).catch(error => {
                reject(error)
            })
        }

    });
}

function GetAddress(uid, currency = null) {
    return new Promise((resolve, reject) => {

        // if currency is defined, get address of that specific currency
        if (currency) {
            firestore.collection("people").doc(uid).get().then(person => {
                if (person.exists) {
                    resolve(person.data().crypto[currency].address)
                } else {
                    reject("Error: person does not exist")
                }
            }).catch(error => {
                reject(error)
            })
        }
        else {
            // get all addresses
            firestore.collection("people").doc(uid).get().then(person => {
                if (person.exists) {

                    const returnable = {}

                    const crypto = person.data().crypto
                    crypto.forEach(item => {
                        returnable[currency].address = item.address
                    })

                    resolve(returnable)
                } else {
                    reject("Error: person does not exist")
                }
            }).catch(error => {
                reject(error)
            })
        }

    });
}

function GetCrypto(uid, currency = null) {
    return new Promise((resolve, reject) => {

        // if currency is defined, get crypto of that specific currency

        firestore.collection("people").doc(uid).get().then(person => {
            if (person.exists) {
                if (currency) {
                    let specificCrypto = person.data().crypto[currency]
                    resolve(specificCrypto)
                }
                else {
                    let crypto = person.data().crypto
                    resolve(crypto)
                }
            } else {
                reject("Error: person does not exist")
            }
        }).catch(error => {
            reject(error)
        })

    });
}

function GetExchangeRate(currency = 'BTC') {
    return new Promise((resolve, reject) => {
        const APIaddress = 'https://api.coinbase.com/v2/exchange-rates?currency=$'.replace('$', currency)
        axios.get(APIaddress).then(response => {
            resolve(response.data.data.rates)
        }).catch(error => {
            reject(error)
        })
    })
}

function NewTransactionFromRequest(requestId, exchangeRate, balance, timestamp) {
  return new Promise((resolve, reject) => {

    firestore.collection("requests").doc(requestId).get().then(request => {
        let newTransaction = request.data()
        newTransaction.timestamp_completed = timestamp
        newTransaction.amount = (newTransaction.relative_amount/exchangeRate)*SATOSHI_CONVERSION
        if (newTransaction.amount < balance) {
          firestore.collection("transactions").add(newTransaction).then(() => {
              resolve(newTransaction)
          }).catch(error => {
              reject(error)
          })
        } else {
          reject('Error: not enough BTC')
        }

    }).catch(error => {
      reject(error)
    })
  })
}

function NewTransaction({transactionType, from_id, to_id, to_address = null, amount, fee, emoji, relative_amount, type = 'friend', relative_currency = 'USD', currency = 'BTC'}) {

    return new Promise((resolve, reject) => {

        const dateTime = Date.now();
        const timestamp_initiated = Math.floor(dateTime / 1000);
        if (transactionType == 'send' || transactionType == 'external') {
          const newTransaction = {
            from_id: from_id,
            to_id: to_id,
            to_address: to_address,
            amount: amount,
            relative_amount: relative_amount,
            fee: fee,
            emoji: emoji,
            type: transactionType == 'external' ? 'external' : type,
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
        } else {
            const newRequest = {
                from_id: from_id,
                to_id: to_id,
                amount: null,
                relative_amount: relative_amount,
                fee: fee,
                emoji: emoji,
                type: type,
                accepted: false,
                declined: false,
                number_of_reminders: 0,
                currency: currency,
                relative_currency: relative_currency,
                timestamp_initiated: timestamp_initiated,
                timestamp_completed: null,
                timestamp_declined: null,
            }

            firestore.collection("requests").add(newRequest).then(() => {
                resolve(newRequest)
            }).catch(error => {
                reject(error)
            })
        }
    })
}

function GetUidFromFB(facebook_id) {
    return new Promise((resolve, reject) => {
        firestore.collection("people").where("facebook_id", "==", facebook_id).get().then(query => {
            const person = query.docs[0]
            resolve(person.id)
        }).catch(error => {
            reject(error)
        })
    })
}

function LoadTransactions(uid, transactionType) {
  const getTransactions = (direction) => {
    return new Promise ((resolve, reject) => {
      const transactions = []
      const otherPersonId = (direction == 'from_id') ? 'to_id' : 'from_id'
      let transactionQuery = firestore.collection(transactionType + 's').where(direction, "==", uid).get()
      if (transactionType == 'request') {
        transactionQuery = firestore.collection(transactionType + 's').where(direction, "==", uid)
                                                                      .where('declined', '==', false)
                                                                      .where('accepted', '==', false).get()
      }

      transactionQuery.then(query => {

        if(query.empty) {
          resolve([])
        }

        for(let i = 0; i < query.size; i++) {
          firestore.collection("people").doc(query.docs[i].data()[otherPersonId]).get().then(response => {
            const person = response.data()
            const transaction = query.docs[i].data()

            if (direction == 'to_id' && transactionType == 'request') {
              transactions.push({
                                 ...transaction,
                                 ...person,
                                 type: 'waiting',
                                 key: query.docs[i].id
                                })
            } else {
              transactions.push({
                                 ...transaction,
                                 ...person,
                                 amount: (direction == 'from_id' && transaction.amount !== null) ? -1*transaction.amount: transaction.amount,
                                 type: transactionType,
                                 key: query.docs[i].id
                                })
            }

          if(query.size == transactions.length) {
            resolve(transactions)
          }
          }).catch(error => {
            reject(error)
          })
        }
      }).catch(error => {
          reject(error)
      })
    })
  }

  return new Promise ((resolve, reject) => {
    // get transactions from me and to me
    Promise.all([getTransactions('from_id'), getTransactions('to_id')]).then(values => {
      if (transactionType == 'transaction') {
        const result = values[0].concat(values[1])
        // sort by timestamp_completed
        result.sort((a, b) => {
          return b.timestamp_completed - a.timestamp_completed
        })
        resolve(result)
      } else {
        // sort by timestamp_initiated
        values[0].sort((a, b) => {
          return b.timestamp_initiated - a.timestamp_initiated
        })
        values[1].sort((a, b) => {
          return b.timestamp_initiated - a.timestamp_initiated
        })
        resolve({waiting: values[1], requests: values[0]})
      }
    }).catch(errors => {
      reject(errors)
    })
  })
}

function ConvertTimestampToDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours()
  let amPM = ''
  if (hours > 12) {
    hours -= 12
    amPM = 'PM'
  } else {
    amPM = 'AM'
    if (hours == 0) {
      hours = 12
    }
  }
  let minutes = date.getMinutes()
  if (minutes < 10) {
    minutes = "0" + minutes
  }
  return hours + ":" + minutes + amPM + " " + (1 + date.getMonth()) + '/' + date.getDate()
}

function LoadFriends(facebook_id, access_token) {
    // get facebook friends
    return new Promise((resolve, reject) => {

        const APIaddress = "https://graph.facebook.com/v2.11/$/friends".replace('$', facebook_id)
        const friends = []

        axios.get(
            APIaddress,
            {
                params: {
                    access_token: access_token
                }
            }
        ).then(response => {
            const friendsData = response.data.data

            for (let i = 0; i < friendsData.length; i++) {

                firestore.collection("people").where("facebook_id", "=", friendsData[i].id).get().then(person => {
                    if (!person.empty) {
                        const newFriend = person.docs[0].data()
                        friends.push(newFriend)
                        if ((i + 1) == friendsData.length) {
                            resolve(friends)
                        }
                    }
                }).catch(error => {
                    reject(error)
                });
            }
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
    UpdateRequest: UpdateRequest,
    RemoveRequest: RemoveRequest,
    UsernameExists: UsernameExists,
    GetAccount: GetAccount,
    HandleCoinbase: HandleCoinbase,
    GetUidFromFB: GetUidFromFB,
    NewTransaction: NewTransaction,
    NewTransactionFromRequest: NewTransactionFromRequest,
    LoadFriends: LoadFriends,
    LoadTransactions: LoadTransactions,
    GetBalance: GetBalance,
    GetAddress: GetAddress,
    GetCrypto: GetCrypto,
    GetExchangeRate: GetExchangeRate,
    ConvertTimestampToDate: ConvertTimestampToDate,
    Log: Log
}
