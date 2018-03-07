import VerifyPhoneNumber from "./VerifyPhoneNumber"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {SmsAuthenticate} from "../../actions/waitlist"

const mapStateToProps = (state) => {
    return {
      waitlisted: state.general.waitlisted,
      username: state.waitlist.username,
      phoneNumber: state.waitlist.phoneNumber,
      countryName: state.waitlist.countryName
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        SmsAuthenticate
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPhoneNumber)
