import ChooseSplashtag from "./ChooseSplashtag";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

/*
Connect ChooseSplashtag to redux
*/

const mapStateToProps = state => {
	let splashtag = "";
	if (typeof state.form.chooseSplashtag !== "undefined" && state.form.chooseSplashtag.values) {
		splashtag = state.form.chooseSplashtag.values.splashtag;
	}

	return {
		splashtag: splashtag
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({}, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChooseSplashtag);
