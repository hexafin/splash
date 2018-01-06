import Receipt from "./Receipt"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {LoadApp} from '../../actions/general'

const mapStateToProps = (state) => {
    return state
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        LoadApp
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Receipt)
