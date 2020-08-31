export const SET_LANDING = 'SET_LANDING';
export const SET_CONTACTFORM = 'SET_CONTACTFORM';
export const SET_AUTHENTICATION = 'SET_AUTHENTICATION';

export const setLanding = landingStatus => ({
    type: SET_LANDING,
    payload: landingStatus
});

export const setContactForm = contactStatus => ({
    type: SET_CONTACTFORM,
    payload: contactStatus
});

export const setAuthentication = authStatus => ({
    type: SET_AUTHENTICATION,
    payload: authStatus
});



