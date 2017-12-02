import { ActionConst } from 'react-native-router-flux';
import {
    SIGN_IN_SUCCESS
} from "../actions"

const initialState = {
    scene: {},
}

export default function reducer(state = initialState, action = {}) {
    console.log('test')
    console.log(action)
    switch (action.type) {
        // focus action is dispatched when a new screen comes into focus
        case ActionConst.FOCUS:

            console.log(action)
            return {
                ...state,
                scene: action.scene,
            }


        default:
            return state;
    }
}