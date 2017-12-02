// container for Home page
import Home from "./Home"
import {connect} from "react-redux"

const mapStatetoProps = state => {
    console.log(state)
    return {
        signedIn: state.signedIn
    }
}

export default connect(mapStatetoProps)(Home)