import firebase from 'react-native-firebase'
import moment from "moment"
import {cryptoNames, cryptoUnits} from "./lib/cryptos"
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
      axios.get("https://us-central1-hexa-splash.cloudfunctions.net/splashtagAvailable?splashtag="+splashtag).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
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

// Bitcoin:

function NewBitcoinWallet(network='mainnet') {
    network = (network == 'mainnet') ? bitcoin.networks.bitcoin : bitcoin.networks.testnet
    var keyPair = bitcoin.ECPair.makeRandom({
        rng: random,
        network: network
    })
    return {
        wif: keyPair.toWIF(),
        address: keyPair.getAddress()
    }
}

function GetBitcoinAddressBalance(address, network='mainnet') {
  return new Promise((resolve, reject) => {
    const APIaddress = (network == 'mainnet') ? 'https://blockchain.info/q/addressbalance/' : 'https://testnet.blockchain.info/q/addressbalance/'
    axios.get(APIaddress + address + '?api_code=' + blockchain_info_apiKey + '&confirmations=6')
    .then(response => {
      if (response.data !== null){
        resolve(1.0*parseFloat(response.data)/SATOSHI_CONVERSION);
      } else {
        reject('Cannot retrieve balance');
      }
    })
    .catch(error => {
      if (!error.status) {
        reject(Errors.NETWORK_ERROR)
      } else {
        reject(error);
      }
    });
  });
}

async function AddBTCTransactions(address, userId, splashtag, network='mainnet') {
    try {
      const apiCode = '?api_code=' + blockchain_info_apiKey
      const addressAPI = (network == 'mainnet') ? 'https://blockchain.info/rawaddr/'+address : 'https://testnet.blockchain.info/rawaddr/'+address
      const txAPI = (network == 'mainnet') ? 'https://blockchain.info/q/txresult/' : 'https://testnet.blockchain.info/q/txresult/'
      const feeAPI = (network == 'mainnet') ? 'https://blockchain.info/q/txfee/' : 'https://testnet.blockchain.info/q/txfee/'
      const blockHeightAPI = (network == 'mainnet') ? 'https://blockchain.info/q/getblockcount' : 'https://testnet.blockchain.info/q/getblockcount'

      // get list of txs on firebase
      const query1 = await firestore.collection("transactions").where("fromId", "==", userId)
                                                               .where("type", "==", "blockchain")
                                                               .where("currency", "==", "BTC").get()
      const query2 = await firestore.collection("transactions").where("toId", "==", userId)
                                                               .where("type", "==", "blockchain")
                                                               .where("currency", "==", "BTC").get()

      let firebaseTxIds = []
      let firebaseTxs = []
      if(query1.size > 0 || query2.size > 0) {
        query1.forEach(doc => {
          firebaseTxIds.push(doc.data().txId)
          firebaseTxs.push(doc.data())
        })
        query2.forEach(doc => {
          firebaseTxIds.push(doc.data().txId)
          firebaseTxs.push(doc.data())
        })
      }

      // load txs from blockchain
      const blockHeight = (await axios.get(blockHeightAPI + apiCode)).data
      const txs = (await axios.get(addressAPI + apiCode)).data.txs
      const txsLength = txs.length
      for(var j=0; j < txsLength; j++) {
        
        const index = firebaseTxIds.indexOf(txs[j].hash)
        // if the txId is not on firebase and the transaction is important (ie not both from and to the user) or if the transaction is pending
        if ((index == -1 || firebaseTxs[index].pending || typeof firebaseTxs[index].pending == 'undefined') && txs[j].inputs[0].prev_out.addr !== txs[j].out[0].addr) {
            let pending = false
            const confirmations = (typeof txs[j].block_height === 'undefined') ? 0 : (blockHeight - txs[j].block_height) + 1

            if (typeof txs[j].block_height === 'undefined' || confirmations < 6) {
              pending = true
            }

          let newTransaction = {
            amount: {},
            timestamp: txs[j].time,
            currency: 'BTC',
            txId: txs[j].hash,
            pending: pending,
            confirmations: confirmations,
            type: 'blockchain'
          }

          // load total tx amount
          const total = (await axios.get(txAPI+txs[j].hash+'/'+address+apiCode)).data
          if (total < 0) {
            newTransaction.fromId = userId
            newTransaction.fromSplashtag = splashtag
            newTransaction.fromAddress = address
            newTransaction.toAddress = txs[j].out[0].addr
            newTransaction.amount.subtotal = -1*total
          } else  {
            newTransaction.toId = userId
            newTransaction.toSplashtag = splashtag
            newTransaction.toAddress = address
            newTransaction.fromAddress = txs[j].inputs[0].prev_out.addr
            newTransaction.amount.subtotal = total
          }

            if (index !== -1 && firebaseTxs[index].amount) {
              newTransaction.amount = {}
            } else {
              // load fees and calculate subtotal
              newTransaction.amount.fee = (await axios.get(feeAPI+txs[j].hash + apiCode)).data
              newTransaction.amount.total = newTransaction.amount.subtotal + newTransaction.amount.fee            
            }

            // if has total add to firebase so that it can be loaded on Home
            if (newTransaction.amount.total > 0 || firebaseTxs[index].amount.total > 0) {
              await firestore.collection("transactions").doc(newTransaction.txId).set(newTransaction, { merge: true })
            }
         }
      }
    } catch (error) {
      if (!error.status) {
        throw Errors.NETWORK_ERROR
      } else {
        throw error;
      }
    }
}

