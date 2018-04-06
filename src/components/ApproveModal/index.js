import ApproveModal from "./ApproveModal"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import { ApproveTransaction, DismissTransaction } from "../../redux/transaction/actions";

const mapStateToProps = (state) => {
    return {
      loading: state.transaction.isApprovingTransaction,
      success: state.transaction.approveTransactionSuccess,
      error: state.transaction.approveTransactionError
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
      ApproveTransaction, DismissTransaction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ApproveModal)
