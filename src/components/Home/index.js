// container for Home page
import Home from "./Home"
import {connect} from "react-redux"
import {SignIn} from "../../actions/general";
import {bindActionCreators} from "redux";

const mapStatetoProps = state => {
    return {
        person: state.general.person,
        balanceBTC: state.general.balanceBTC,
        balanceUSD: state.general.balanceUSD,
        transactions: state.transactions
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        SignIn
    }, dispatch)
}

export default connect(mapStatetoProps, mapDispatchToProps)(Home)