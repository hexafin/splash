import SetAmount from "./SetAmount"
import {CreateTransaction} from '../../actions/transactions'
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {cryptoUnits} from "../../lib/cryptos"


const mapStateToProps = (state) => {
    const balance = (state.crypto.BTC.balance/cryptoUnits.BTC)
    const exchangeRate = parseFloat(state.general.exchangeRate.BTC['USD'])
    return {
      relativeBalance: (balance*exchangeRate).toFixed(2),
      ExchangeRate: exchangeRate,
      isCreatingTransaction: state.transactions.isCreatingTransaction
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        CreateTransaction
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SetAmount)
