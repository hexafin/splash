import SendTo from "./SendTo"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {sendTo} from "../../redux/payFlow"

const mapStateToProps = (state) => {
    return {
    	sendCurrency: state.payFlow.currency,
    	sendAmount: state.payFlow.amount,
    	bitcoinNetwork: state.crypto.wallets.BTC.network,
    	bitcoinAddress: state.crypto.wallets.BTC.address,
    	address: state.payFlow.address,
    	capturedQr: state.payFlow.capturedQr,
        userSplashtag: state.user.entity.splashtag,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	sendTo
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SendTo)
