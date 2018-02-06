import React, {Component} from 'react';
import {
  Actions,
  Router,
  Reducer,
  Scene,
  Modal,
  Lightbox,
  Overlay,
  Stack
} from 'react-native-router-flux';
import {connect} from 'react-redux';

import Home from "./components/Home"
import Splash from "./components/Splash"
import ChooseUsername from "./components/ChooseUsername"
import Welcome from "./components/Welcome"
import Coinbase from "./components/Coinbase"
import ConfirmDetails from "./components/ConfirmDetails"
import ChoosePassword from "./components/ChoosePassword"
import ManageFunds from "./components/ManageFunds"
import SetAmount from "./components/SetAmount"
import Receipt from "./components/Receipt"
import Transaction from "./components/Transaction"
import MultiWallet from "./components/MultiWallet"
import Wallet from "./components/Wallet"
import Profile from "./components/Profile"
import Feedback from "./components/Feedback"
import Landing from "./components/Landing"
import Notify from "./components/Notify"



const scenes = Actions.create(
    <Overlay key="overlay" hideNavBar={true} panHandlers={null}>
        <Modal key="modal" hideNavBar={true} modal>
            <Lightbox key="lightbox">
              <Scene key="stack">
                  <Scene key="landing" component={Landing} hideNavBar={true} initial/>
                  <Scene key="splash" component={Splash} hideNavBar={true}/>
                  <Scene key="chooseUsername" component={ChooseUsername} hideNavBar={true}/>
                  <Scene key="welcome" component={Welcome} hideNavBar={true}/>
                  <Scene key="coinbase" component={Coinbase} hideNavBar={true}/>
                  <Scene key="confirmDetails" component={ConfirmDetails} hideNavBar={true}/>
                  <Scene key="choosePassword" component={ChoosePassword} hideNavBar={true}/>
                  <Scene key="manageFunds" component={ManageFunds} hideNavBar={true}/>
                  <Scene key="home" component={Home} hideNavBar={true}/>
              </Scene>
              <Scene key="notify" component={Notify} hideNavBar={true}/>
            </Lightbox>
            <Scene key="transaction" component={Transaction} hideNavBar={true}/>
            <Scene key="setamount" component={SetAmount} hideNavBar={true} />
            <Scene key="receipt" component={Receipt} hideNavBar={true} />
            <Scene key="multiWallet" component={MultiWallet} hideNavBar={true}/>
            <Scene key="wallet" component={Wallet} hideNavBar={true}/>
            <Scene key="profile" component={Profile} hideNavBar={true}/>
            <Scene key="feedback" component={Feedback} hideNavBar={true}/>
        </Modal>
    </Overlay>
)

class Routes extends React.Component {

    reducerCreate(params) {
        const defaultReducer = Reducer(params);
        return (state, action) => {
            this.props.dispatch(action)
            return defaultReducer(state, action);
        };
    }

    render () {

        return (
            <Router
                createReducer={this.reducerCreate.bind(this)}
                scenes={scenes} />
        );
    }
}

export default connect()(Routes);
