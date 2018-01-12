import Profile from "./Profile"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {UpdateAccount} from "../../actions/general";

const mapStateToProps = (state) => {

    const person = state.general.person

    return {
        person: person,
        initialValues: {
            first_name: person.first_name,
            last_name: person.last_name,
            email: person.email,
            username: person.username,
            default_currency: person.default_currency
        }
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        UpdateAccount
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile)
