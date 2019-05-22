import SwipeApp from "./SwipeApp";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LoadTransactions } from "../../redux/transactions/actions";
import { Load, setActiveCurrency } from "../../redux/crypto/actions";
import { startLockoutClock, resetLockoutClock } from "../../redux/user/actions";

/*
connecting presentational SwipeApp component to redux values and actions
*/

const notificationPermissionInfo = buttonCallback => {
	return {
		type: "SHOW_MODAL",
		modalType: "INFO",
		modalProps: {
			title: "Turn On Notifications",
			body: "Get notified when you receive money or a friend thanks you.",
			buttonTitle: "Great",
			buttonCallback: buttonCallback
		}
	};
};

const linkExtensionPin = (pin) => {
  return {
    type: 'SHOW_MODAL',
    modalType: 'INFO',
    modalProps: {
        title: 'Link Extension',
        body: `Enter this pin: ${pin} on your browser extension to pair!`,
        buttonTitle: 'Got it',
    },   
  }
}

const setNotifsRequested = requested => {
	return {
		type: "NOTIFICATIONS_REQUESTED",
		requested: requested
	};
};

const mapStateToProps = state => {
	return {
		transactions: state.transactions.transactions,
		isLoadingTransactions: state.transactions.isLoadingTransactions,
		errorLoadingTransactions: state.transactions.errorLoadingTransactions,
		exchangeRates: state.crypto.exchangeRates,
		isLoadingExchangeRates: state.crypto.isLoadingExchangeRates,
		loadingExchangeRatesCurrency: state.crypto.loadingExchangeRatesCurrency,
		successLoadingExchangeRates: state.crypto.successLoadingExchangeRates,
		errorLoadingExchangeRates: state.crypto.errorLoadingExchangeRates,
		balance: state.crypto.balance,
		isLoadingBalance: state.crypto.isLoadingBalance,
		loadingBalanceCurrency: state.crypto.loadingBalanceCurrency,
		successLoadingBalance: state.crypto.successLoadingBalance,
		errorLoadingBalance: state.crypto.errorLoadingBalance,
		lockoutTime: state.user.lockoutTime,
		lockoutEnabled: state.user.lockoutEnabled,
		notificationsRequested: state.user.notificationsRequested,
		activeCryptoCurrency: state.crypto.activeCryptoCurrency,
		splashtag: state.user.entity.username || "yourname",
		loggedIn: state.user.loggedIn,
		userId: state.user.id
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			Load,
			resetLockoutClock,
			startLockoutClock,
			setNotifsRequested,
			linkExtensionPin,
			notificationPermissionInfo,
			setActiveCurrency,
			LoadTransactions
		},
		dispatch
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SwipeApp);
