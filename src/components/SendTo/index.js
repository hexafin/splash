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
        body: 'Give Splash permission to access your contacts, so that we can connect you with new Splash users.',
        buttonTitle: 'Will do',
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
        checkContactsTime: state.user.checkContactsTime,
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
