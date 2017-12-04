// container for splash page
import ConfirmDetails from "./ConfirmDetails"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

import {CreateNewAccount} from "../../actions/general";

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        CreateNewAccount
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDetails)