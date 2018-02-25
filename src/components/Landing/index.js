import Landing from "./Landing"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {ClaimUsername, InviteFriends} from "../../actions/waitlist"

const mapStateToProps = (state) => {
    return {
      waitlisted: state.general.waitlisted,
      username: state.general.person.username
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        ClaimUsername, InviteFriends
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing)
