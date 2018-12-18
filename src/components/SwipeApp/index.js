import SwipeApp from "./SwipeApp"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {LoadTransactions, DismissTransaction} from "../../redux/transactions/actions"
import {LoadBalance, LoadExchangeRates, setActiveCurrency} from "../../redux/crypto/actions"
import {showCardModal} from "../../redux/modal"

const mapStateToProps = (state) => {
    return {
    	activeCryptoCurrency: state.crypto.activeCryptoCurrency,
    	splashtag: state.user.entity.username || "yourname",
        loggedIn: state.user.loggedIn,
        userId: state.user.id,
        exchangeRate: state.crypto.exchangeRates[state.crypto.activeCryptoCurrency].USD,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	LoadTransactions, LoadBalance, LoadExchangeRates, setActiveCurrency, showCardModal, DismissTransaction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SwipeApp)
