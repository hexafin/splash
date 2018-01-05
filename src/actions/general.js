import {Actions} from "react-native-router-flux"
import api from "../api"
import { FBLoginManager } from 'react-native-facebook-login'
import {NativeModules, NativeEventEmitter} from 'react-native'
var axios = require('axios')
import firebase from 'react-native-firebase'
let firestore = firebase.firestore()
let analytics = firebase.analytics()
let CoinbaseApi = require('NativeModules').CoinbaseApi;
analytics.setAnalyticsCollectionEnabled(true)

export const LINK_FACEBOOK_INIT = "LINK_FACEBOOK_INIT"
export function linkFacebookInit() {
    return {type: LINK_FACEBOOK_INIT}
}

export const LINK_FACEBOOK_SUCCESS = "LINK_FACEBOOK_SUCCESS"
export function linkFacebookSuccess(data) {
    return {type: LINK_FACEBOOK_SUCCESS, data}
}

export const LINK_FACEBOOK_FAILURE = "LINK_FACEBOOK_FAILURE"
export function linkFacebookFailure(error) {
    return {type: LINK_FACEBOOK_FAILURE, error}
}

export const LINK_COINBASE_INIT = "LINK_COINBASE_INIT"
export function linkCoinbaseInit() {
    return {type: LINK_COINBASE_INIT}
}

export const LINK_COINBASE_SUCCESS = "LINK_COINBASE_SUCCESS"
export function linkCoinbaseSuccess(data) {
    return {type: LINK_COINBASE_SUCCESS, data}
}

export const LINK_COINBASE_FAILURE = "LINK_COINBASE_FAILURE"
export function linkCoinbaseFailure(error) {
    return {type: LINK_COINBASE_FAILURE, error}
}

export const NEW_ACCOUNT_INIT = "NEW_ACCOUNT_INIT"
export function newAccountInit() {
    return {type: NEW_ACCOUNT_INIT}
}

export const NEW_ACCOUNT_SUCCESS = "NEW_ACCOUNT_SUCCESS"
export function newAccountSuccess(person, privateKey) {
    return {type: NEW_ACCOUNT_SUCCESS, person, privateKey}
}

export const NEW_ACCOUNT_FAILURE = "NEW_ACCOUNT_FAILURE"
export function newAccountFailure(error) {
    return {type: NEW_ACCOUNT_FAILURE, error}
}

export const UPDATE_ACCOUNT_INIT = "UPDATE_ACCOUNT_INIT"
export function updateAccountInit() {
    return {type: UPDATE_ACCOUNT_INIT}
}

export const UPDATE_ACCOUNT_SUCCESS = "UPDATE_ACCOUNT_SUCCESS"
export function updateAccountSuccess(updatedPerson) {
    return {type: UPDATE_ACCOUNT_SUCCESS, updatedPerson}
}

export const UPDATE_ACCOUNT_FAILURE = "UPDATE_ACCOUNT_FAILURE"
export function updateAccountFailure(error) {
    return {type: UPDATE_ACCOUNT_FAILURE, error}
}

export const UPDATE_BALANCE_INIT = "UPDATE_BALANCE_INIT"
export function updateBalanceInit() {
    return {type: UPDATE_BALANCE_INIT}
}

export const UPDATE_BALANCE_SUCCESS = "UPDATE_BALANCE_SUCCESS"
export function updateBalanceSuccess(balance) {
    return {type: UPDATE_BALANCE_SUCCESS, balance}
}

export const UPDATE_BALANCE_FAILURE = "UPDATE_BALANCE_FAILURE"
export function updateBalanceFailure(error) {
    return {type: UPDATE_BALANCE_FAILURE, error}
}

export const UPDATE_FRIENDS_INIT = "UPDATE_FRIENDS_INIT"
export function updateFriendsInit() {
    return {type: UPDATE_FRIENDS_INIT}
}

export const UPDATE_FRIENDS_SUCCESS = "UPDATE_FRIENDS_SUCCESS"
export function updateFriendsSuccess(friends) {
    return {type: UPDATE_FRIENDS_SUCCESS, friends}
}

export const UPDATE_FRIENDS_FAILURE = "UPDATE_FRIENDS_FAILURE"
export function updateFriendsFailure(error) {
    return {type: UPDATE_FRIENDS_FAILURE, error}
}

export const FRIENDS_SEARCH_CHANGE = "FRIENDS_SEARCH_CHANGE"
export function friendsSearchChange(query) {
    return {type: FRIENDS_SEARCH_CHANGE, query}
}

export const FIREBASE_AUTH_INIT = "FIREBASE_AUTH_INIT"
export function firebaseAuthInit() {
    return {type: FIREBASE_AUTH_INIT}
}

export const FIREBASE_AUTH_SUCCESS = "FIREBASE_AUTH_SUCCESS"
export function firebaseAuthSuccess(uid) {
    return {type: FIREBASE_AUTH_SUCCESS, uid}
}

export const FIREBASE_AUTH_FAILURE = "FIREBASE_AUTH_FAILURE"
export function firebaseAuthError(error) {
    return {type: FIREBASE_AUTH_FAILURE, error}
}

export const SIGN_OUT = "SIGN_OUT"
export function signOut() {
    return {type: SIGN_OUT}
}

