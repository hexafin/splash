import ApproveTransactionModal from "./ApproveTransactionModal"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {SendTransaction, DismissTransaction} from "../../redux/transactions/actions"


const showTimeoutModal = () => {
  return {
    type: 'SHOW_MODAL',
    modalType: 'INFO',
    modalProps: {
      title: 'Sending timeout',
      body: 'Please connect to the internet and try again.',
    },   
  }
}

const mapStateToProps = (state) => {
    return {
      loading: state.transactions.isSendingTransaction,
      error: state.transactions.errorSendingTransaction,
      bitcoinNetwork: state.crypto.wallets.BTC.network,
      userBitcoinAddress: state.crypto.wallets.BTC.address,
      exchangeRate: state.crypto.exchangeRates.BTC.USD,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
      SendTransaction, showTimeoutModal
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ApproveTransactionModal)
