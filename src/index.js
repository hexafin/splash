import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import { Router, Scene } from 'react-native-router-flux'
import Home from "./components/Home"
import Splash from "./components/Splash"
import configureStore from "./store/configureStore"

const store = configureStore()
const RouterWithRedux = connect()(Router)

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <RouterWithRedux hideNavBar={true}>
                    <Scene key="root" hideNavBar={true}>
                        <Scene key="splash" component={Splash} initial={true} hideNavBar={true}></Scene>
                        <Scene key="application" hideNavBar={true}>
                            <Scene key="home" component={Home} hideNavBar={true}/>
                        </Scene>
                    </Scene>
                </RouterWithRedux>
            </Provider>
        )
    }
}