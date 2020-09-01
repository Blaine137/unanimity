export const SET_LANDING = 'SET_LANDING';
export const SET_CONTACTFORM = 'SET_CONTACTFORM';
export const SET_AUTHENTICATION = 'SET_AUTHENTICATION';
export const SET_USER_ID = 'SET_USER_ID';
export const SET_USERNAME = 'SET_USERNAME';

export const setLanding = landingStatus => ({
    type: SET_LANDING,
    payload: landingStatus
});

export const setContactForm = contactStatus => ({
    type: SET_CONTACTFORM,
    payload: contactStatus
});

export const setAuthentication = (authStatus = false) => ({
    type: SET_AUTHENTICATION,
    payload: authStatus
});

export const setUserId = (userId = null) => ({
    type: SET_USER_ID,
    payload: userId
});

export const setUsername = (username = null) => ({
    type: SET_USERNAME,
    payload: username
});



