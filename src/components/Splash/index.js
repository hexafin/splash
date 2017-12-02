// container for splash page
import Splash from "./Splash"
import {connect} from "react-redux"
import {signIn} from "../../actions"
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
    return state
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        signIn
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash)