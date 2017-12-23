import firebase from 'react-native-firebase'
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)


import {
    FIREBASE_AUTH_INIT,
    FIREBASE_AUTH_SUCCESS,
    FIREBASE_AUTH_FAILURE,
    LINK_FACEBOOK_INIT,
    LINK_FACEBOOK_SUCCESS,
    LINK_FACEBOOK_FAILURE,
    NEW_ACCOUNT_INIT,
    NEW_ACCOUNT_SUCCESS,
    NEW_ACCOUNT_FAILURE,
    UPDATE_ACCOUNT_INIT,
    UPDATE_ACCOUNT_SUCCESS,
    UPDATE_ACCOUNT_FAILURE,
    UPDATE_BALANCE_INIT,
    UPDATE_BALANCE_SUCCESS,
    UPDATE_BALANCE_FAILURE,
    SIGN_OUT
} from "../actions/general";

const initialState = {
    authenticated: false,
    isAuthenticating: false,
    errorAuthenticating: null,
    isLinkingFacebook: false,
    errorLinkingFacebook: null,
    facebookToken: null,
    person: {},
    privateKey: null,
    uid: null,
    balance: null,
    isCreatingAccount: false,
    errorCreatingAccount: null,
    isUpdatingAccount: false,
    errorUpdatingAccount: null,
    isUpdatingBalance: false,
    errorUpdatingBalance: null
};

export default function generalReducer(state = initialState, action) {
    switch(action.type) {

        case FIREBASE_AUTH_INIT:
            return {
                ...state,
                isAuthenticating: true
            }

        case FIREBASE_AUTH_SUCCESS:

            analytics.setUserId(action.iud)

            return {
                ...state,
                isAuthenticating: false,
                authenticated: true,
                uid: action.uid
            }

        case FIREBASE_AUTH_FAILURE:
            return {
                ...state,
                isAuthenticating: false,
                authenticated: false,
                errorAuthenticating: action.error
            }

        case LINK_FACEBOOK_INIT:
            return {
                ...state,
                isLinkingFacebook: true
            }

        case LINK_FACEBOOK_SUCCESS:
            return {
                ...state,
                isLinkingFacebook: false,
                facebookToken: action.data.token,
                person: {
                    picture_url: action.data.picture_url,
                    first_name: action.data.first_name,
                    last_name: action.data.last_name,
                    gender: action.data.gender,
                    facebook_id: action.data.id,
                    email: action.data.email
                }
            }

        case LINK_FACEBOOK_FAILURE:
            return {
                ...state,
                isLinkingFacebook: false,
                errorLinkingFacebook: action.error
            }

        case NEW_ACCOUNT_INIT:
            return {
                ...state,
                isCreatingAccount: true
            }

        case NEW_ACCOUNT_SUCCESS:
            return {
                ...state,
                isCreatingAccount: false,
                person: action.person,
                privateKey: action.privateKey,
            }

        case NEW_ACCOUNT_FAILURE:
            return {
                ...state,
                isCreatingAccount: false,
                errorCreatingAccount: action.error
            }

        case UPDATE_ACCOUNT_INIT:
            return {
                ...state,
                isUpdatingAccount: true
            }

        case UPDATE_ACCOUNT_SUCCESS:
            return {
                ...state,
                isUpdatingAccount: false,
                person: action.person
            }

        case UPDATE_ACCOUNT_FAILURE:
            return {
                ...state,
                isUpdatingAccount: false,
                errorUpdatingAccount: action.error
            }

        case UPDATE_BALANCE_INIT:
            return {
                ...state,
                isUpdatingBalance: true
            }

        case UPDATE_BALANCE_SUCCESS:
            return {
                ...state,
                isUpdatingBalance: false,
                balance: action.balance
            }

        case UPDATE_BALANCE_FAILURE:
            return {
                ...state,
                isUpdatingBalance: false,
                errorUpdatingBalance: action.error
            }

        case SIGN_OUT:
            return initialState

        default:
            return state

    }
}
