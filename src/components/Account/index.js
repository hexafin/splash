import Account from "./Account"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {resetUser} from "../../redux/user/actions"
import {resetTransactions} from "../../redux/transactions/actions"
import {resetOnboarding} from "../../redux/onboarding/actions"
import NavigatorService from "../../redux/navigator"


const mapStateToProps = state => {
	return {
		splashtag: state.user.entity.username
	}
}

const mapDispatchToProps = dispatch => {
	return {
		logout: () => {
			dispatch(resetUser())
			dispatch(resetTransactions())
			dispatch(resetOnboarding())
			NavigatorService.navigate("Landing")
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)
