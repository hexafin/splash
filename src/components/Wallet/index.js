import Wallet from "./Wallet"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {GetCrypto} from "../../actions/crypto";

const mapStateToProps = (state) => {
    const crypto = state.crypto
    const exchangeRates = state.general.exchangeRates
    const defaultCurrency = state.general.person.default_currency
    return {crypto, exchangeRates, defaultCurrency}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        GetCrypto
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
