import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';

export const ConfigStore = createStore(
  combineReducers({
    authentication: reducers.authenticationReducer,
    messenger: reducers.messengerReducer,
  }),
  applyMiddleware(thunk),
);
