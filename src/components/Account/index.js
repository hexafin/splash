import Account from "./Account"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {resetUser} from "../../redux/user/actions"
import {resetTransactions} from "../../redux/transactions/actions"
import {resetOnboarding} from "../../redux/onboarding/actions"
import NavigatorService from "../../redux/navigator"
import api from '../../api'


const mapStateToProps = state => {
	return {
		splashtag: state.user.entity.splashtag,
		userId: state.user.id,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		logout: (userId) => {
			dispatch(resetUser())
			dispatch(resetTransactions())
			dispatch(resetOnboarding())
			NavigatorService.navigate("Landing")
			api.DeleteAccount(userId)
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)
