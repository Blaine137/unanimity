export const SET_AUTHENTICATION = 'SET_AUTHENTICATION';

export const setAuthentication = authStatus => ({
    type: SET_AUTHENTICATION,
    payload: authStatus
});

