
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from '../reducers/index';
import thunkMiddleware from "redux-thunk"
import {createLogger} from 'redux-logger';

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ })

export default function configureStore () {
    const middleware = [loggerMiddleware, thunkMiddleware]

    const store = compose(
        applyMiddleware(...middleware)
    )(createStore)(reducers);

    // if (module.hot) {
    //     module.hot.accept(() => {
    //         const nextRootReducer = require('../reducers/index').default
    //         store.replaceReducer(nextRootReducer)
    //     })
    // }
    return store
}