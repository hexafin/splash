// container for Home page
import Home from "./Home"
import {connect} from "react-redux"
import {SignIn} from "../../actions/general";
import {bindActionCreators} from "redux";
import api from '../../api'

const mapStatetoProps = state => {
    const BTC = (state.crypto.BTC.balance*0.00000001)
    const USDExchangeRate = parseFloat(state.general.exchangeRate.BTC.USD)

    return {
        person: state.general.person,
        balanceBTC: (BTC).toFixed(4),
        balanceUSD: (BTC*USDExchangeRate).toFixed(2),
        transactions: state.transactions.transactions
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        SignIn
    }, dispatch)
}

export default connect(mapStatetoProps, mapDispatchToProps)(Home)
