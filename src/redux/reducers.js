import * as actionsTypes from './actions';

export const setLandingReducer = (state = { landing: true }, action) => {
    switch(action.type) {
        case actionsTypes.SET_LANDING:
            return { ...state, landing: action.payload };
        default:
            return state;
    }
};

export const setContactReducer = (state = { contactForm: false }, action) => {
    switch(action.type) {
        case actionsTypes.SET_CONTACTFORM:
            return { ...state, contactForm: action.payload };
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

export const messengerReducer = (state = { isSidebarOpen: true, currentChatRoomID: null, currentChatRoom: null, usersChatRoomsID: [], currentChatRoomName: 'Unanimity', notification: null }, action) => {
    switch(action.type) {
        case actionsTypes.SET_ISSIDEBAROPEN:
            return { ...state, isSidebarOpen: action.payload };
        case actionsTypes.SET_CURRENTCHATROOMID:
            return { ...state, currentChatRoomID: action.payload };
        case actionsTypes.SET_CURRENTCHATROOM:
            return { ...state, currentChatRoom: action.payload };
        case actionsTypes.SET_CURRENTCHATROOMNAME:
            return { ...state, currentChatRoomName: action.payload };
        case actionsTypes.SET_USERSCHATROOMSID:
            return { ...state, usersChatRoomsID: action.payload };
        case actionsTypes.SET_NOTIFICATION:
            return { ...state, notification: action.payload };
        default:
            return state;
    }
};