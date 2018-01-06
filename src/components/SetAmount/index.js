import SetAmount from "./SetAmount"
import {CreateTransaction} from '../../actions/transactions'
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
    return {
      btcExchangeRate: parseFloat(state.general.exchangeRate.BTC.USD),
      isCreatingTransaction: state.transactions.isCreatingTransaction
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        CreateTransaction
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SetAmount)
