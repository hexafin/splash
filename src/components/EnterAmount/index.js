import EnterAmount from "./EnterAmount"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {enterAmount} from "../../redux/payFlow"

const mapStateToProps = (state) => {
    return {
    	activeCryptoCurrency: state.crypto.activeCryptoCurrency,
    	balance: state.crypto.balance,
    	exchangeRates: state.crypto.exchangeRates
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	enterAmount,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EnterAmount)
