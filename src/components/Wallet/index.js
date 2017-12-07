import Wallet from "./Wallet"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {GetBalance} from "../../actions/wallet";

const mapStateToProps = (state) => {
    return state
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        GetBalance
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
