import firebase from 'react-native-firebase'
import {Sentry} from 'react-native-sentry'
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

import {ActionTypes} from "./actions.js"

const initialState = {
  activeCurrency: "USD",
  wallets: {},
  balance: {},
  loadingBalanceCurrency: null,
  isLoadingBalance: false,
  successLoadingBalance: false,
  errorLoadingBalance: null,
  exchangeRates: {},
  loadingExchangeRatesCurrency: null,
  isLoadingExchangeRates: false,
  successLoadingExchangeRates: false,
  errorLoadingExchangeRates: null,
}

export default function cryptoReducer(state = initialState, action) {
    switch (action.type) {

      case ActionTypes.SET_ACTIVE_CURRENCY:
        return {
          ...state,
          activeCurrency: action.currency
        }

      case ActionTypes.OPEN_WALLET_INIT:
        return {
          ...state,
          isOpeningWallet: true,
          openingWalletCurrency: action.currency
        }

      case ActionTypes.OPEN_WALLET_SUCCESS:
        return {
          ...state,
          isOpeningWallet: false,
          successOpeningWallet: true,
          wallets: {
            ...state.wallets,
            [state.openingWalletCurrency]: action.wallet
          }
        }

      case ActionTypes.OPEN_WALLET_FAILURE:
        return {
          ...state,
          isOpeningWallet: false,
          errorOpeningWallet: action.error
        }

      case ActionTypes.LOAD_BALANCE_INIT:
        return {
          ...state,
          isLoadingBalance: true,
          loadingBalanceCurrency: action.currency
        }

      case ActionTypes.LOAD_BALANCE_SUCCESS:
        return {
          ...state,
          isLoadingBalance: false,
          successLoadingBalance: true,
          balance: {
            ...state.balance,
            [state.loadingBalanceCurrency]: action.balance
          }
        }

      case ActionTypes.LOAD_BALANCE_FAILURE:
        return {
          ...state,
          isLoadingBalance: false,
          errorLoadingBalance: action.error
        }

      case ActionTypes.LOAD_EXCHANGE_RATES_INIT:
        return {
          ...state,
          isLoadingBalance: true,
          loadingBalanceCurrency: action.currency
        }

      case ActionTypes.LOAD_EXCHANGE_RATES_SUCCESS:
        return {
          ...state,
          isLoadingExchangeRates: false,
          successLoadingExchangeRates: true,
          exchangeRates: {
            ...state.exchangeRates,
            [state.loadingExchangeRateCurrency]: action.exchangeRate
          }
        }

      case ActionTypes.LOAD_EXCHANGE_RATES_FAILURE:
        return {
          ...state,
          isLoadingExchangeRates: false,
          errorLoadingExchangeRates: action.error
        }

      default:
          return state
    }
}
