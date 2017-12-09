// container for splash page
import Landing from "./Landing"
import {connect} from "react-redux"
import {LoadApp} from '../../actions/general'
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
    return {
        ...state,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        LoadApp
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing)
