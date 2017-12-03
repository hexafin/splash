import React, {Component} from 'react';
import {Actions, Router, Reducer, Scene} from 'react-native-router-flux';
import {connect} from 'react-redux';

import Home from "./components/Home"
import Splash from "./components/Splash"
import ChooseUsername from "./components/ChooseUsername"
import Welcome from "./components/Welcome"
import ConfirmDetails from "./components/ConfirmDetails"
import ChoosePassword from "./components/ChoosePassword"
import AddFunds from "./components/AddFunds"

export const scenes = Actions.create(
    <Scene key="root" hideNavBar={true}>
        <Scene key="splash" component={Splash} hideNavBar={true}/>
        <Scene key="chooseUsername" component={ChooseUsername} hideNavBar={true}/>
        <Scene key="welcome" component={Welcome} hideNavBar={true} initial/>
        <Scene key="confirmDetails" component={ConfirmDetails} hideNavBar={true}/>
        <Scene key="choosePassword" component={ChoosePassword} hideNavBar={true}/>
        <Scene key="addFunds" component={AddFunds} hideNavBar={true}/>
        <Scene key="home" component={Home} hideNavBar={true}/>
    </Scene>
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