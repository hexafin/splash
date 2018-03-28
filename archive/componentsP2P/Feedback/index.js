import Feedback from "./Feedback"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {SubmitFeedback} from "../../actions/general";

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        SubmitFeedback
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Feedback)
