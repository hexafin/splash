// container for splash page
import ChooseUsername from "./ChooseUsername"
import {connect} from "react-redux"
// TODO: import UsernameExists and update page
import {bindActionCreators} from "redux"
import {CheckUsername} from '../../actions/general'

const mapStateToProps = (state) => {
    return {
      usernameError: state.general.usernameError,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        CheckUsername
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseUsername)
