import VerifyPhoneNumber from "./VerifyPhoneNumber";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SmsConfirm, SmsAuthenticate, SignUp } from "../../redux/onboarding/actions";
import { LogIn } from "../../redux/user/actions";
import { OpenWallet } from "../../redux/crypto/actions";

const mapStateToProps = state => {
	return {
		phoneNumber: state.onboarding.phoneNumber,
		countryName: state.onboarding.countryName,
		isSmsConfirming: state.onboarding.isSmsConfirming,
		isSmsAuthenticating: state.onboarding.isSmsAuthenticating,
		isSigningUp: state.onboarding.isSigningUp,
		successSigningUp: state.onboarding.successSigningUp,
		errorSigningUp: state.onboarding.errorSigningUp
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			SmsConfirm,
			SmsAuthenticate,
			SignUp,
			OpenWallet,
			LogIn
		},
		dispatch
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPhoneNumber);
