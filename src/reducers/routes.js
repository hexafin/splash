import {ActionConst} from "react-native-router-flux"

const initialState = {
    scene: {},
}

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        // focus action is dispatched when a new screen comes into focus
        case ActionConst.FOCUS:

            // autofocus username input on choose username page
            // if (action.routeName == "chooseUsername") {
            //     state.form.username.RegisteredFields
            // }
            return {
                ...state,
                scene: action.routeName,
            }

        default:
            return state
    }
}