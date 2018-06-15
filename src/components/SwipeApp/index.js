import SwipeApp from "./SwipeApp"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {LoadTransactions} from "../../redux/transactions/actions"
import {LoadBalance, LoadExchangeRates, setActiveCurrency} from "../../redux/crypto/actions"

const mapStateToProps = (state) => {
    return {
    	splashtag: state.user.entity.username || "yourname",
    	loggedIn: state.user.loggedIn,
    	transactions: state.transactions.transactions,
    	isLoadingTransactions: state.transactions.isLoadingTransactions,
    	errorLoadingTransactions: state.transactions.errorLoadingTransactions,
        bitcoinAddress: state.crypto.wallets.BTC.address,
        bitcoinNetwork: state.crypto.wallets.BTC.network,
        exchangeRates: state.crypto.exchangeRates.BTC,
        balance: state.crypto.balance.BTC,
        isLoadingExchangeRates: state.crypto.isLoadingExchangeRates,
        isLoadingBalance: state.crypto.isLoadingBalance,
        successLoadingExchangeRates: state.crypto.successLoadingExchangeRates,
        successLoadingBalance: state.crypto.successLoadingBalance,
        errorLoadingExchangeRates: state.crypto.errorLoadingExchangeRates,
        errorLoadingBalance: state.crypto.errorLoadingBalance,
        activeCurrency: state.crypto.activeCurrency,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	LoadTransactions, LoadBalance, LoadExchangeRates, setActiveCurrency
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SwipeApp)
