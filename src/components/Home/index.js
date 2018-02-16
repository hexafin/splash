// container for Home page
import Home from "./Home"
import {connect} from "react-redux"
import {DeclineRequest, AcceptRequest, DeleteRequest, RemindRequest} from "../../actions/transactions";
import {bindActionCreators} from "redux";
import {LoadTransactions} from "../../actions/transactions"
import {GetCrypto} from "../../actions/crypto"
import {UpdateExchangeRate} from "../../actions/general"


const Refresh = () => {
  return (dispatch, getState) => {
    const loadTransactions = LoadTransactions()
    loadTransactions(dispatch, getState)

    const getCrypto = GetCrypto()
    getCrypto(dispatch, getState)

    const updateExchangeRate = UpdateExchangeRate()
    updateExchangeRate(dispatch, getState)
  }
}


const mapStatetoProps = state => {

    return {
        uid: state.general.uid,
        loading: state.transactions.isLoadingTransactions || state.crypto.loading || state.general.isUpdatingFriends || state.general.isUpdatingExchangeRate,
        loadingInfo: {
          transactionsLoading: state.transactions.isLoadingTransactions,
          cryptoLoading: state.crypto.loading,
          friendsLoading: state.general.isUpdatingFriends,
          exchangeRateLoading: state.general.isUpdatingExchangeRate,
        },
        person: state.general.person,
        crypto: state.crypto,
        exchangeRates: state.general.exchangeRates,
        transactions: state.transactions.transactions,
        requests: state.transactions.requests,
        waiting: state.transactions.waiting
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
      DeclineRequest, AcceptRequest, DeleteRequest, RemindRequest, Refresh
    }, dispatch)
}

export default connect(mapStatetoProps, mapDispatchToProps)(Home)
