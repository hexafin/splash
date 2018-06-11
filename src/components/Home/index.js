import Home from "./Home"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {LoadTransactions, UpdateExchangeRate} from "../../redux/transactions/actions"

const mapStateToProps = (state) => {
    return {
    	splashtag: state.user.entity.username || "yourname",
    	loggedIn: state.user.loggedIn,
    	transactions: state.transactions.transactions,
    	isLoadingTransactions: state.transactions.isLoadingTransactions,
    	errorLoadingTransactions: state.transactions.errorLoadingTransactions,
        bitcoinAddress: state.user.bitcoin.address,
        bitcoinNetwork: state.user.bitcoinNetwork,
        exchangeRates: state.transactions.exchangeRates
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	LoadTransactions, UpdateExchangeRate
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
