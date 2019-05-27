import SetPasscode from "./SetPasscode";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

/*
Connecting SetPasscode to redux
*/

const mapStateToProps = state => {
	return {
		userId: state.user.id
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({}, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SetPasscode);
