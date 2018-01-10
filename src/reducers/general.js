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
    LINK_COINBASE_INIT,
    LINK_COINBASE_SUCCESS,
    LINK_COINBASE_FAILURE,
    NEW_ACCOUNT_INIT,
    NEW_ACCOUNT_SUCCESS,
    NEW_ACCOUNT_FAILURE,
    UPDATE_ACCOUNT_INIT,
    UPDATE_ACCOUNT_SUCCESS,
    UPDATE_ACCOUNT_FAILURE,
    UPDATE_EXCHANGE_INIT,
    UPDATE_EXCHANGE_SUCCESS,
    UPDATE_EXCHANGE_FAILURE,
    UPDATE_FRIENDS_INIT,
    UPDATE_FRIENDS_SUCCESS,
    UPDATE_FRIENDS_FAILURE,
    FRIENDS_SEARCH_CHANGE,
    SIGN_OUT
} from "../actions/general";

const initialState = {
    authenticated: false,
    isAuthenticating: false,
    errorAuthenticating: null,
    isLinkingFacebook: false,
    isLinkingCoinbase: false,
    errorLinkingCoinbase: null,
    errorLinkingFacebook: null,
    facebookToken: null,
    coinbase_info: {},
    person: {},
    friends: [],
    uid: null,
    exchangeRates: {},
    isCreatingAccount: false,
    errorCreatingAccount: null,
    isUpdatingAccount: false,
    errorUpdatingAccount: null,
    isUpdatingExchangeRate: false,
    errorUpdatingExchangeRate: null,
    isUpdatingFriends: false,
    friendsSearchQuery: '',
    errorUpdatingFriends: null
};

export default function generalReducer(state = initialState, action) {
    switch(action.type) {

        case FIREBASE_AUTH_INIT:
            return {
                ...state,
                isAuthenticating: true
            }

        case FIREBASE_AUTH_SUCCESS:

            analytics.setUserId(action.uid)

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
                    ...state.person,
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

        case LINK_COINBASE_INIT:
            return {
                ...state,
                isLinkingCoinbase: true
            }

        case LINK_COINBASE_SUCCESS:
            return {
                ...state,
                isLinkingCoinbase: false,
                person: {
                    ...state.person,
                    coinbase_id: action.data.coinbase_id,
                },
                coinbase_info: action.data.coinbase_info,
            }

        case LINK_COINBASE_FAILURE:
            return {
                ...state,
                isLinkingCoinbase: false,
                errorLinkingCoinbase: action.error
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

        case UPDATE_EXCHANGE_INIT:
            return {
                ...state,
                isUpdatingExchangeRate: true
            }

        case UPDATE_EXCHANGE_SUCCESS:
            return {
                ...state,
                isUpdatingExchangeRate: false,
                exchangeRate: action.exchangeRate
            }

        case UPDATE_EXCHANGE_FAILURE:
            return {
                ...state,
                isUpdatingExchangeRate: false,
                errorUpdatingExchangeRate: action.error
            }

        case UPDATE_FRIENDS_INIT:
            return {
                ...state,
                isUpdatingFriends: true
            }

        case UPDATE_FRIENDS_SUCCESS:
            return {
                ...state,
                isUpdatingFriends: false,
                friends: action.friends
            }

        case UPDATE_FRIENDS_FAILURE:
            return {
                ...state,
                isUpdatingFriends: false,
                errorUpdatingFriends: action.error
            }

        case FRIENDS_SEARCH_CHANGE:
          return {
            ...state,
            friendsSearchQuery: action.query
          }

        case SIGN_OUT:
            return initialState

        default:
            return state

    }
}
