import ViewTransactionModal from "./ViewTransactionModal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

/*
Connecting ViewTransactionModal to redux
*/

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({}, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewTransactionModal);
