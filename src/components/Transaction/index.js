import Transaction from "./Transaction"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
  return {
      friends: state.general.friends
  }
}


export default connect(mapStateToProps)(Transaction)
