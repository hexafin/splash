import React, { Component } from "react";
import { View, Image, Text } from "react-native";

// import selected icon
// import unselected icon

export default class Transactions extends Component {
	//--- switches the displayed icon if screen is in view ---//
	// static navigationOptions = {
	// 	tabBarIcon: ({ tintColor }) =>
	// 		tintColor == "#FFFFFF" ? (
	// 			<Image source={selected icon} style={styles.icon} />
	// 		) : (
	// 			<Image source={unselected icon}} style={styles.icon} />
	// 		),
	// };

	render() {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<Text>transactions</Text>
			</View>
		);
	}
}
