import Coinbase from "./Coinbase"
import {LoadApp, LinkCoinbase} from '../../actions/general'
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
    return {
      state
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        LoadApp, LinkCoinbase
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Coinbase)
