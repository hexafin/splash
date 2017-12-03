// container for splash page
import Welcome from "./Welcome"
import {connect} from "react-redux"
import {LinkFacebook} from "../../actions/general"
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
    return state
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        LinkFacebook
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)