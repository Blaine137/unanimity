import {createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const initialState = {
    counter: 0
}

const rootReducer = (state = initialState, action) => {
    return state;
};

export const ConfigStore = createStore(rootReducer);