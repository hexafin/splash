// container for Home page
import Home from "./Home"
import {connect} from "react-redux"
import {DeclineRequest, AcceptRequest} from "../../actions/transactions";
import {bindActionCreators} from "redux";

const mapStatetoProps = state => {

    return {
        uid: state.general.uid,
        isLoadingTransactions: state.transactions.isLoadingTransactions,
        person: state.general.person,
        crypto: state.crypto,
        exchangeRate: state.general.exchangeRate,
        transactions: state.transactions.transactions,
        requests: state.transactions.requests,
        waiting: state.transactions.waiting
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
      DeclineRequest, AcceptRequest
    }, dispatch)
}

export default connect(mapStatetoProps, mapDispatchToProps)(Home)
