// container for Home page
import Home from "./Home"
import {connect} from "react-redux"
import {DeclineRequest, AcceptRequest, DeleteRequest} from "../../actions/transactions";
import {bindActionCreators} from "redux";

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
        exchangeRate: state.general.exchangeRate,
        transactions: state.transactions.transactions,
        requests: state.transactions.requests,
        waiting: state.transactions.waiting
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
      DeclineRequest, AcceptRequest, DeleteRequest
    }, dispatch)
}

export default connect(mapStatetoProps, mapDispatchToProps)(Home)
