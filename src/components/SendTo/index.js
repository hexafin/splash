import SendTo from "./SendTo"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {showApproveModal} from "../../redux/modal"
import {LoadTransactions, DismissTransaction} from "../../redux/transactions/actions"
import {LoadContacts} from '../../redux/user/actions'


const addContactsInfo = (buttonCallback) => {
  return {
    type: 'SHOW_MODAL',
    modalType: 'INFO',
    modalProps: {
        title: 'Add Contacts',
        body: 'Splash let’s you find people you know via their phone numbers, so you can send them money without typing out long bitcoin addresses and be sure it’s them.',
        buttonTitle: 'Got it',
        buttonCallback: buttonCallback,
    },   
  }
}


const mapStateToProps = (state) => {
    return {
    	sendCurrency: state.payFlow.currency,
    	sendAmount: state.payFlow.amount,
    	bitcoinNetwork: state.crypto.wallets.BTC.network,
    	bitcoinAddress: state.crypto.wallets.BTC.address,
    	address: state.payFlow.address,
    	capturedQr: state.payFlow.capturedQr,
        userId: state.user.id,
        contacts: state.user.contacts,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	showApproveModal,
        LoadTransactions,
        LoadContacts,
        DismissTransaction,
        addContactsInfo
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SendTo)
