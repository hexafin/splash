import SendTo from "./SendTo";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { showApproveModal } from "../../redux/modal";
import { LoadTransactions, DismissTransaction } from "../../redux/transactions/actions";
import { LoadContacts } from "../../redux/user/actions";

/*
Connecting SendTo to redux
*/

const addContactsInfo = buttonCallback => {
    return {
        type: "SHOW_MODAL",
        modalType: "INFO",
        modalProps: {
            title: "Add Contacts",
            body:
                "Splash let’s you find people you know via their phone numbers, so you can send them money without typing out long addresses and be sure it’s them.",
            buttonTitle: "Got it",
            buttonCallback: buttonCallback
        }
    };
};

const mapStateToProps = state => {
    const activeCryptoCurrency = state.crypto.activeCryptoCurrency;
    return {
        activeCryptoCurrency: activeCryptoCurrency,
        sendCurrency: state.payFlow.currency,
        sendAmount: state.payFlow.amount,
        network: state.crypto.wallets[activeCryptoCurrency]
            ? state.crypto.wallets[activeCryptoCurrency].network
            : state.crypto.wallets.ETH.network,
        userAddress: state.crypto.wallets[activeCryptoCurrency]
            ? state.crypto.wallets[activeCryptoCurrency].address
            : state.crypto.wallets.ETH.address,
        address: state.payFlow.address,
        capturedQr: state.payFlow.capturedQr,
        userId: state.user.id,
        contacts: state.user.contacts
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            showApproveModal,
            LoadTransactions,
            LoadContacts,
            DismissTransaction,
            addContactsInfo
        },
        dispatch
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SendTo);
