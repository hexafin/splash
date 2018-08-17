import Account from "./Account"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import {resetUser, toggleLockout, setBiometric} from "../../redux/user/actions"
import { ToggleNetwork, resetCrypto } from '../../redux/crypto/actions'
import {resetTransactions} from "../../redux/transactions/actions"
import {resetOnboarding} from "../../redux/onboarding/actions"
import NavigatorService from "../../redux/navigator"
import api from '../../api'


const deleteAccount = () => {
	return (dispatch, getState) => {
		const state = getState()
		const userId = state.user.id
		dispatch(resetUser())
		dispatch(resetTransactions())
		dispatch(resetOnboarding())
		dispatch(resetCrypto())
		api.DeleteAccount(userId)
	}		
}

const showLockInfo = () => {
  return {
    type: 'SHOW_MODAL',
    modalType: 'INFO',
    modalProps: {
        title: 'Set a Passcode',
        body: 'Set a four-digit passcode to secure your Splash wallet. After closing the app for 5 minutes you will be asked to authenticate using the passcode or biometrics.',
    },   
  }
}

const showMainnetInfo = (buttonCallback) => {
  return {
    type: 'SHOW_MODAL',
    modalType: 'INFO',
    modalProps: {
        title: 'Mainnet Beta',
        body: 'Splash mainnet is currently in Beta and undergoing security testing. We invite you try it out and please let us know if you encounter any problems.',
        buttonTitle: 'Let\'s do it',
        buttonCallback: buttonCallback,
    },   
  }
}

const showDeleteModal = (deleteCallback) => {
  return {
    type: 'SHOW_MODAL',
    modalType: 'DELETE',
    modalProps: {
    	backgroundColor: 'red',
    	deleteCallback: deleteCallback, 
    },   
  }
}

const mapStateToProps = state => {
	let network = 'testnet'
	if (typeof state.crypto.wallets.BTC !== 'undefined') {
		network = state.crypto.wallets.BTC.network
	}
	return {
		splashtag: state.user.entity.splashtag,
		userId: state.user.id,
		lockoutEnabled: state.user.lockoutEnabled,
		bitcoinNetwork: network,
		biometricEnabled: state.user.biometric,
	}
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
    	deleteAccount,
    	toggleLockout,
    	showLockInfo,
        showMainnetInfo,
    	showDeleteModal,
    	resetTransactions,
    	ToggleNetwork,
    	setBiometric,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)
