
import {
    SIGN_IN_INIT,
    SIGN_IN_SUCCESS,
    SIGN_IN_FAILURE,
    LINK_FACEBOOK_INIT,
    LINK_FACEBOOK_SUCCESS,
    LINK_FACEBOOK_FAILURE,
    NEW_ACCOUNT_INIT,
    NEW_ACCOUNT_SUCCESS,
    NEW_ACCOUNT_FAILURE,
    SIGN_OUT
} from "../actions/general";

const initialState = {
    signedIn: false,
    isSigningIn: false,
    errorSigningIn: null,
    isLinkingFacebook: false,
    errorLinkingFacebook: null,
    person: {
        picture_url: null,
        username: null,
        first_name: null,
        last_name: null,
    },
    personRef: null,
    isCreatingAccount: false,
    errorCreatingAccount: null
};

export default function generalReducer(state = initialState, action) {
    switch(action.type) {

        case SIGN_IN_INIT:
            return {
                ...state,
                isSigningIn: true
            }

        case SIGN_IN_SUCCESS:
            return {
                ...state,
                isSigningIn: false,
                signedIn: true,
                person: action.person,
                personRef: action.personRef
            }

        case SIGN_IN_FAILURE:
            return {
                ...state,
                isSigningIn: false,
                signedIn: false,
                errorSigningIn: action.error
            }

        case NEW_ACCOUNT_INIT:
            return {
                ...state,
                isCreatingAccount: true
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
                person: {
                    picture_url: action.picture.data.url,
                    first_name: action.first_name,
                    last_name: action.last_name,
                    gender: action.gender,
                    facebook_id: action.id
                }
            }

        case LINK_FACEBOOK_FAILURE:
            return {
                ...state,
                isLinkingFacebook: false,
                errorLinkingFacebook: action.error
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

