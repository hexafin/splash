import EnterPhoneNumber from "./EnterPhoneNumber"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {ClaimUsername, InviteFriends} from "../../actions/waitlist"

const mapStateToProps = (state) => {

    let splashtag = ""
    if (typeof state.form.chooseSplashtag !== 'undefined' && state.form.chooseSplashtag.values) {
        splashtag = state.form.chooseSplashtag.values.splashtag
    }

    let phoneNumber = ""
    if (typeof state.form.enterPhoneNumber !== 'undefined' && state.form.enterPhoneNumber.values) {
        phoneNumber = state.form.enterPhoneNumber.values.phoneNumber
    }

    return {
      phoneNumber: phoneNumber,
      splashtag: splashtag
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        ClaimUsername, InviteFriends
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EnterPhoneNumber)
