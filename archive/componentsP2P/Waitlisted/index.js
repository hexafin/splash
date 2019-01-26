import Waitlisted from "./Waitlisted"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {ClaimUsername, InviteFriends} from "../../actions/waitlist"

const mapStateToProps = (state) => {
    return {
      waitlisted: state.waitlist.waitlisted,
      splashtag: state.waitlist.username || "yourname"
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({

    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Waitlisted)
