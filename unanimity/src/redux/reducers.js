import * as actionsTypes from './actions';

export const setAuthenticationReducer = (state = { authenticated: false }, action) => {
    if(action.type === actionsTypes.SET_AUTHENTICATION) {
        return { ...state, authenticated: action.payload };
    } else {
        return state;
    }
};