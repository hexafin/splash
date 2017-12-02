// container for splash page
import ConfirmDetails from "./ConfirmDetails"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
    return state
}

// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({
//         SignIn
//     }, dispatch)
// }

export default connect(mapStateToProps)(ConfirmDetails)