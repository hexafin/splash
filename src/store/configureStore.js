
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from '../reducers/index';
import thunkMiddleware from "redux-thunk"
import {createLogger} from 'redux-logger';

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ })

export default function configureStore () {
    const enhancer = compose(
        applyMiddleware(
            loggerMiddleware, thunkMiddleware
        )
    )
    const store = createStore(reducers, enhancer)

    // if (module.hot) {
    //     module.hot.accept(() => {
    //         const nextRootReducer = require('../reducers/index').default
    //         store.replaceReducer(nextRootReducer)
    //     })
    // }
    return store
}