// Facebook Auth
export const LinkFacebook = () => {
    return (dispatch, getState) => {

        dispatch(linkFacebookInit())

        FBLoginManager.loginWithPermissions(["public_profile", "email","user_friends"], function(error, data){
            if (!error) {

                // firebase auth
                const firebaseCredential = firebase.auth.FacebookAuthProvider.credential(data.credentials.token)
                dispatch(firebaseAuthInit())
                firebase.auth().signInWithCredential(firebaseCredential).then(user => {
                    dispatch(firebaseAuthSuccess(user.uid))
                }).catch(error => {
                    dispatch(firebaseAuthError(error))
                })

                // get facebook data
                const fields = 'id,name,email,first_name,last_name,gender,picture,link'
                const token = data.credentials.token.toString()
                axios.get(
                    "https://graph.facebook.com/me",
                    {params: {
                            fields: fields,
                            access_token: token
                        }}
                ).then(response => {
                    const facebookData = {
                        id: response.data.id,
                        first_name: response.data.first_name,
                        last_name: response.data.last_name,
                        picture_url: response.data.picture.data.url,
                        gender: response.data.gender,
                        email: response.data.email,
                        token: token
                    }
                    dispatch(linkFacebookSuccess(facebookData))

                    Actions.confirmDetails()
                }).catch(error => {
                    dispatch(linkFacebookFailure(error))
                })
            } else {
                dispatch(linkFacebookFailure(error))
            }
        })
    }
}

export const LinkCoinbase = () => {
    return (dispatch, getState) => {
    const state = getState()
    dispatch(linkCoinbaseInit())

    const clientId = null //TODO: replace these values
    const clientSecret = null //TODO: replace these values

    //start oauth process
    CoinbaseApi.startAuthentication(clientId, clientSecret)
    const { EventEmitter } = NativeModules;
    eventEmitter = new NativeEventEmitter(EventEmitter);

    //receive coinbase oauth event from native
    eventEmitter.addListener("CoinbaseOAuthComplete", (data) => {
      EventEmitter.stopObserving();
      if(data.access_token && data.refresh_token && data.expires_in) {
        let t = new Date();
        t.setSeconds(t.getSeconds() + data.expires_in);

        const coinbase_data = {coinbase_access_token: data.access_token, coinbase_refresh_token: data.refresh_token, coinbase_expires_at: Math.floor(t / 1000)}
        //get user data and update firebase
        api.HandleCoinbase(state.general.uid, coinbase_data).then(response => {
          dispatch(linkCoinbaseSuccess(response))
          const action = LoadApp()
          action(dispatch, getState)
        }).catch(error => {
          dispatch(linkCoinbaseFailure(error))
        })
      } else {
        dispatch(linkCoinbaseFailure(data))
      }
    });
    EventEmitter.startObserving();
  }
}

// create new account
export const CreateNewAccount = () => {
    return (dispatch, getState) => {

        // initialize new account creation
        dispatch(newAccountInit())

        // get state
        const state = getState()

        // check to make sure that user is authenticated
        if (state.general.authenticated) {

            const inputPerson = {
                username: state.form.username.values.username,
                firstName: state.form.onboarding.values.first_name,
                lastName: state.form.onboarding.values.last_name,
                email: state.general.person.email,
                gender: state.general.person.gender,
                facebookId: state.general.person.facebook_id,
                pictureURL: state.general.person.picture_url,
                default_currency: "usd"
            }

            api.NewAccount(state.general.uid, inputPerson).then(response => {
                dispatch(newAccountSuccess(response.person, response.privateKey))

                Actions.coinbase()
            }).catch(error => {
                // error
                dispatch(newAccountFailure(error))
            })

        }
        else {
            dispatch(newAccountFailure("user not authenticated"))
        }

    }
}

// update account
export const UpdateAccount = (updateDict) => {
    return (dispatch, getState) => {

        // initialize account update
        dispatch(updateAccountInit())

        // get state
        const state = getState()

        // update firestore
        api.UpdateAccount(state.general.uid, updateDict).then(updatedPerson => {
            dispatch(updateAccountSuccess(updatedPerson))
        }).catch(error => {
            dispatch(updateAccountFailure(error))
        })

    }
}

// load App
export const LoadApp = () => {
    return (dispatch, getState) => {
        // TODO: loading screen
        dispatch(updateBalanceInit())
        const state = getState()

        if (state.general.authenticated) {
            const address = state.general.person.address_bitcoin
            const user_id = state.general.person.facebook_id
            const access_token = state.general.facebookToken

            api.GetBalance(address).then((balance) => {
              dispatch(updateBalanceSuccess(balance))

              dispatch(updateFriendsInit())
              api.LoadFriends(user_id, access_token).then(friends => {
                dispatch(updateFriendsSuccess(friends))
                Actions.home()
              }).catch(error => {
                dispatch(updateFriendsFailure(error))
                //TODO: do something if error
              })

            }).catch((error) => {
              dispatch(updateBalanceFailure(error))
              //TODO: do something if error
            })
        } else {
            Actions.splash()
        }
    }
}

// submit feedback
export const SubmitFeedback = (type) => {
    return (dispatch, getState) => {

        // get state
        const state = getState()

        const feedback = state.form.feedback.values.feedback

        if (type == "positive") {
            api.Log("feedback", "👍 - "+feedback)
            Actions.thanks({thanksType: "positiveFeedback"})
        }
        else {
            api.Log("feedback", "👎 - "+feedback)
            Actions.thanks({thanksType: "negativeFeedback"})
        }

    }
}
