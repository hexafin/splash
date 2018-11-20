import Wallet from "./Wallet"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

const mapStateToProps = state => {
	return {
		splashtag: state.user.entity.splashtag,
		loggedIn: state.user.loggedIn,
		activeCryptoCurrency: state.crypto.activeCryptoCurrency,
		activeCurrencyAddress: state.crypto.wallets[state.crypto.activeCryptoCurrency] ? state.crypto.wallets[state.crypto.activeCryptoCurrency].address : state.crypto.wallets["ETH"].address
	}
}

const mapDispatchToProps = dispatch => {
	return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
