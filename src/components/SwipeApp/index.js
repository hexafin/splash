import SwipeApp from "./SwipeApp"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {LoadTransactions} from "../../redux/transactions/actions"
import {LoadBalance, LoadExchangeRates, setActiveCurrency} from "../../redux/crypto/actions"

const mapStateToProps = (state) => {
    return {
    	activeCryptoCurrency: state.crypto.activeCryptoCurrency,
    	splashtag: state.user.entity.username || "yourname",
        loggedIn: state.user.loggedIn,
        userId: state.user.id,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	LoadTransactions, LoadBalance, LoadExchangeRates, setActiveCurrency
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SwipeApp)
