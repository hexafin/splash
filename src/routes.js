import React, {Component} from 'react';
import {connect} from 'react-redux';
import {TabNavigator} from "react-navigation"

import Landing from "./components/Landing"
import ChooseSplashtag from "./components/ChooseSplashtag"
import EnterPhoneNumber from "./components/EnterPhoneNumber"
import VerifyPhoneNumber from "./components/VerifyPhoneNumber"
import Waitlisted from "./components/Waitlisted"

export default OnboardingRouter = TabNavigator(
    {
        Landing: {
            screen: Landing,
            navigationOptions: {
                tabBarVisible: false
            }
        },
        ChooseSplashtag: {
            screen: ChooseSplashtag,
            navigationOptions: {
                tabBarVisible: false
            }
        },
        EnterPhoneNumber: {
            screen: EnterPhoneNumber,
            navigationOptions: {
                tabBarVisible: false
            }
        },
        VerifyPhoneNumber: {
            screen: VerifyPhoneNumber,
            navigationOptions: {
                tabBarVisible: false
            }
        },
        Waitlisted: {
            screen: Waitlisted,
            navigationOptions: {
                tabBarVisible: false
            }
        }
    },
    {
        animationEnabled: true,
        swipeEnabled: false,
        initialRouteName: "Landing"
    }
)
