import firebase from 'react-native-firebase'
import {Sentry} from 'react-native-sentry'
let analytics = firebase.analytics()
analytics.setAnalyticsCollectionEnabled(true)

import { ActionTypes } from "./actions.js"

const initialState = {
    waitlisted: true,
    splashtag: null
}

export default function reducer(state = initialState, action) {
    switch (action.type) {

        case ActionTypes.TAKE_OFF_WAITLIST:
            return {
                ...state,
                waitlisted: false
            }

        default:
            return state
    }
}
