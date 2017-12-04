import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import Routes from './routes'
import configureStore from "./store/configureStore"
const store = configureStore()

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Routes/>
            </Provider>
        )
    }
}
