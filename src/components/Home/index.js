import Home from "./Home"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
    return {
    	splashtag: state.user.entity.username || "yourname",
    	loggedIn: state.user.loggedIn,
      transactions: state.transactions.transactions,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
