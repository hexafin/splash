// container for Home page
import Home from "./Home"
import {connect} from "react-redux"
import {SignIn} from "../../actions/general";
import {bindActionCreators} from "redux";

const mapStatetoProps = state => {

    return {
        uid: state.general.uid,
        person: state.general.person,
        crypto: state.crypto,
        exchangeRate: state.general.exchangeRate,
        transactions: state.transactions.transactions,
        requests: state.transactions.requests.requests,
        waiting: state.transactions.requests.waiting
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        SignIn
    }, dispatch)
}

export default connect(mapStatetoProps, mapDispatchToProps)(Home)
