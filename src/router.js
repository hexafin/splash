import React, { Component } from "react";
import { View, StyleSheet, Image, StatusBar, KeyboardAvoidingView } from "react-native";
import { StackNavigator, TabNavigator, SafeAreaView } from "react-navigation";

// import onboarding screens
// import sign in
// import sign up

import Transactions from "./components/TransactionsScene";
import Market from "./components/MarketScene";
import Friends from "./components/FriendsScene";

import ChooseDestinationWallet from "./components/TransactionScene/ChooseDestinationWallet";
import SetAmount from "./components/TransactionScene/SetAmount";
import Confirmation from "./components/TransactionScene/Confirmation";


// stack navigator for all onboarding screens
// export const SignedOut = StackNavigator(
// 	{
// 		// all onboarding screens in proper order
// 	},
// 	{
// 		headerMode: "none",
// 	},
// );

export const HomeTabs = TabNavigator(
	{
		Tab1: { screen: Transactions },
		Tab2: { screen: Market },
		Tab3: { screen: Friends },
	},
	{
		// some of these are default values, they're here as placeholders
		swipeEnabled: false,
		//backgroundColor:
		tabBarOptions: {
			showLabel: true,
			activeTintColor: "#FFFFFF",
			// style: {
			//   borderTopWidth: 0,
			//   backgroundColor: "transparent",
			//
			// }
		},
	},
	(navigationOptions = {
		tabBarVisible: true,
	}),
);

export const createRootNavigator = (signedIn = false) => {
	return StackNavigator(
		{
			SignedIn: { screen: SignedIn },
			// SignedOut: { screen: SignedOut }, // uncomment once the stack navigator above is filled
		},
		{
			headerMode: "none",
			mode: "modal",
			initialRouteName: signedIn ? "SignedIn" : "SignedOut",
			navigationOptions: {
				gesturesEnabled: false,
			},
		},
	);
};


export const SignedIn = StackNavigator(
		{
			HomeTabs: {screen: HomeTabs},
			ChooseDestinationWallet: { screen: ChooseDestinationWallet },
			SetAmount: { screen: SetAmount },
			Confirmation: { screen: Confirmation },
		},
		{
			headerMode: "none",
			initialRouteName: 'HomeTabs',
			navigationOptions: {
				gesturesEnabled: false,
			},
		},
	);
