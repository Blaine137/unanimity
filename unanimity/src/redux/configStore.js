import {createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import * as reducers from './reducers';

export const ConfigStore = createStore(
    combineReducers({
        authentication: reducers.authenticationReducer,
        setLanding: reducers.setLandingReducer,
        setContact: reducers.setContactReducer,
        messenger: reducers.setShowSidebarReducer,
    }),
    applyMiddleware(thunk, logger)
);