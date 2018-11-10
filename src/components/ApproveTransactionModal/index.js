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
    const activeCryptoCurrency = state.crypto.activeCryptoCurrency
    return {
      activeCryptoCurrency,
      loading: state.transactions.isSendingTransaction,
      error: state.transactions.errorSendingTransaction,
      network: state.crypto.wallets[activeCryptoCurrency].network,
      userAddress: state.crypto.wallets[activeCryptoCurrency].address,
      exchangeRate: state.crypto.exchangeRates[activeCryptoCurrency].USD,
      biometricEnabled: state.user.biometric,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
      SendTransaction, showTimeoutModal
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ApproveTransactionModal)
