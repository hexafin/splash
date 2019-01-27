import Home from "./Home"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {LoadTransactions} from "../../redux/transactions/actions"
import {Load} from "../../redux/crypto/actions"


const showTimeoutModal = () => {
  return {
    type: 'SHOW_MODAL',
    modalType: 'INFO',
    modalProps: {
    	title: 'Network error',
    	body: 'Please connect to the internet and try again.',
    },   
  }
}

const mapStateToProps = (state) => {
    return {
        activeCryptoCurrency: state.crypto.activeCryptoCurrency,
        isLoadingTransactions: state.transactions.isLoadingTransactions,
        isLoadingExchangeRates: state.crypto.isLoadingExchangeRates,
        isLoadingBalance: state.crypto.isLoadingBalance,
        errorLoadingTransactions: state.transactions.errorLoadingTransactions,
        errorLoadingExchangeRates: state.crypto.errorLoadingExchangeRates,
        errorLoadingBalance: state.crypto.errorLoadingBalance,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	showTimeoutModal, Load
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
