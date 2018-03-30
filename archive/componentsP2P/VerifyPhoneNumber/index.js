import VerifyPhoneNumber from "./VerifyPhoneNumber"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {SmsConfirm, SmsAuthenticate} from "../../actions/waitlist"

const mapStateToProps = (state) => {
    return {
      waitlisted: state.general.waitlisted,
      username: state.waitlist.username,
      phoneNumber: state.waitlist.phoneNumber,
      countryName: state.waitlist.countryName,
      confirmError: state.waitlist.errorSmsConfirming,
      claimError: state.waitlist.errorClaimingUsername,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        SmsConfirm, SmsAuthenticate
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPhoneNumber)