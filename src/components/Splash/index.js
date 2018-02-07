// container for splash page
import Splash from "./Splash"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
    return {
      authenticated: state.general.authenticated
    }
}

// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({
//
//     }, dispatch)
// }

export default connect(mapStateToProps)(Splash)
