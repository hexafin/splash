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
import {TabNavigator} from "react-navigation"

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
import Notify from "./components/Notify"
import Landing from "./components/Landing"
import ChooseSplashtag from "./components/ChooseSplashtag"
import EnterPhoneNumber from "./components/EnterPhoneNumber"
import VerifyPhoneNumber from "./components/VerifyPhoneNumber"
import Waitlisted from "./components/Waitlisted"

export default OnboardingRouter = TabNavigator(
    {
        Landing: {
            screen: Landing,
            navigationOptions: {
                tabBarVisible: false
            }
        },
        ChooseSplashtag: {
            screen: ChooseSplashtag,
            navigationOptions: {
                tabBarVisible: false
            }
        },
        EnterPhoneNumber: {
            screen: EnterPhoneNumber,
            navigationOptions: {
                tabBarVisible: false
            }
        },
        VerifyPhoneNumber: {
            screen: VerifyPhoneNumber,
            navigationOptions: {
                tabBarVisible: false
            }
        },
        Waitlisted: {
            screen: Waitlisted,
            navigationOptions: {
                tabBarVisible: false
            }
        }
    },
    {
        animationEnabled: true,
        swipeEnabled: false,
        initialRouteName: "EnterPhoneNumber"
    }
)


// const scenes = Actions.create(
//     <Overlay key="overlay" hideNavBar={true} panHandlers={null}>
//         <Lightbox key="lightbox">
//             <Modal key="modal" hideNavBar={true} modal>
//                 <Scene key="splash" component={Splash} hideNavBar={true} initial/>
//                 <Scene key="mainStack">
//                     <Scene key="home" component={Home} hideNavBar={true}/>
//                     <Scene key="chooseUsername" component={ChooseUsername} hideNavBar={true}/>
//                     <Scene key="welcome" component={Welcome} hideNavBar={true}/>
//                     <Scene key="coinbase" component={Coinbase} hideNavBar={true}/>
//                     <Scene key="confirmDetails" component={ConfirmDetails} hideNavBar={true}/>
//                     <Scene key="choosePassword" component={ChoosePassword} hideNavBar={true}/>
//                     <Scene key="manageFunds" component={ManageFunds} hideNavBar={true}/>
//                 </Scene>
//                 <Scene key="transactionStack">
//                     <Scene key="transaction" component={Transaction} hideNavBar={true}/>
//                     <Scene key="setamount" component={SetAmount} hideNavBar={true} />
//                     <Scene key="receipt" component={Receipt} hideNavBar={true} />
//                 </Scene>
//                 <Scene key="multiWallet" component={MultiWallet} hideNavBar={true}/>
//                 <Scene key="wallet" component={Wallet} hideNavBar={true}/>
//                 <Scene key="profile" component={Profile} hideNavBar={true}/>
//                 <Scene key="feedback" component={Feedback} hideNavBar={true}/>
//             </Modal>
//         <Scene key="notify" component={Notify} hideNavBar={true}/>
//         </Lightbox>
//     </Overlay>
// )
//
// class Routes extends React.Component {
//
//     reducerCreate(params) {
//         const defaultReducer = Reducer(params);
//         return (state, action) => {
//             this.props.dispatch(action)
//             return defaultReducer(state, action);
//         };
//     }
//
//     render () {
//
//         return (
//             <Router
//                 createReducer={this.reducerCreate.bind(this)}
//                 scenes={scenes} />
//         )
//     }
// }
//export default connect()(Routes);
