import {Actions} from "react-native-router-flux"
import api from "../api"
import { AccessToken, LoginManager } from 'react-native-fbsdk'
import firebase from 'react-native-firebase'

export const NEW_ACCOUNT_INIT = "NEW_ACCOUNT_INIT";
export function newAccountInit() {
    return {type: NEW_ACCOUNT_INIT}
}

export const NEW_ACCOUNT_SUCCESS = "NEW_ACCOUNT_SUCCESS";
export function newAccountSuccess(person) {
    return {type: NEW_ACCOUNT_SUCCESS, person}
}

export const NEW_ACCOUNT_FAILURE = "NEW_ACCOUNT_FAILURE";
export function newAccountFailure() {
    return {type: NEW_ACCOUNT_FAILURE}
}

export const SIGN_IN_INIT = "SIGN_IN_INIT";
export function signInInit() {
    return {type: SIGN_IN_INIT}
}

export const SIGN_IN_SUCCESS = "SIGN_IN_SUCCESS";
export function signInSuccess(person) {
    return {type: SIGN_IN_SUCCESS, person}
}

export const SIGN_IN_FAILURE = "SIGN_IN_FAILURE";
export function signInFailure(error) {
    return {type: SIGN_IN_FAILURE, error}
}

export const SIGN_OUT = "SIGN_OUT";
export function signOut() {
    return {type: SIGN_OUT}
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

        LoginManager
            .logInWithReadPermissions(['public_profile', 'email'])
            .then((result) => {
                if (result.isCancelled) {
                    dispatch(signInFailure('The user cancelled the request'))
                }

                // assuming success
                dispatch(signInSuccess(person, personRef))
                Actions.home()

                console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
                // get the access token
                return AccessToken.getCurrentAccessToken();
            })
            .then(data => {
                // create a new firebase credential with the token
                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

                // login with credential
                return firebase.auth().signInWithCredential(credential);
            })
            .then((currentUser) => {
                console.warn(JSON.stringify(currentUser.toJSON()));
            })
            .catch((error) => {
                dispatch(signInFailure(error))
            });
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