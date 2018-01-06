// container for Home page
import Home from "./Home"
import {connect} from "react-redux"
import {SignIn} from "../../actions/general";
import {bindActionCreators} from "redux";

const mapStatetoProps = state => {
    return {
        person: state.general.person,
        balanceBTC: (state.general.balance.BTC).toFixed(6),
        balanceUSD: 0, // TODO: use exchange rate to get USD from BTC
        transactions: state.transactions
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        SignIn
    }, dispatch)
}

export default connect(mapStatetoProps, mapDispatchToProps)(Home)
