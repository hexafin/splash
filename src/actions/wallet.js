import {Actions} from "react-native-router-flux"
import api from "../api"

export const GET_BALANCE_INIT = "GET_BALANCE_INIT";
export function getBalaneInit() {
    return {type: GET_BALANCE_INIT}
}

export const GET_BALANCE_SUCCESS = "GET_BALANCE_SUCCESS";
export function getBalanceSuccess(balanceBTC, balanceUSD) {
    return {type: GET_BALANCE_SUCCESS, balanceBTC, balanceUSD}
}

export const GET_BALANCE_FAILURE = "GET_BALANCE_FAILURE";
export function getBalanceFailure() {
    return {type: GET_BALANCE_FAILURE}
}

export const GetBalance = () => {
    return (dispatch, getState) => {

        // get state
        const state = getState()

        // call api to get balance for wallet
        api.GetBalance(state.general.person.address_bitcoin).then(balance => {
            dispatch(getBalanceSuccess(balance.usd, balance.btc))
        }).catch(error => {
            dispatch(getBalanceFailure(error))
        })

    }
}