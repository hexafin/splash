import SetAmount from "./SetAmount"
import {CreateTransaction} from '../../actions/transactions'
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
    return {
      ExchangeRate: parseFloat(state.general.exchangeRate.USD),
      isCreatingTransaction: state.transactions.isCreatingTransaction
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        CreateTransaction
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SetAmount)
