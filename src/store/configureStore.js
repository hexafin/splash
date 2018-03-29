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
    storage
}

const persistReducers = persistCombineReducers(config, reducers)

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ })

export default function configureStore () {

    //TODO: get sentry DSN from ENV variables
    Sentry.config(sentryDSN).install();

    const middleware = [createRavenMiddleware(Sentry), loggerMiddleware, thunkMiddleware]

    let store = compose(
        applyMiddleware(...middleware)
    )(createStore)(persistReducers);

    let persistor = persistStore(store)

    return { store, persistor }
}
