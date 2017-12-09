import Receipt from "./Receipt"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
    return state
}


export default connect(mapStateToProps)(Receipt)
