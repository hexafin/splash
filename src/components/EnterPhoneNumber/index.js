import EnterPhoneNumber from "./EnterPhoneNumber"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {SmsAuthenticate} from "../../redux/onboarding/actions"

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
      splashtag: splashtag,
      smsError: state.onboarding.errorSmsAuthenticating,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        SmsAuthenticate
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EnterPhoneNumber)
