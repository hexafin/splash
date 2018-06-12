import firebase from 'react-native-firebase'
import moment from "moment"
import {cryptoNames} from "./lib/cryptos"
const SATOSHI_CONVERSION = 100000000;
let firestore = firebase.firestore()
let random = require('react-native-randombytes').randomBytes
let bitcoin = require('bitcoinjs-lib')
let bitcoinTransaction = require('bitcoin-transaction')
var axios = require('axios')

function UsernameExists(username) {
    return new Promise((resolve, reject) => {
        // check if a person (signed up or waitlisted) already has the username
        axios.get("https://us-central1-hexa-splash.cloudfunctions.net/splashtagAvailable?splashtag="+username).then(response => {
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

function GetAddressBalance(address, network='mainnet') {
  return new Promise((resolve, reject) => {
    if (network == 'mainnet') {
        const APIaddress = 'https://blockchain.info/q/addressbalance/' + address + '?confirmations=6'
        axios.get(APIaddress)
        .then(response => {
          if (response.data !== null){
            resolve(1.0*parseFloat(response.data)/SATOSHI_CONVERSION);
          } else {
            reject('Cannot retrieve balance');
          }
        })
        .catch(error => {
          reject(error);
        });
    } else {
      axios.get('https://testnet.blockexplorer.com/api/addr/' + address + '/balance').then(response => {
					resolve(1.0*parseFloat(response.data)/SATOSHI_CONVERSION);
      })
    }
  });
}

async function AddBlockchainTransactions(address, userId, network='mainnet') {

    const addressAPI = (network == 'mainnet') ? 'https://blockchain.info/rawaddr/'+address : 'https://testnet.blockchain.info/rawaddr/'+address
    const txAPI = (network == 'mainnet') ? 'https://blockchain.info/q/txresult/' : 'https://testnet.blockchain.info/q/txresult/'
    const feeAPI = (network == 'mainnet') ? 'https://blockchain.info/q/txfee/' : 'https://testnet.blockchain.info/q/txfee/'
    const blockHeightAPI = (network == 'mainnet') ? 'https://blockchain.info/q/getblockcount' : 'https://testnet.blockchain.info/q/getblockcount'

    // get list of txs on firebase
    const query = await firestore.collection("transactions").where("userId", "==", userId).where("type", "==", "blockchain").get()
    let firebaseTxIds = []
    let firebaseTxs = []
    query.forEach(doc => {
      firebaseTxIds.push(doc.data().txId)
      firebaseTxs.push(doc.data())
    })

    // load txs from blockchain
    const blockHeight = (await axios.get(blockHeightAPI)).data
    const txs = (await axios.get(addressAPI)).data.txs
    const txsLength = txs.length
    if (txsLength > firebaseTxIds.length) {

      for(var j=0; j < txsLength; j++) {

        const index = firebaseTxIds.indexOf(txs[j].hash)

        // if the txId is not on firebase and the transaction is important (ie not both from and to the user)
        if ((index == -1 || firebaseTxs[index].pending == true || typeof firebaseTxs[index].pending == 'undefined') && txs[j].inputs[0].prev_out.addr !== txs[j].out[0].addr) {

            let pending = false
            if (typeof txs[j].block_height === 'undefined' || (blockHeight - txs[j].block_height) < 5) {
              pending = true
            }

            let newTransaction = {
              amount: {},
              relativeAmount: null,
              relativeCurrency: null,
              timestamp: txs[j].time,
              currency: 'BTC',
              txId: txs[j].hash,
              pending: pending,
              userId: userId,
              type: 'blockchain'
            }

            // load total tx amount
            const total = (await axios.get(txAPI+txs[j].hash+'/'+address)).data
            if (total < 0) {
              newTransaction.to = {}
              newTransaction.to.address = txs[j].out[0].addr
              newTransaction.amount.subtotal = -1*total
            } else  {
              newTransaction.from = {}
              newTransaction.from.address = txs[j].inputs[0].prev_out.addr
              newTransaction.amount.subtotal = total
            }

            // load fees and calculate subtotal
            newTransaction.amount.fee = (await axios.get(feeAPI+txs[j].hash)).data
            newTransaction.amount.total = newTransaction.amount.subtotal + newTransaction.amount.fee

            // if has total add to firebase so that it can be loaded on Home
            if (newTransaction.amount.total > 0) {
              await firestore.collection("transactions").doc(newTransaction.txId).set(newTransaction)
            }
         }
      }

    }
}

// feenames: "fastestFee", "halfHourFee", "hourFee"
// if from and amtSatoshi are provided returns total fee. if not returns feePerByte
function GetBitcoinFees({feeName="hourFee", network="mainnet", from=null, amtSatoshi=null}) {

  const getTransactionSize = (numInputs, numOutputs) => {
  	return numInputs*180 + numOutputs*34 + 10 + numInputs;
  }

  return new Promise((resolve, reject) => {
    axios.get('https://bitcoinfees.earn.com/api/v1/fees/recommended').then(response => {
        const feePerByte = response.data[feeName]
        if (from && amtSatoshi) {
          axios.get('https://' + (network == 'testnet' ? 'testnet.' : '') + 'blockexplorer.com/api/addr/' + from + '/utxo?noCache=1').then(response => {

            const utxos = response.data.map((e) => {
                                						return {
                                							txid: e.txid,
                                							vout: e.vout,
                                							satoshis: e.satoshis,
                                							confirmations: e.confirmations
                                						};
                                					});
            let tx = new bitcoin.TransactionBuilder(network == "testnet" ? bitcoin.networks.testnet : bitcoin.networks.bitcoin);
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

function BuildBitcoinTransaction(from, to, privateKey, amtBTC, network="testnet") {
    return new Promise((resolve, reject) => {
      GetAddressBalance(from, network).then((balanceBtc) => {
          if (amtBTC < balanceBtc) {
              bitcoinTransaction.sendTransaction({
                  from: from,
                  to: to,
                  privKeyWIF: privateKey,
                  // TODO: figure out better way of converting to BTC
                  btc: amtBTC,
                  fee: 'hour',
                  dryrun: true,
                  network: network,
              }).then(txHex => {
                  const tx = bitcoin.Transaction.fromHex(txHex);
                  const txid = tx.getId();
                  if(network == 'mainnet') {
                    axios.post('https://blockchain.info/pushtx?tx=' + txHex).then(() => {
                      resolve({
                        txid: txid,
                        txhex: txHex,
                      });
                    }).catch(error => reject(error))
                  } else {
                    axios.post('https://api.blockcypher.com/v1/btc/test3/txs/push', {tx: txHex}).then(() => {
                      resolve({
                        txid: txid,
                        txhex: txHex,
                      });
                    }).catch(error => reject(error))
                  }
              }).catch(error => {
                  reject(error);
              });
          } else {
              reject('Error: not enough btc.');
          }
      }).catch(error => {
          reject(error);
      });
  })
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

function GetAddress(uid, currency = null) {
    return new Promise((resolve, reject) => {

        // if currency is defined, get address of that specific currency
        if (currency) {
            firestore.collection("users").doc(uid).get().then(person => {
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
            firestore.collection("users").doc(uid).get().then(person => {
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

        firestore.collection("users").doc(uid).get().then(person => {
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

function NewTransaction(newTransaction) {

    return new Promise((resolve, reject) => {
            firestore.collection("transactions").add(newTransaction).then(response => {
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
    GenerateCard,
    AddBlockchainTransactions,
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
    GetAddressBalance,
    BuildBitcoinTransaction,
    GetBitcoinFees,
    NewBitcoinWallet,
    GetBalance: GetBalance,
    GetAddress: GetAddress,
    GetCrypto: GetCrypto,
    GetExchangeRate: GetExchangeRate,
    ConvertTimestampToDate: ConvertTimestampToDate,
    Log: Log
}
