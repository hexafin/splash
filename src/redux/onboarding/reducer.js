import {
    SMS_AUTH_INIT,
    SMS_AUTH_SUCCESS,
    SMS_AUTH_FAILURE,
    SIGN_UP_INIT,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAILURE,
    HOLD_SPLASHTAG,
    SMS_CONFIRM_INIT,
    SMS_CONFIRM_SUCCESS,
    SMS_CONFIRM_FAILURE,
    RESET_ONBOARDING
} from "./actions.js";

const initialState = {
    isSmsAuthenticating: false,
    errorSmsAuthenticating: null,
    splashtagOnHold: null,
    phoneNumber: null,
    countryName: null,
    smsAuthenticated: false,
    isSmsConfirming: false,
    errorSmsConfirming: null,
    isSigningUp: false,
    successSigningUp: false,
    errorSigningUp: null
};

export default function onboardingReducer(state = initialState, action) {
    switch (action.type) {
        case HOLD_SPLASHTAG:
            return {
                ...state,
                splashtagOnHold: action.splashtag,
                phoneNumber: action.phoneNumber
            };

        case SIGN_UP_INIT:
            return {
                ...state,
                isSigningUp: true,
                errorSigningUp: null
            };

        case SIGN_UP_SUCCESS:
            return {
                ...state,
                isSigningUp: false,
                successSigningUp: true
            };

        case SIGN_UP_FAILURE:
            return {
                ...state,
                isSigningUp: false,
                errorSigningUp: action.error
            };

        case SMS_AUTH_INIT:
            return {
                ...state,
                isSmsAuthenticating: true,
                isSmsConfirming: false,
                isSigningUp: false,
                errorSmsAuthenticating: null,
                errorSmsConfirming: null,
                errorSigningUp: null,
                smsAuthenticated: false,
                phoneNumber: action.phoneNumber,
                countryName: action.countryName
            };

        case SMS_AUTH_SUCCESS:
            return {
                ...state,
                isSmsAuthenticating: false,
                errorSmsAuthenticating: null,
            };

        case SMS_AUTH_FAILURE:
            return {
                ...state,
                isSmsAuthenticating: false,
                errorSmsAuthenticating: action.error
            };

        case SMS_CONFIRM_INIT:
            return {
                ...state,
                isSmsConfirming: true,
                errorSmsConfirming: null
            };

        case SMS_CONFIRM_SUCCESS:
            return {
                ...state,
                isSmsConfirming: false,
                smsAuthenticated: true
            };

        case SMS_CONFIRM_FAILURE:
            return {
                ...state,
                isSmsConfirming: false,
                errorSmsConfirming: action.error
            };

        case RESET_ONBOARDING:
            return initialState;

        default:
            return state;
    }
}
