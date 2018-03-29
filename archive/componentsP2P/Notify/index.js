import Notify from "./Notify"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
    return {}
}

// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({
//         GetCrypto
//     }, dispatch)
// }


export default connect(mapStateToProps)(Notify)
