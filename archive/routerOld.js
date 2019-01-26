import React, { Component } from "react";
import { View, StyleSheet, Image, StatusBar, KeyboardAvoidingView } from "react-native";
import { StackNavigator, TabNavigator, SafeAreaView } from "react-navigation";

// import onboarding screens
// import sign in
// import sign up

import Transactions from "../src/components/TransactionsScene/index";
import Market from "../src/components/MarketScene/index";
import Friends from "../src/components/FriendsScene/index";

import ChooseDestinationWallet from "../src/components/TransactionScene/ChooseDestinationWallet/index";
import SetAmount from "../src/components/TransactionScene/SetAmount/index";
import Confirmation from "../src/components/TransactionScene/Confirmation/index";

import Wallets from "../src/components/WalletsScene/index";
import Settings from "../src/components/SettingsScene/index";

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
        Market: {
            screen: Market,
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({tintColor}) => <Icon name={"shop"} size={30} color={tintColor}/>
            })
        },
        Home: {
            screen: Transactions,
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({tintColor}) => <Icon name={"text-document-inverted"} size={30} color={tintColor}/>
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

export const CreateRootNavigator = (signedIn = true) => {
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


