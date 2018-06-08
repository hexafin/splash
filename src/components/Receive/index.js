import Receive from "./Receive"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

const mapStateToProps = state => {
	return {
		address: state.user.bitcoin.address,
		loggedIn: state.user.loggedIn
	}
}

const mapDispatchToProps = dispatch => {
	return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Receive)
