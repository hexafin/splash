import Account from "./Account"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {resetUser, toggleLockout} from "../../redux/user/actions"
import {resetTransactions} from "../../redux/transactions/actions"
import {resetOnboarding} from "../../redux/onboarding/actions"
import {resetCrypto} from "../../redux/crypto/actions"
import NavigatorService from "../../redux/navigator"
import api from '../../api'


const mapStateToProps = state => {
	return {
		splashtag: state.user.entity.splashtag,
		userId: state.user.id,
		lockoutEnabled: state.user.lockoutEnabled,
	}
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
		logout: (userId) => {
			return (dispatch, getState) => {
				dispatch(resetUser())
				dispatch(resetTransactions())
				dispatch(resetOnboarding())
				dispatch(resetCrypto())
				NavigatorService.navigate("Landing")
				api.DeleteAccount(userId)
			}		
		},
    	toggleLockout
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)
