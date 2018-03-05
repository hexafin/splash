// container for splash page
import Splash from "./Splash"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {LogInWithFacebook, LoadApp, LogOut} from "../../actions/general"

const mapStateToProps = (state) => {
    return {
      authenticated: state.general.authenticated
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        LogInWithFacebook, LoadApp, LogOut
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash)