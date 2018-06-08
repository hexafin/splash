import ApproveTransactionModal from "./ApproveTransactionModal"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {SendTransaction, DismissTransaction} from "../../redux/transactions/actions"

const mapStateToProps = (state) => {
    return {
      loading: state.transactions.isSendingTransaction,
      error: state.transactions.errorSendingTransaction,
      bitcoinNetwork: state.user.bitcoinNetwork,
      userBitcoinAddress: state.user.bitcoin.address,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
      SendTransaction, DismissTransaction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ApproveTransactionModal)
