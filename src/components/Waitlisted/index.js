import Waitlisted from "./Waitlisted"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
    return {
      waitlisted: state.user.waitlisted,
      splashtag: state.user.entity.username || "yourname"
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Waitlisted)
