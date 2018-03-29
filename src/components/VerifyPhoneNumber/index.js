import VerifyPhoneNumber from "./VerifyPhoneNumber";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SmsConfirm, SmsAuthenticate } from "../../redux/waitlist/actions";

const mapStateToProps = state => {
	return {
		waitlisted: state.user.waitlisted,
		username: state.waitlist.username,
		phoneNumber: state.waitlist.phoneNumber,
		countryName: state.waitlist.countryName,
		confirmError: state.waitlist.errorSmsConfirming,
		claimError: state.waitlist.errorClaimingUsername,
		isSmsConfirming: state.waitlist.isSmsConfirming
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			SmsConfirm,
			SmsAuthenticate
		},
		dispatch
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPhoneNumber);
