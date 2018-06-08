import Send from "./Send"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"


const mapStateToProps = state => {
	return {
        bitcoinAddress: state.user.bitcoin.address,
        formAmount: (typeof state.form.sendForm !== 'undefined' && state.form.sendForm.values) ? state.form.sendForm.values.amount : null,
        formAddress: (typeof state.form.sendForm !== 'undefined' && state.form.sendForm.values) ? state.form.sendForm.values.address : null,
        bitcoinNetwork: state.user.bitcoinNetwork,
	}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Send)
