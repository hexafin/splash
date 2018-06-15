import Home from "./Home"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {LoadTransactions} from "../../redux/transactions/actions"
import {LoadBalance, LoadExchangeRates} from "../../redux/crypto/actions"

const mapStateToProps = (state) => {
    return {
    	
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	LoadTransactions, LoadExchangeRates, LoadBalance
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
