import { ActionConst } from 'react-native-router-flux';


export default function reducer(state = {}, action = {type, scene}) {
    console.log('test')
    console.log(action)
    switch (type) {
        // focus action is dispatched when a new screen comes into focus
        case ActionConst.FOCUS:
            console.log(action)
            return {...state, scene}

        default:
            return state;
    }
}