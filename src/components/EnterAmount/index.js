import EnterAmount from "./EnterAmount"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {setActiveCurrency} from "../../redux/crypto/actions"
import {enterAmount} from "../../redux/payFlow"

const mapStateToProps = (state) => {
    return {
    	activeCurrency: state.crypto.activeCurrency,
    	balance: state.crypto.balance,
    	exchangeRates: state.crypto.exchangeRates
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	setActiveCurrency,
    	enterAmount,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EnterAmount)
