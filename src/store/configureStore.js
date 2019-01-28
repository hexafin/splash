import { Sentry } from 'react-native-sentry';
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistCombineReducers } from "redux-persist"
import storage from 'redux-persist/es/storage'
import reducers from '../redux/reducers'
import thunkMiddleware from "redux-thunk"
import {createLogger} from 'redux-logger'
import createRavenMiddleware from "raven-for-redux";
import { sentryDSN } from '../../env/keys.json'

const config = {
    key: 'root',
    storage,
    blacklist: ['onboarding', 'payFlow', 'modal', 'form']
}

const persistReducers = persistCombineReducers(config, reducers)

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ })

// configure redux store
export default function configureStore () {

    if (!__DEV__) { // if not dev log sentry errors
        Sentry.config(sentryDSN).install();        
    }

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    // log redux crumbs
    const middleware = [createRavenMiddleware(Sentry), thunkMiddleware]

    if (__DEV__) {
        middleware.push(loggerMiddleware)
    }

    let store = composeEnhancers(
        applyMiddleware(...middleware)
    )(createStore)(persistReducers);

    let persistor = persistStore(store)

    return { store, persistor }
}
