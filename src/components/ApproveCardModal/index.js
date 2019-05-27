import ApproveCardModal from "./ApproveCardModal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ApproveTransaction, DismissTransaction } from "../../redux/transactions/actions";

/*
Connecting ApproveCardModal to redux
*/

const mapStateToProps = state => {
	return {
		loading: state.transactions.isApprovingTransaction,
		error: state.transactions.errorApprovingTransaction
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			ApproveTransaction,
			DismissTransaction
		},
		dispatch
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ApproveCardModal);
