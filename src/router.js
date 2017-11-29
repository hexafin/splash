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

import Wallets from "./components/WalletsScene";
import Settings from "./components/SettingsScene";

import Icon from 'react-native-vector-icons/Entypo';


// stack navigator for all onboarding screens
// export const OnboardingScreen = StackNavigator(
// 	{
// 		// all onboarding screens in proper order
// 	},
// 	{
// 		headerMode: "none",
// 	},
// );

export const BaseScreen = TabNavigator(
    {
        Home: {
            screen: Transactions,
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({tintColor}) => <Icon name={"add-to-list"} size={30} color={tintColor}/>
            })
        },
        Market: {
            screen: Market,
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({tintColor}) => <Icon name={"shop"} size={30} color={tintColor}/>
            })
        },
        Friends: {
            screen: Friends,
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({tintColor}) => <Icon name={"users"} size={30} color={tintColor}/>
            })
        },
    },
    {
        // some of these are default values, they're here as placeholders
        swipeEnabled: true,
        initialRouteName: 'Home',
        //backgroundColor:
        tabBarOptions: {
            showLabel: false,
            activeTintColor: "#401584",
            showIcon: true
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

//
export const ApplicationScreen = StackNavigator(
    {
        Settings: { screen: Settings },
        Wallets: { screen: Wallets },
        Base: { screen: BaseScreen },
        ChooseDestinationWallet: { screen: ChooseDestinationWallet },
        SetAmount: { screen: SetAmount },
        Confirmation: { screen: Confirmation },
    },
    {
        headerMode: "none",
        animationEnabled: true,
        initialRouteName: 'Base',
        mode: "modal",
        navigationOptions: {
            gesturesEnabled: false,
        },
    },
);

export const CreateRootNavigator = (signedIn = false) => {
	return StackNavigator(
		{
			//Onboarding: { screen: OnboardingScreen },
			Application: { screen: ApplicationScreen }
		},
		{
			headerMode: "none",
			mode: "modal",
			initialRouteName: signedIn ? "Application" : "Onboarding",
			navigationOptions: {
				gesturesEnabled: false,
			},
		},
	);
};


