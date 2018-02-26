import Landing from "./Landing"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {ClaimUsername, InviteFriends, getDeepLinkedSplashtag} from "../../actions/waitlist"

const mapStateToProps = (state) => {
    return {
      waitlisted: state.general.waitlisted,
      splashtagOnHold: state.waitlist.splashtagOnHold,
      phoneNumber: state.waitlist.phoneNumber,
      username: state.general.person.username
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        ClaimUsername, InviteFriends, getDeepLinkedSplashtag
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing)
