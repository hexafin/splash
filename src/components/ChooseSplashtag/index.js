import ChooseSplashtag from "./ChooseSplashtag"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {ClaimUsername, InviteFriends} from "../../actions/waitlist"

const mapStateToProps = (state) => {

    let splashtag = ""
    if (state.form.chooseSplashtag.values) {
        splashtag = state.form.chooseSplashtag.values.splashtag
    }

    return {
        splashtag: splashtag
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({

    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseSplashtag)
