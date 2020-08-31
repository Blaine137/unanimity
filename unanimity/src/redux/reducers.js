import * as actionsTypes from './actions';

export const setLandingReducer = (state = { landing: true }, action) => {

    switch(action.type){
        case actionsTypes.SET_LANDING:
            return {...state, landing: action.payload};
        default:
            return state;
    }

};

export const setContactReducer = (state = { contactForm: false }, action) => {

    switch(action.type){
        case actionsTypes.SET_CONTACTFORM:
            return {...state, contactForm: action.payload};
        default: 
            return state;
    }

};

export const setAuthenticationReducer = (state = { authenticated: false }, action) => {
    if(action.type === actionsTypes.SET_AUTHENTICATION) {
        return { ...state, authenticated: action.payload };
    } else {
        return state;
    }
};

