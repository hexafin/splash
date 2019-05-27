import Unlock from "./Unlock";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

/*
Connecting Unlock to redux
*/

const mapStateToProps = state => {
	return {
		biometricEnabled: state.user.biometric
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({}, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Unlock);
