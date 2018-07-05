import Home from "./Home"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {LoadTransactions} from "../../redux/transactions/actions"
import {LoadBalance, LoadExchangeRates} from "../../redux/crypto/actions"


const showTimeoutModal = () => {
  return {
    type: 'SHOW_MODAL',
    modalType: 'INFO',
    modalProps: {
    	title: 'Loading timeout',
    	body: 'Please connect to the internet and try again.',
    },   
  }
}

const mapStateToProps = (state) => {
    return {
    	isLoadingTransactions: state.transactions.isLoadingTransactions,
    	isLoadingExchangeRates: state.crypto.isLoadingExchangeRates,
    	isLoadingBalance: state.crypto.isLoadingBalance,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	LoadTransactions, LoadExchangeRates, LoadBalance, showTimeoutModal
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
