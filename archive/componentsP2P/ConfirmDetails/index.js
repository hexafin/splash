// container for splash page
import ConfirmDetails from "./ConfirmDetails"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"

import {CreateNewAccount} from "../../actions/general";

const mapStateToProps = (state) => {
	const person = state.general.person
    return {
    	initialValues: {
    		first_name: person.first_name,
    		last_name: person.last_name,
    		email: person.email
    	}
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        CreateNewAccount
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDetails)