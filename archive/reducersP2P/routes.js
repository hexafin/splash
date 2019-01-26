import {ActionConst, Actions} from "react-native-router-flux"

import firebase from "react-native-firebase"
let analytics = firebase.analytics()

analytics.setAnalyticsCollectionEnabled(true)

const initialState = {
    scene: {},
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        // focus action is dispatched when a new screen comes into focus
        case ActionConst.FOCUS:

            analytics.setCurrentScreen(action.routeName)

            return {
                ...state,
                scene: action.routeName,
            }

        default:
            return state
    }
}