import Unlock from "./Unlock"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import { resetLockoutClock } from "../../redux/user/actions"

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ resetLockoutClock }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Unlock)
