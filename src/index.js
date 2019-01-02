import React, { Component } from "react";
import { Provider, connect } from "react-redux";

import { PersistGate } from "redux-persist/es/integration/react";
import codePush from "react-native-code-push";
import { Sentry } from "react-native-sentry";
import Routes from "./routes";
import configureStore from "./store/configureStore";
import Loading from "./components/universal/Loading";
import NavigatorService from "./redux/navigator";

const { persistor, store } = configureStore();

codePush.getUpdateMetadata().then(update => {
	if (update) {
		Sentry.setVersion(update.appVersion + "-codepush:" + update.label);
	}
});

console.disableYellowBox = true

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
			loggedIn: false
		}
	}

	render() {

		const Router = Routes(this.state.loggedIn)

		return (
			<Provider store={store}>
				<PersistGate
					loading={<Loading />}
					persistor={persistor}
					onBeforeLift={() => {
						const state = store.getState()
						this.setState(prevState => {
							return {
								...prevState,
								loggedIn: state.user.loggedIn
							}
						})
					}}>
					<Router
						ref={navigatorRef => {
							NavigatorService.setContainer(navigatorRef);
						}}
					/>
				</PersistGate>
			</Provider>
		);
	}
}

export default codePush(codePushOptions)(App);
