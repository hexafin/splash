import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import Routes from './routes'
import configureStore from "./store/configureStore"
import { Sentry, Raven } from 'react-native-sentry';
Sentry.config('https://1464b56890f14211a278666f8681e5bd:3933f8c8da1f48158890813340a0d8d1@sentry.io/268392').install();
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
