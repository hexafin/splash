import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import codePush from "react-native-code-push";
import { Sentry } from 'react-native-sentry';
import Routes from './routes'
import configureStore from "./store/configureStore"

const store = configureStore()

codePush.getUpdateMetadata().then((update) => {
  if (update) {
    Sentry.setVersion(update.appVersion + '-codepush:' + update.label);
  }
});

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Routes/>
            </Provider>
        )
    }
}

export default codePush(App)
