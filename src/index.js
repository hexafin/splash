import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'

import { PersistGate } from 'redux-persist/es/integration/react'
import codePush from "react-native-code-push";
import { Sentry } from 'react-native-sentry';
import Routes from './routes'
import configureStore from "./store/configureStore"
import { LoadApp } from "./actions/general"
import Loading from "./components/universal/Loading"

const { persistor, store } = configureStore()

codePush.getUpdateMetadata().then((update) => {
  if (update) {
    Sentry.setVersion(update.appVersion + '-codepush:' + update.label);
  }
});

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate
                  loading={<Loading/>}
                  onBeforeLift={() => {LoadApp()}}
                  persistor={persistor}>
                  <Routes/>
                </PersistGate>
            </Provider>
        )
    }
}

export default codePush(App)
