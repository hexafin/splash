// container for splash page
import ChooseUsername from "./ChooseUsername"
import {connect} from "react-redux"
// TODO: import UsernameExists and update page
import {bindActionCreators} from "redux"

// const mapStateToProps = (state) => {
//     return state
// }

// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({
//         SignIn
//     }, dispatch)
// }

export default connect()(ChooseUsername)