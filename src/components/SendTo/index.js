import SendTo from "./SendTo"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {showApproveModal} from "../../redux/modal"

const mapStateToProps = (state) => {
    return {
    	sendCurrency: state.payFlow.currency,
    	sendAmount: state.payFlow.amount,
    	bitcoinNetwork: state.crypto.wallets.BTC.network,
    	bitcoinAddress: state.crypto.wallets.BTC.address,
    	address: state.payFlow.address,
    	capturedQr: state.payFlow.capturedQr,
        userId: state.user.id,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	showApproveModal
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SendTo)
