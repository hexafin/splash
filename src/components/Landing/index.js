import Landing from "./Landing"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {ClaimUsername, InviteFriends, getDeepLinkedSplashtag, SmsAuthenticate} from "../../actions/waitlist"

const mapStateToProps = (state) => {
    return {
      waitlisted: state.general.waitlisted,
      splashtagOnHold: state.waitlist.splashtagOnHold,
      phoneNumber: state.waitlist.phoneNumber,
      username: state.general.person.username,
      smsAuthenticated: state.waitlist.smsAuthenticated
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        ClaimUsername, InviteFriends, getDeepLinkedSplashtag, SmsAuthenticate
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing)
