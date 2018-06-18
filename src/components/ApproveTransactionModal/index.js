import ApproveTransactionModal from "./ApproveTransactionModal"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {SendTransaction, DismissTransaction} from "../../redux/transactions/actions"

const mapStateToProps = (state) => {
    return {
      loading: state.transactions.isSendingTransaction,
      error: state.transactions.errorSendingTransaction,
      bitcoinNetwork: state.crypto.wallets.BTC.network,
      userBitcoinAddress: state.crypto.wallets.BTC.address,
      exchangeRate: state.crypto.exchangeRates.BTC,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
      SendTransaction, DismissTransaction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ApproveTransactionModal)
