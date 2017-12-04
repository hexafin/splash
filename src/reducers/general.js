
import {
    FIREBASE_AUTH_INIT,
    FIREBASE_AUTH_SUCCESS,
    FIREBASE_AUTH_FAILURE,
    LINK_FACEBOOK_INIT,
    LINK_FACEBOOK_SUCCESS,
    LINK_FACEBOOK_FAILURE,
    NEW_ACCOUNT_INIT,
    NEW_ACCOUNT_SUCCESS,
    NEW_ACCOUNT_FAILURE,
    SIGN_OUT
} from "../actions/general";

const initialState = {
    authenticated: false,
    isAuthenticating: false,
    errorAuthenticating: null,
    isLinkingFacebook: false,
    errorLinkingFacebook: null,
    facebookToken: null,
    person: {},
    uid: null,
    isCreatingAccount: false,
    errorCreatingAccount: null
};

export default function generalReducer(state = initialState, action) {
    switch(action.type) {

        case FIREBASE_AUTH_INIT:
            return {
                ...state,
                isAuthenticating: true
            }

        case FIREBASE_AUTH_SUCCESS:
            return {
                ...state,
                isAuthenticating: false,
                authenticated: true,
                uid: action.uid
            }

        case FIREBASE_AUTH_FAILURE:
            return {
                ...state,
                isAuthenticating: false,
                authenticated: false,
                errorAuthenticating: action.error
            }

        case LINK_FACEBOOK_INIT:
            return {
                ...state,
                isLinkingFacebook: true
            }

        case LINK_FACEBOOK_SUCCESS:
            return {
                ...state,
                isLinkingFacebook: false,
                facebookToken: action.data.token,
                person: {
                    picture_url: action.data.picture_url,
                    first_name: action.data.first_name,
                    last_name: action.data.last_name,
                    gender: action.data.gender,
                    facebook_id: action.data.id,
                    email: action.data.email
                }
            }

        case LINK_FACEBOOK_FAILURE:
            return {
                ...state,
                isLinkingFacebook: false,
                errorLinkingFacebook: action.error
            }

        case NEW_ACCOUNT_INIT:
            return {
                ...state,
                isCreatingAccount: true
            }

        case NEW_ACCOUNT_SUCCESS:
            return {
                ...state,
                isCreatingAccount: false,
                person: action.person,
                personRef: action.personRef
            }

        case NEW_ACCOUNT_FAILURE:
            return {
                ...state,
                isCreatingAccount: false,
                errorCreatingAccount: action.error
            }

        case SIGN_OUT:
            return initialState

        default:
            return state

    }
}

