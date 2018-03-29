import api from "../../api";
var axios = require("axios");
import firebase from "react-native-firebase";
let firestore = firebase.firestore();
let analytics = firebase.analytics();
import { Sentry } from "react-native-sentry";
import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from "react-native-fcm";
analytics.setAnalyticsCollectionEnabled(true);

export const ActionTypes = {
    TAKE_OFF_WAITLIST: "TAKE_OFF_WAITLIST"
}

export function takeOffWaitlist() {
    return { types: ActionTypes.TAKE_OFF_WAITLIST }
}