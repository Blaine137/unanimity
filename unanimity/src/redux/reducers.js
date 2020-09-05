import * as actionsTypes from './actions';

export const setLandingReducer = (state = { landing: true }, action) => {
    switch(action.type) {
        case actionsTypes.SET_LANDING:
            return {...state, landing: action.payload};
        default:
            return state;
    }
};

export const setContactReducer = (state = { contactForm: false }, action) => {
    switch(action.type) {
        case actionsTypes.SET_CONTACTFORM:
            return {...state, contactForm: action.payload};
        default: 
            return state;
    }
};

export const authenticationReducer = (state = { authenticated: false, userId: null, username: null }, action) => {
    switch(action.type) {
        case actionsTypes.SET_AUTHENTICATION:
            return { ...state, authenticated: action.payload };
        case actionsTypes.SET_USER_ID:
            return { ...state, userId: action.payload }
        case actionsTypes.SET_USERNAME:
            return { ...state, username: action.payload }
        default: 
            return state;
    }
};

export const setShowSidebarReducer = (state = { showSidebar: true }, action) => {

    switch(action.type){

        case actionsTypes.SET_SHOWSIDEBAR:
            return { ...state, showSidebar: action.payload };
        default:
            return state;

    }

};