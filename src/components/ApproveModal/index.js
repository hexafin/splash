import ApproveModal from "./ApproveModal"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import { ApproveTransaction, DismissTransaction } from "../../redux/transactions/actions";

const mapStateToProps = (state) => {
    return {
      loading: state.transaction.isApprovingTransaction,
      success: state.transaction.successApprovingTransaction,
      error: state.transaction.errorApprovingTransaction
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
      ApproveTransaction, DismissTransaction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ApproveModal)
