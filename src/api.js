import firebase from 'react-native-firebase'
import moment from "moment"
import {cryptoNames, cryptoUnits, erc20Names} from "./lib/cryptos"
import { sendTransaction,
         getTransactionSize,
         BITCOIN_ERRORS,
         getFees,
         providers } from './bitcoin-api'

const SATOSHI_CONVERSION = 100000000;
let firestore = firebase.firestore()
let random = require('react-native-randombytes').randomBytes
let bitcoin = require('bitcoinjs-lib')
var axios = require('axios')
import * as Keychain from 'react-native-keychain';
import Web3 from 'web3'

import { infura_apiKey, blockchain_info_apiKey, coinmarketcap_apiKey } from '../env/keys.json'

export const Errors = {
  NETWORK_ERROR: 'NETWORK_ERROR'
}

function UsernameExists(splashtag) {
  return new Promise((resolve, reject) => {
    let output = {
      available: false,
      validSplashtag: false
    };

    if (/^[a-z0-9_-]{3,15}$/.test(splashtag)) {
      output.validSplashtag = true;

      firestore
        .collection("users")
        .where("splashtag", "==", splashtag)
        .get()
        .then(users => {
          if (users.empty) {
            output.available = true;
            resolve(output)
          } else {
            resolve(output);
          }
        })
        .catch(error => {
          reject(error);
        });
    } else {
      resolve(output);
    }
  });
}

function GetAccount(uid) {
    return new Promise((resolve, reject) => {
        // get account from uid
        firestore.collection("users").doc(uid).get().then(person => {

            resolve(person)

        }).catch(error => {
            reject(error)
        });
    })
}

function IsValidAddress(address, currency="BTC", network='mainnet') {
  if (currency == "BTC") {
    try {
      network = (network == 'testnet') ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
      bitcoin.address.toOutputScript(address, network)
      return true
    } catch (e) {
      return false
    }
  } else if (currency == "ETH" || erc20Names.indexOf(currency) > -1) {
    const api = (network == 'mainnet') ? 'https://mainnet.infura.io/v3/' : 'https://rinkeby.infura.io/v3/'
    const web3 = new Web3( new Web3.providers.HttpProvider(api + infura_apiKey) )
    return web3.utils.isAddress(address)
  }
}

function GenerateCard(transactionId) {
  return new Promise((resolve, reject) => {
    axios.post('https://us-central1-hexa-splash.cloudfunctions.net/generateCard', {transactionId}).then((response) => {
      if(response.data == 'Success') {
        resolve()
      } else {
        reject(response.data)
      }
    }).catch(error => reject(error))
  })
}


const CreateUser = (uid, entity) => {

    return new Promise((resolve, reject) => {

    		const data = {
    			...entity,
    			timestampJoined: moment().unix(),
    		}

        console.log(uid, data)

        firestore.collection("users").doc(uid).set(data).then(userData => {
          console.log('should resolve')
          resolve(data)
        }).catch(error => {
          reject(error)
        })

    })

}

const UpdateAccount = (uid, updateDict) => {

    return new Promise((resolve, reject) => {

        firestore.collection("users").doc(uid).update(updateDict).then(() => {
            firestore.collection("users").doc(uid).get().then(person => {
                resolve(person.data())
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })

    })
}

const UpdateTransaction = (transactionId, updateDict) => {

    return new Promise ((resolve, reject) => {

        firestore.collection("transactions").doc(transactionId).update(updateDict).then(response => {
          resolve(response)
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
            firestore.collection("users").doc(uid).get().then(person => {
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
            firestore.collection("users").doc(uid).get().then(person => {
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

function GetExchangeRate(currencies =['BTC'], relativeCurrency = 'USD') {
    return new Promise((resolve, reject) => {
        const APIaddress = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY='+coinmarketcap_apiKey+'&symbol='+currencies.join(',')+'&convert='+relativeCurrency
        axios.get(APIaddress).then(response => {
            const data = response.data.data
            let exchangeRates = {}
            Object.keys(data).map((key, index) => {
               exchangeRates[key] = {[relativeCurrency]: data[key].quote[relativeCurrency].price}
            })
            resolve(exchangeRates)
        }).catch(error => {
            if (!error.status) {
              reject(Errors.NETWORK_ERROR)
            } else {
              reject(error);
            }
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

function NewTransaction(newTransaction) {

    return new Promise((resolve, reject) => {
            firestore.collection("transactions").doc(newTransaction.txId).set(newTransaction, { merge: true }).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
    })
}

function GetUidFromFB(facebook_id) {
    return new Promise((resolve, reject) => {
        firestore.collection("users").where("facebook_id", "==", facebook_id).get().then(query => {
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
          firestore.collection("users").doc(query.docs[i].data()[otherPersonId]).get().then(response => {
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

                firestore.collection("users").where("facebook_id", "=", friendsData[i].id).get().then(person => {
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

async function AddToKeychain(userId, key, value) {
  try {
    let data = JSON.parse((await Keychain.getGenericPassword()).password)
    data[key] = value
    await Keychain.setGenericPassword(userId, JSON.stringify(data))
    Promise.resolve()
  } catch (e) {
    Promise.reject(e)
  }
}

async function DeleteAccount(userId) {
  try {
    await Keychain.resetGenericPassword()
    await DeleteTransactions(userId)
    await firestore.collection('users').doc(userId).delete()
  } catch (e) {
    console.log(e)
  }
}

async function DeleteTransactions(userId) {
  try {
    const query1 = await firestore.collection("transactions").where("fromId", '==', userId).get()
    query1.forEach(async (doc) => {
      try {
        await doc.ref.delete()
      } catch(e) {
          console.log(e)
      }
    })
    const query2 = await firestore.collection("transactions").where("toId", '==', userId).get()
    query2.forEach(async (doc) => {
      try {
        await doc.ref.delete()
      } catch(e) {
          console.log(e)
      }
    })
  } catch (e) {
    console.log(e)
  }
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
    CreateUser,
    UpdateAccount: UpdateAccount,
    UpdateTransaction,
    GetExchangeRate,
    GenerateCard,
    AddToKeychain,
    DeleteAccount,
    IsValidAddress,
    DeleteTransactions,
    UpdateRequest: UpdateRequest,
    RemoveRequest: RemoveRequest,
    UsernameExists: UsernameExists,
    HandleCoinbase: HandleCoinbase,
    GetUidFromFB: GetUidFromFB,
    NewTransaction: NewTransaction,
    NewTransactionFromRequest: NewTransactionFromRequest,
    LoadFriends: LoadFriends,
    LoadTransactions: LoadTransactions,
    ConvertTimestampToDate: ConvertTimestampToDate,
    Log: Log
}
