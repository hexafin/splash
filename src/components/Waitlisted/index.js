import Waitlisted from "./Waitlisted"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import { ApproveTransaction } from "../../redux/transaction/actions";

const mapStateToProps = (state) => {
    return {
      waitlisted: state.user.waitlisted,
      splashtag: state.waitlist.username || "yourname"
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
      ApproveTransaction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Waitlisted)
