import Home from "./Home"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {LoadTransactions} from "../../redux/transactions/actions"

const mapStateToProps = (state) => {
    return {
    	splashtag: state.user.entity.username || "yourname",
    	loggedIn: state.user.loggedIn,
    	transactions: state.transactions.transactions,
    	isLoadingTransactions: state.transactions.isLoadingTransactions,
    	errorLoadingTransactions: state.transactions.errorLoadingTransactions
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	LoadTransactions
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
