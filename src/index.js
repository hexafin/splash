import React, { Component } from "react";
import { CreateRootNavigator } from "./router";

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			signedIn: true, // placeholder value
			checkedSignedIn: false,
		};
	}

	componentWillMount() {
		//check to see if the user is signed in with firebase
	}

	render() {
		const { signedIn, checkedSignedIn } = this.state;

		// if not checked signed in wait to render (prevents this weird screen flashing bug)

		const Layout = CreateRootNavigator(signedIn);
		return <Layout />;
	}
}
