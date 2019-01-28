import firebase from "react-native-firebase";
import moment from "moment";
import { erc20Names } from "./lib/cryptos";
let firestore = firebase.firestore();
let bitcoin = require("bitcoinjs-lib");
var axios = require("axios");
import * as Keychain from "react-native-keychain";
import Web3 from "web3";

import {
  infura_apiKey,
  coinmarketcap_apiKey
} from "../env/keys.json";

export const Errors = {
  NETWORK_ERROR: "NETWORK_ERROR"
};

const SATOSHI_CONVERSION = 100000000;

// check to see if splashtag is valid and available
function UsernameExists(splashtag) {
  return new Promise((resolve, reject) => {
    let output = {
      available: false,
      validSplashtag: false
    };

    // splashtag mush be alphanumeric (including - and _) and between 3 and 15 characters
    if (/^[a-z0-9_-]{3,15}$/.test(splashtag)) {
      output.validSplashtag = true;

      // check firestore for the specified splashtag
      firestore
        .collection("users")
        .where("splashtag", "==", splashtag)
        .get()
        .then(users => {
          if (users.empty) {
            output.available = true;
            resolve(output);
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

// return firebase user from uid
function GetAccount(uid) {
  return new Promise((resolve, reject) => {
    firestore
      .collection("users")
      .doc(uid)
      .get()
      .then(person => {
        resolve(person);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function IsValidAddress(address, currency = "BTC", network = "mainnet") {
  if (currency == "BTC") {
    // if toOutputScript throws error if the address is invalid
    try {
      network =
        network == "testnet"
          ? bitcoin.networks.testnet
          : bitcoin.networks.bitcoin;
      bitcoin.address.toOutputScript(address, network);
      return true;
    } catch (e) {
      return false;
    }
  } else if (currency == "ETH" || erc20Names.indexOf(currency) > -1) {
    const api =
      network == "mainnet"
        ? "https://mainnet.infura.io/v3/"
        : "https://rinkeby.infura.io/v3/";
    const web3 = new Web3(new Web3.providers.HttpProvider(api + infura_apiKey));
    return web3.utils.isAddress(address);
  }
}

function GenerateCard(transactionId) {
  return new Promise((resolve, reject) => {
    axios
      .post("https://us-central1-hexa-splash.cloudfunctions.net/generateCard", {
        transactionId
      })
      .then(response => {
        if (response.data == "Success") {
          resolve();
        } else {
          reject(response.data);
        }
      })
      .catch(error => reject(error));
  });
}

const CreateUser = (uid, entity) => {
  return new Promise((resolve, reject) => {
    const data = {
      ...entity,
      timestampJoined: moment().unix()
    };

    firestore
      .collection("users")
      .doc(uid)
      .set(data)
      .then(userData => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const UpdateUser = (uid, updateDict) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("users")
      .doc(uid)
      .update(updateDict)
      .then(() => {
        firestore
          .collection("users")
          .doc(uid)
          .get()
          .then(person => {
            resolve(person.data());
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
};

const UpdateTransaction = (transactionId, updateDict) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection("transactions")
      .doc(transactionId)
      .update(updateDict)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

function GetExchangeRate(currencies = ["BTC"], relativeCurrency = "USD") {
  return new Promise((resolve, reject) => {
    const APIaddress =
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=" +
      coinmarketcap_apiKey +
      "&symbol=" +
      currencies.join(",") +
      "&convert=" +
      relativeCurrency;
    axios
      .get(APIaddress)
      .then(response => {
        const data = response.data.data;
        let exchangeRates = {};
        Object.keys(data).map((key, index) => {
          exchangeRates[key] = {
            [relativeCurrency]: data[key].quote[relativeCurrency].price
          };
        });
        resolve(exchangeRates);
      })
      .catch(error => {
        if (!error.status) {
          reject(Errors.NETWORK_ERROR);
        } else {
          reject(error);
        }
      });
  });
}

function NewTransaction(newTransaction) {
  return new Promise((resolve, reject) => {
    firestore
      .collection("transactions")
      .doc(newTransaction.txId)
      .set(newTransaction, { merge: true })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

async function AddToKeychain(userId, key, value) {
  try {
    let data = JSON.parse((await Keychain.getGenericPassword()).password);
    data[key] = value;
    await Keychain.setGenericPassword(userId, JSON.stringify(data));
    Promise.resolve();
  } catch (e) {
    Promise.reject(e);
  }
}

async function DeleteUser(userId) {
  try {
    await Keychain.resetGenericPassword();
    await DeleteTransactions(userId);
    await firestore
      .collection("users")
      .doc(userId)
      .delete();
  } catch (e) {
    console.log(e);
  }
}

async function DeleteTransactions(userId) {
  try {
    const query1 = await firestore
      .collection("transactions")
      .where("fromId", "==", userId)
      .get();
    query1.forEach(async doc => {
      try {
        await doc.ref.delete();
      } catch (e) {
        console.log(e);
      }
    });
    const query2 = await firestore
      .collection("transactions")
      .where("toId", "==", userId)
      .get();
    query2.forEach(async doc => {
      try {
        await doc.ref.delete();
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);
  }
}

export default (api = {
  CreateUser,
  UpdateUser,
  UpdateTransaction,
  GetExchangeRate,
  AddToKeychain,
  DeleteUser,
  IsValidAddress,
  DeleteTransactions,
  UsernameExists,
  NewTransaction,
  GenerateCard
});
