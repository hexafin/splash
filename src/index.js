import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import { Actions, ActionConst, Router, Scene } from 'react-native-router-flux'
import configureStore from "./store/configureStore"

import Home from "./components/Home"
import Splash from "./components/Splash"
import ChooseUsername from "./components/ChooseUsername"


const RouterWithRedux = connect()(Router)
const store = configureStore()

const Scenes = Actions.create(
    <Scene key="root" hideNavBar={true}>
        <Scene key="splash" component={Splash} hideNavBar={true}/>
        <Scene key="chooseUsername" component={ChooseUsername} hideNavBar={true} initial/>
        <Scene key="home" component={Home} hideNavBar={true}/>
    </Scene>
)

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <RouterWithRedux hideNavBar={true} scenes={Scenes}/>
            </Provider>
        )
    }
}