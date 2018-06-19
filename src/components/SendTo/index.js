import SendTo from "./SendTo"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

const mapStateToProps = (state) => {
    return {
    	
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    	
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SendTo)
