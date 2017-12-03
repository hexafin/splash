// container for splash page
import Welcome from "./Welcome"
import {connect} from "react-redux"
import {SignUpWithFacebook} from "../../actions/general"
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
    return state
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        SignUpWithFacebook
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)