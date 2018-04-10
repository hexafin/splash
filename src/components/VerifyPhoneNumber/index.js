import VerifyPhoneNumber from "./VerifyPhoneNumber";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SmsConfirm, SmsAuthenticate } from "../../redux/onboarding/actions";

const mapStateToProps = state => {
	return {
		waitlisted: state.user.waitlisted,
		phoneNumber: state.onboarding.phoneNumber,
		countryName: state.onboarding.countryName,
		confirmError: state.onboarding.errorSmsConfirming,
		claimError: state.onboarding.errorClaimingUsername,
		isSmsConfirming: state.onboarding.isSmsConfirming,
		isSmsAuthenticating: state.onboarding.isSmsAuthenticating
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
