import Landing from './LandingSwipeView'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
	InviteFriends,
	getDeepLinkedSplashtag,
	SmsAuthenticate
} from '../../redux/onboarding/actions'
import { ClaimUsername } from '../../redux/user/actions'

const mapStateToProps = state => {
	return {
		loggedIn: state.user.loggedIn,
		splashtagOnHold: state.onboarding.splashtagOnHold,
		phoneNumber: state.onboarding.phoneNumber,
		username: state.user.splashtag,
		smsAuthenticated: state.onboarding.smsAuthenticated
	}
}

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			ClaimUsername,
			InviteFriends,
			getDeepLinkedSplashtag,
			SmsAuthenticate
		},
		dispatch
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing)
