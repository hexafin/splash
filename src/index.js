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

class App extends Component {
	componentDidMount() {
		codePush.sync({
			updateDialog: false,
			installMode: codePush.InstallMode.IMMEDIATE
		});
	}

	render() {
		return (
			<Provider store={store}>
				<PersistGate
					loading={<Loading />}
					onBeforeLift={() => {
						// LoadApp();
					}}
					persistor={persistor}
				>
					<Routes
						ref={navigatorRef => {
							NavigatorService.setContainer(navigatorRef);
						}}
					/>
				</PersistGate>
			</Provider>
		);
	}
}

export default codePush(App);
