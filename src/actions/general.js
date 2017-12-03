import {Actions} from "react-native-router-flux"
import api from "../api"
import { FBLoginManager } from 'react-native-facebook-login'
var axios = require('axios');
import firebase from 'react-native-firebase'

export const NEW_ACCOUNT_INIT = "NEW_ACCOUNT_INIT"
export function newAccountInit() {
    return {type: NEW_ACCOUNT_INIT}
}

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

export const NEW_ACCOUNT_SUCCESS = "NEW_ACCOUNT_SUCCESS"
export function newAccountSuccess(person) {
    return {type: NEW_ACCOUNT_SUCCESS, person}
}

export const NEW_ACCOUNT_FAILURE = "NEW_ACCOUNT_FAILURE"
export function newAccountFailure() {
    return {type: NEW_ACCOUNT_FAILURE}
}

export const SIGN_IN_INIT = "SIGN_IN_INIT"
export function signInInit() {
    return {type: SIGN_IN_INIT}
}

export const SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS"
export function signInSuccess(person) {
    return {type: SIGN_IN_SUCCESS, person}
}

export const SIGN_IN_FAILURE = "SIGN_IN_FAILURE"
export function signInFailure(error) {
    return {type: SIGN_IN_FAILURE, error}
}

export const SIGN_OUT = "SIGN_OUT"
export function signOut() {
    return {type: SIGN_OUT}
}

// Facebook Auth
export const SignUpWithFacebook = () => {
    return (dispatch, getState) => {

        dispatch(linkFacebookInit())

        FBLoginManager.loginWithPermissions(["email","user_friends"], function(error, data){
            if (!error) {
                const credential = firebase.auth.FacebookAuthProvider.credential(data.credentials.token)

                const fields = 'id,name,email,first_name,last_name,gender,picture'

                axios.get(
                    "https://graph.facebook.com/me",
                    {params: {
                            fields: fields,
                            access_token: data.credentials.token.toString()
                        }}
                ).then(response => {
                    console.log(response)
                    dispatch(linkFacebookSuccess(response.data))
                    Actions.confirmDetails()
                }).catch(error => {
                    dispatch(linkFacebookFailure(error))
                })

                firebase.auth().signInWithCredential(credential).then(() => {
                    //console.log("successfully authenticated firebase")
                }).catch((error) => {
                    // error (linkFacebookFailure(error))
                })
            } else {
                dispatch(linkFacebookFailure(error))
            }
        })
    }
}

// Sign in function
export const SignIn = () => {

    return (dispatch, getState) => {

        // if already signed in, navigate home
        const state = getState()
        if (state.general.signedIn) {
            Actions.home()
        }

        // initialize sign in
        dispatch(signInInit())


    }
}

export const NewAccount = (person) => {

    return (dispatch, getState) => {

        // initialize new account creation
        dispatch(newAccountInit())

        api.NewAccount(person).then((person, personRef) => {
            dispatch(newAccountSuccess(person, personRef))
        }).catch(error => {
            // error
            dispatch(newAccountFailure(error))
        })

    }

}