// feenames: "fastest", "halfHour", "hour"
// if from and amtSatoshi are provided returns total fee. if not returns feePerByte
function GetBitcoinFees({feeName="fastest", network="mainnet", from=null, amtSatoshi=null}) {

  return new Promise((resolve, reject) => {

    getFees(feeName).then(feePerByte => {
        if (from && amtSatoshi) {
          providers.utxo[network].default(from).then(utxos => {

            var bitcoinNetwork = network == "testnet" ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
            let tx = new bitcoin.TransactionBuilder(bitcoinNetwork);
        		let ninputs = 0;
        		let availableSat = 0;
        		for (var i = 0; i < utxos.length; i++) {
        			const utxo = utxos[i];
        			if (utxo.confirmations >= 6) {
        				tx.addInput(utxo.txid, utxo.vout);
        				availableSat += utxo.satoshis;
        				ninputs++;

        				if (availableSat >= amtSatoshi) break;
        			}
        		}
        		const change = availableSat - amtSatoshi;
        		const fee = getTransactionSize(ninputs, change > 0 ? 2 : 1)*feePerByte;
            resolve(fee)

          }).catch(error => {
            reject(error)
          })

        } else {
          resolve(feePerByte)
        }
      }).catch(error => {
        reject(error)
      });
  })
}

function BuildBitcoinTransaction({from, to, privateKey, amtSatoshi, fee=null, network="testnet"}) {
    return new Promise((resolve, reject) => {
      GetBitcoinAddressBalance(from, network).then((balanceBtc) => {
          if ((amtSatoshi/cryptoUnits.BTC) < balanceBtc) {
              sendTransaction({
                  from: from,
                  to: to,
                  privKeyWIF: privateKey,
                  satoshis: amtSatoshi,
                  fee: fee,
                  dryrun: false,
                  network: network,
              }).then(response => {
                resolve(response)
              }).catch(error => {
                  reject(error);
              });
          } else {
              reject(BITCOIN_ERRORS.BALANCE);
          }
      }).catch(error => {
          reject(error);
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
    AddBTCTransactions,
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
    GetBitcoinAddressBalance,
    BuildBitcoinTransaction,
    GetBitcoinFees,
    NewBitcoinWallet,
    ConvertTimestampToDate: ConvertTimestampToDate,
    Log: Log
}
