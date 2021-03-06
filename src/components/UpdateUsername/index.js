import UpdateUsername from "./UpdateUsername";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ChangeUsername } from "../../redux/user/actions";

/*
Connecting UpdateUsername to redux
*/

const mapStateToProps = state => {
	let usernameValue = "";
	if (typeof state.form.updateSplashtag !== "undefined" && state.form.updateSplashtag.values) {
		usernameValue = state.form.updateSplashtag.values.updateUsername;
	}

	return {
		splashtag: state.user.entity.splashtag,
		isUpdatingUsername: state.user.isUpdatingUsername,
		errorUpdatingUsername: state.user.errorUpdatingUsername,
		usernameValue: usernameValue
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({ ChangeUsername }, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UpdateUsername);
